-- =====================================================================
--  QCM maths · base de données Supabase
--  À coller en entier dans Supabase → SQL Editor → New query → Run.
--  Peut être relancé sans risque (tout est « create or replace / if not exists »).
-- =====================================================================

-- ---------- Tables ----------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  pseudo     text not null check (char_length(pseudo) between 2 and 24),
  visible    boolean not null default true,         -- profil visible par les membres de mes groupes
  created_at timestamptz not null default now()
);
create unique index if not exists profiles_pseudo_uniq on public.profiles (lower(pseudo));

create table if not exists public.groups (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 60),
  code       text not null unique,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.memberships (
  group_id  uuid not null references public.groups(id) on delete cascade,
  user_id   uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);
create index if not exists memberships_user_idx on public.memberships (user_id);

-- Contrôles corrigés importés (PDF ou saisie manuelle)
create table if not exists public.controls (
  id         uuid primary key,
  user_id    uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  name       text not null check (char_length(name) <= 120),
  src        text,
  n          int not null check (n between 1 and 100),
  note_prof  numeric,
  items      jsonb not null,                        -- [{n, pts, max, theme, excerpt}]
  created_at timestamptz not null default now()
);
create index if not exists controls_user_idx on public.controls (user_id);

-- Épreuves rendues sur le site
create table if not exists public.attempts (
  id         uuid primary key,
  user_id    uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  def_id     text not null,
  kind       text not null,
  title      text not null check (char_length(title) <= 120),
  n          int not null check (n between 1 and 100),
  raw        numeric not null,
  note       numeric not null,
  used_s     int not null default 0,                -- temps de travail (pauses exclues)
  pauses     int not null default 0,
  results    jsonb not null,                        -- [{qid, theme, pts, status, t}]
  created_at timestamptz not null default now()
);
create index if not exists attempts_user_idx on public.attempts (user_id);

-- Contrôles communs d'un groupe (mêmes questions pour tout le monde)
create table if not exists public.group_tests (
  id          uuid primary key default gen_random_uuid(),
  group_id    uuid not null references public.groups(id) on delete cascade,
  title       text not null check (char_length(title) <= 120),
  qids        jsonb not null,
  duration_s  int not null check (duration_s between 60 and 14400),
  theme_count jsonb,
  created_by  uuid default auth.uid() references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);
create index if not exists group_tests_group_idx on public.group_tests (group_id);

-- ---------- Fonctions d'aide (security definer : évitent les boucles de règles) ----------
create or replace function public.is_member(g uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from memberships where group_id = g and user_id = auth.uid());
$$;

create or replace function public.shares_group(u uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from memberships a join memberships b on a.group_id = b.group_id
                 where a.user_id = auth.uid() and b.user_id = u);
$$;

create or replace function public.is_visible(u uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select visible from profiles where id = u), false);
$$;

-- Un compte créé ⇒ un profil (pseudo pris dans les métadonnées d'inscription, rendu unique)
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare base text; p text;
begin
  base := left(coalesce(nullif(trim(new.raw_user_meta_data->>'pseudo'), ''), 'eleve'), 19);
  if char_length(base) < 2 then base := base || '_'; end if;
  p := base;
  while exists (select 1 from profiles where lower(pseudo) = lower(p)) loop
    p := base || '-' || substr(md5(random()::text), 1, 4);
  end loop;
  insert into profiles (id, pseudo) values (new.id, p);
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.create_group(p_name text) returns public.groups
language plpgsql security definer set search_path = public as $$
declare g groups; c text; alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; i int;
begin
  if auth.uid() is null then raise exception 'Connexion requise'; end if;
  if coalesce(trim(p_name), '') = '' then raise exception 'Donne un nom au groupe'; end if;
  loop
    c := '';
    for i in 1..6 loop c := c || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1); end loop;
    exit when not exists (select 1 from groups where code = c);
  end loop;
  insert into groups (name, code, created_by) values (left(trim(p_name), 60), c, auth.uid()) returning * into g;
  insert into memberships (group_id, user_id) values (g.id, auth.uid());
  return g;
end $$;

create or replace function public.join_group(p_code text) returns uuid
language plpgsql security definer set search_path = public as $$
declare gid uuid;
begin
  if auth.uid() is null then raise exception 'Connexion requise'; end if;
  select id into gid from groups where code = upper(trim(p_code));
  if gid is null then raise exception 'Code de groupe inconnu'; end if;
  insert into memberships (group_id, user_id) values (gid, auth.uid()) on conflict do nothing;
  return gid;
end $$;

-- Suppression complète de son compte (profil, contrôles, épreuves, adhésions)
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Connexion requise'; end if;
  delete from auth.users where id = auth.uid();
end $$;

revoke all on function public.is_member(uuid), public.shares_group(uuid), public.is_visible(uuid),
  public.create_group(text), public.join_group(text), public.delete_my_account() from public, anon;
