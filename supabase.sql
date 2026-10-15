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

-- Copies supprimées : leur identifiant est gardé pour qu'un appareil ne puisse pas les renvoyer
create table if not exists public.attempt_tombstones (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  deleted_at timestamptz not null default now()
);
alter table public.attempt_tombstones enable row level security;
revoke all on public.attempt_tombstones from anon;
grant select on public.attempt_tombstones to authenticated;
drop policy if exists tombstones_select on public.attempt_tombstones;
create policy tombstones_select on public.attempt_tombstones for select to authenticated using (user_id = auth.uid());
-- Une copie supprimée qu'un appareil renvoie est ignorée en silence (pas d'erreur de synchro)
create or replace function public.skip_tombstoned_attempt() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.attempt_tombstones t where t.id = new.id) then return null; end if;
  return new;
end $$;
drop trigger if exists attempts_skip_tombstoned on public.attempts;
create trigger attempts_skip_tombstoned before insert on public.attempts
  for each row execute function public.skip_tombstoned_attempt();

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
-- Contrôle en direct : heure de départ avancée par le créateur (« Démarrer maintenant »)
alter table public.group_tests add column if not exists starts_at timestamptz;

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

-- Propriétaire du groupe : peut supprimer ou démarrer n'importe quel contrôle du groupe
create or replace function public.owns_group(gid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.groups g where g.id = gid and g.created_by = auth.uid())
$$;
revoke all on function public.owns_group(uuid) from public, anon;
grant execute on function public.owns_group(uuid) to authenticated;

drop policy if exists group_tests_select on public.group_tests;
create policy group_tests_select on public.group_tests for select to authenticated using (public.is_member(group_id));
drop policy if exists group_tests_insert on public.group_tests;
create policy group_tests_insert on public.group_tests for insert to authenticated
  with check (public.is_member(group_id) and created_by = auth.uid());
drop policy if exists group_tests_delete on public.group_tests;
create policy group_tests_delete on public.group_tests for delete to authenticated
  using (created_by = auth.uid() or public.owns_group(group_id));
drop policy if exists group_tests_update on public.group_tests;
create policy group_tests_update on public.group_tests for update to authenticated
  using (created_by = auth.uid() or public.owns_group(group_id))
  with check (created_by = auth.uid() or public.owns_group(group_id));
grant update (starts_at) on public.group_tests to authenticated;

-- ---------- 1v1 supprimé (12/10/2026) ----------
-- La liste de tous les inscrits ne sert plus : elle est retirée des bases où elle avait été créée.
drop function if exists public.list_players();

-- ---------- Données synchronisées entre appareils (parcours, copies, sujets blancs en cours…) ----------
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

-- ---------- Copies des contrôles de groupe supprimés ----------
-- Chaque appareil demande lesquels de ses contrôles de groupe existent encore et retire les copies des autres.
create or replace function public.existing_group_tests(ids uuid[])
returns table (id uuid) language sql stable security definer set search_path = public as $$
  select gt.id from public.group_tests gt where gt.id = any(ids)
$$;
revoke all on function public.existing_group_tests(uuid[]) from public, anon;
grant execute on function public.existing_group_tests(uuid[]) to authenticated;

-- ---------- Administrateur du site et boîte à suggestions ----------
create table if not exists public.admins (
  user_id uuid primary key references public.profiles(id) on delete cascade
);
alter table public.admins enable row level security;
drop policy if exists admins_self on public.admins;
create policy admins_self on public.admins for select to authenticated using (user_id = auth.uid());
grant select on public.admins to authenticated;
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid())
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
-- (l'administrateur est ajouté à la main : insert into public.admins (user_id) values ('<id du profil>');)

create table if not exists public.feedback (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid default auth.uid() references public.profiles(id) on delete set null,
  kind       text not null check (kind in ('bug', 'idee', 'autre')),
  message    text not null check (char_length(message) between 3 and 2000),
  page       text check (char_length(page) <= 200),
  status     text not null default 'nouveau' check (status in ('nouveau', 'vu', 'fait')),
  created_at timestamptz not null default now()
);
create index if not exists feedback_created_idx on public.feedback (created_at desc);
alter table public.feedback enable row level security;
grant select, insert, update, delete on public.feedback to authenticated;
drop policy if exists feedback_insert on public.feedback;
create policy feedback_insert on public.feedback for insert to authenticated
  with check (user_id = auth.uid() and status = 'nouveau');
drop policy if exists feedback_select on public.feedback;
create policy feedback_select on public.feedback for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists feedback_update on public.feedback;
create policy feedback_update on public.feedback for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists feedback_delete on public.feedback;
create policy feedback_delete on public.feedback for delete to authenticated using (public.is_admin());

-- Toutes les stats du site, pour le tableau de bord de l'administrateur uniquement (pas d'e-mails)
create or replace function public.admin_site_data() returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then
    raise exception 'Réservé à l''administrateur du site' using errcode = '42501';
  end if;
  return jsonb_build_object(
    'profiles', (select coalesce(jsonb_agg(jsonb_build_object('id', id, 'pseudo', pseudo, 'visible', visible, 'created_at', created_at)), '[]'::jsonb) from public.profiles),
    'attempts', (select coalesce(jsonb_agg(jsonb_build_object('user_id', user_id, 'def_id', def_id, 'kind', kind, 'title', title, 'note', note, 'used_s', used_s, 'results', results, 'created_at', created_at)), '[]'::jsonb) from public.attempts),
    'controls', (select coalesce(jsonb_agg(jsonb_build_object('user_id', user_id, 'name', name, 'items', items, 'created_at', created_at)), '[]'::jsonb) from public.controls),
    'group_tests', (select coalesce(jsonb_agg(jsonb_build_object('id', id, 'group_id', group_id, 'title', title, 'created_at', created_at)), '[]'::jsonb) from public.group_tests),
    'groups', (select coalesce(jsonb_agg(jsonb_build_object('id', id, 'name', name)), '[]'::jsonb) from public.groups),
    'memberships', (select coalesce(jsonb_agg(jsonb_build_object('group_id', group_id, 'user_id', user_id)), '[]'::jsonb) from public.memberships),
    -- autres matières (user_data) : par compte et par clé, compétences validées (maîtrise ≥ 100) du parcours
    -- « x.path.v1 », nombre de copies et notes (dans l'ordre) des sujets blancs « x.hist.v1 »
    'subjects', (select coalesce(jsonb_agg(jsonb_build_object('user_id', u.user_id, 'key', u.key, 'updated_at', u.updated_at,
        'valid', case when u.key like '%.path.v1' and jsonb_typeof(u.value->'sk') = 'object'
          then (select count(*) from jsonb_each(u.value->'sk') s where jsonb_typeof(s.value->'m') = 'number' and (s.value->>'m')::numeric >= 100) end,
        'n', case when u.key like '%.hist.v1' and jsonb_typeof(u.value) = 'array' then jsonb_array_length(u.value) end,
        'notes', case when u.key like '%.hist.v1' and jsonb_typeof(u.value) = 'array'
          then (select coalesce(jsonb_agg(h.e->'note' order by h.i), '[]'::jsonb) from jsonb_array_elements(u.value) with ordinality h(e, i)) end)), '[]'::jsonb)
      from public.user_data u where u.key like '%.path.v1' or u.key like '%.hist.v1')
  );
end
$$;
revoke all on function public.admin_site_data() from public, anon;
grant execute on function public.admin_site_data() to authenticated;

-- =====================================================================
-- Sujets blancs d'élec en groupe (2026-10-13) : correction croisée
-- group_tests.subject ('maths' ou 'elec') et group_tests.def (tirage du sujet d'élec)
-- =====================================================================
alter table public.group_tests add column if not exists subject text not null default 'maths';
alter table public.group_tests add column if not exists def jsonb;

create or replace function public.test_member(t uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.group_tests g where g.id = t and public.is_member(g.group_id)); $$;
create or replace function public.test_member_txt(t text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.group_tests g where g.id::text = t and public.is_member(g.group_id)); $$;
create or replace function public.test_over(t uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.group_tests g where g.id = t and g.starts_at is not null and g.starts_at + make_interval(secs => g.duration_s) < now()); $$;
create or replace function public.test_over_txt(t text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.group_tests g where g.id::text = t and g.starts_at is not null and g.starts_at + make_interval(secs => g.duration_s) < now()); $$;
revoke all on function public.test_member(uuid), public.test_member_txt(text), public.test_over(uuid), public.test_over_txt(text) from public, anon;
grant execute on function public.test_member(uuid), public.test_member_txt(text), public.test_over(uuid), public.test_over_txt(text) to authenticated;

create table if not exists public.elec_copies (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.group_tests(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  ans jsonb not null default '{}'::jsonb, res jsonb not null default '{}'::jsonb,
  auto_pts numeric not null default 0, dur integer,
  photos text[] not null default '{}',
  reviewer uuid references auth.users(id) on delete set null,
  self jsonb, review_pts numeric, comment text, reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (test_id, user_id)
);
alter table public.elec_copies enable row level security;
revoke all on public.elec_copies from anon;
grant select, insert, update on public.elec_copies to authenticated;
drop policy if exists elec_copies_select on public.elec_copies;
create policy elec_copies_select on public.elec_copies for select to authenticated
  using (user_id = auth.uid() or reviewer = auth.uid() or (public.test_member(test_id) and public.test_over(test_id)));
drop policy if exists elec_copies_insert on public.elec_copies;
create policy elec_copies_insert on public.elec_copies for insert to authenticated
  with check (user_id = auth.uid() and public.test_member(test_id) and reviewer is null and review_pts is null);
drop policy if exists elec_copies_update on public.elec_copies;
create policy elec_copies_update on public.elec_copies for update to authenticated
  using (user_id = auth.uid() or reviewer = auth.uid()) with check (user_id = auth.uid() or reviewer = auth.uid());

-- L'élève ne peut ajouter que ses photos ; le correcteur ne peut toucher qu'à la correction
create or replace function public.elec_copies_guard() returns trigger
language plpgsql set search_path = public as $$
begin
  new.id := old.id; new.test_id := old.test_id; new.user_id := old.user_id; new.created_at := old.created_at;
  if auth.uid() is null or current_setting('app.elec_assign', true) = '1' then return new; end if;
  if auth.uid() = old.reviewer and auth.uid() <> old.user_id then
    new.ans := old.ans; new.res := old.res; new.auto_pts := old.auto_pts; new.dur := old.dur; new.photos := old.photos; new.reviewer := old.reviewer;
  else
    new.ans := old.ans; new.res := old.res; new.auto_pts := old.auto_pts; new.dur := old.dur; new.reviewer := old.reviewer;
    new.self := old.self; new.review_pts := old.review_pts; new.comment := old.comment; new.reviewed_at := old.reviewed_at;
  end if;
  return new;
end $$;
drop trigger if exists elec_copies_guard on public.elec_copies;
create trigger elec_copies_guard before update on public.elec_copies for each row execute function public.elec_copies_guard();

-- Correction croisée : après le chrono (ou plus tôt par le créateur ou le propriétaire du groupe)
create or replace function public.assign_elec_reviewers(t uuid) returns void
language plpgsql security definer set search_path = public as $$
declare ids uuid[]; n int; i int; g record;
begin
  select * into g from public.group_tests where id = t;
  if not found or not public.is_member(g.group_id) then raise exception 'not a member'; end if;
  if not public.test_over(t) and not (g.created_by = auth.uid() or public.owns_group(g.group_id)) then raise exception 'too early'; end if;
  perform set_config('app.elec_assign', '1', true);
  select array_agg(user_id order by random()) into ids from public.elec_copies where test_id = t and reviewer is null;
  n := coalesce(array_length(ids, 1), 0);
  if n > 0 then
    if n >= 2 and not exists (select 1 from public.elec_copies where test_id = t and reviewer is not null) then
      for i in 1..n loop
        update public.elec_copies set reviewer = ids[(i % n) + 1] where test_id = t and user_id = ids[i];
      end loop;
    else
      update public.elec_copies c set reviewer = (select o.user_id from public.elec_copies o where o.test_id = t and o.user_id <> c.user_id order by random() limit 1)
        where c.test_id = t and c.reviewer is null;
    end if;
  end if;
  perform set_config('app.elec_assign', '', true);
end $$;
revoke all on function public.assign_elec_reviewers(uuid) from public, anon;
grant execute on function public.assign_elec_reviewers(uuid) to authenticated;

-- Photos des copies papier : elec-copies/<test>/<élève>/<fichier>.jpg
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('elec-copies', 'elec-copies', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
drop policy if exists elec_copies_obj_insert on storage.objects;
create policy elec_copies_obj_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'elec-copies' and (storage.foldername(name))[2] = auth.uid()::text and public.test_member_txt((storage.foldername(name))[1]));
drop policy if exists elec_copies_obj_select on storage.objects;
create policy elec_copies_obj_select on storage.objects for select to authenticated
  using (bucket_id = 'elec-copies' and public.test_member_txt((storage.foldername(name))[1])
    and ((storage.foldername(name))[2] = auth.uid()::text or public.test_over_txt((storage.foldername(name))[1])
      or exists (select 1 from public.elec_copies c where c.test_id::text = (storage.foldername(name))[1] and c.user_id::text = (storage.foldername(name))[2] and c.reviewer = auth.uid())));
drop policy if exists elec_copies_obj_delete on storage.objects;
create policy elec_copies_obj_delete on storage.objects for delete to authenticated
  using (bucket_id = 'elec-copies' and (storage.foldername(name))[2] = auth.uid()::text);