grant execute on function public.is_member(uuid), public.shares_group(uuid), public.is_visible(uuid),
  public.create_group(text), public.join_group(text), public.delete_my_account() to authenticated;

-- ---------- Règles d'accès (Row Level Security) ----------
alter table public.profiles    enable row level security;
alter table public.groups      enable row level security;
alter table public.memberships enable row level security;
alter table public.controls    enable row level security;
alter table public.attempts    enable row level security;
alter table public.group_tests enable row level security;

-- Droits d'accès aux tables pour les comptes connectés. Depuis mai 2026, Supabase ne les donne
-- plus automatiquement aux nouvelles tables : sans eux, toute requête du site est refusée.
-- Les règles ci-dessous (RLS) restreignent ensuite ligne par ligne. Rien pour « anon ».
grant select, update                 on public.profiles    to authenticated;
grant select, update, delete         on public.groups      to authenticated;
grant select, delete                 on public.memberships to authenticated;
grant select, insert, update, delete on public.controls    to authenticated;
grant select, insert, update, delete on public.attempts    to authenticated;
grant select, insert, delete         on public.group_tests to authenticated;
grant select, insert, update, delete on public.profiles, public.groups, public.memberships,
  public.controls, public.attempts, public.group_tests to service_role;

-- Profils : le sien, et ceux des membres visibles de ses groupes
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or (visible and public.shares_group(id)));
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Groupes : visibles par leurs membres ; création / adhésion via create_group / join_group
drop policy if exists groups_select on public.groups;
create policy groups_select on public.groups for select to authenticated using (public.is_member(id));
drop policy if exists groups_update on public.groups;
create policy groups_update on public.groups for update to authenticated
  using (created_by = auth.uid()) with check (created_by = auth.uid());
drop policy if exists groups_delete on public.groups;
create policy groups_delete on public.groups for delete to authenticated using (created_by = auth.uid());

drop policy if exists memberships_select on public.memberships;
create policy memberships_select on public.memberships for select to authenticated using (public.is_member(group_id));
drop policy if exists memberships_delete on public.memberships;
create policy memberships_delete on public.memberships for delete to authenticated using (user_id = auth.uid());

-- Contrôles et épreuves : les siens (lecture/écriture) + ceux des membres visibles de ses groupes (lecture)
drop policy if exists controls_select on public.controls;
create policy controls_select on public.controls for select to authenticated
  using (user_id = auth.uid() or (public.shares_group(user_id) and public.is_visible(user_id)));
drop policy if exists controls_write on public.controls;
create policy controls_write on public.controls for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists attempts_select on public.attempts;
create policy attempts_select on public.attempts for select to authenticated
  using (user_id = auth.uid() or (public.shares_group(user_id) and public.is_visible(user_id)));
drop policy if exists attempts_write on public.attempts;
create policy attempts_write on public.attempts for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists group_tests_select on public.group_tests;
create policy group_tests_select on public.group_tests for select to authenticated using (public.is_member(group_id));
drop policy if exists group_tests_insert on public.group_tests;
create policy group_tests_insert on public.group_tests for insert to authenticated
  with check (public.is_member(group_id) and created_by = auth.uid());
drop policy if exists group_tests_delete on public.group_tests;
create policy group_tests_delete on public.group_tests for delete to authenticated using (created_by = auth.uid());

-- ---------- 1v1 : liste des joueurs inscrits ----------
-- Le 1v1 propose d'affronter n'importe quel inscrit : seuls l'identifiant et le pseudo sont exposés
-- (aux comptes connectés uniquement). Le temps réel (présence, invitations, parties) passe par
-- les canaux Realtime de Supabase, sans table.
create or replace function public.list_players() returns table (id uuid, pseudo text)
language sql stable security definer set search_path = public as $$
  select p.id, p.pseudo from profiles p where auth.uid() is not null order by lower(p.pseudo);
$$;
revoke all on function public.list_players() from public, anon;
grant execute on function public.list_players() to authenticated;

-- ---------- Données synchronisées entre appareils (progression élec…) ----------
-- Une ligne par compte et par clé (ex. « elec.path.v1 » = le parcours d'élec). Le site
-- (account.js) fusionne ces données avec celles de l'appareil à chaque ouverture de page.
create table if not exists public.user_data (
  user_id    uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  key        text not null check (char_length(key) between 1 and 64),
  value      jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);
alter table public.user_data enable row level security;
grant select, insert, update, delete on public.user_data to authenticated;
grant select, insert, update, delete on public.user_data to service_role;
revoke all on public.user_data from anon;
revoke truncate, references, trigger on public.user_data from authenticated;
drop policy if exists user_data_own on public.user_data;
create policy user_data_own on public.user_data for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
