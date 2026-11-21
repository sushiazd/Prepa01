// Connexion par QR code (comme TikTok / WhatsApp Web).
// 1. L'appareil à connecter (ex. le PC de la salle) demande un QR : « create » → { id, secret, pin }.
//    Le QR ne contient que l'id ; le secret reste dans la page de cet appareil, qui affiche aussi le code à 2 chiffres (pin).
// 2. Le téléphone déjà connecté scanne le QR (accueil du site ?qr=<id>), voit l'appareil (« info »)
//    et valide (« approve ») avec son propre jeton de connexion ET le code affiché sur l'écran à connecter.
//    Le code empêche l'hameçonnage : quelqu'un qui envoie un lien ?qr=… à distance ne peut pas le faire valider,
//    la victime ne voyant pas son écran. 3 essais faux et le QR est inutilisable.
// 3. L'appareil interroge « poll » avec id + secret. Une fois validé, il reçoit une seule fois un jeton
//    de connexion à usage unique (lien magique généré sans e-mail) qu'il échange contre une session.
// Un QR vit 3 minutes et ne sert qu'une fois ; 100 QR au plus par adresse IP (une salle entière passe souvent par la même) et par tranche de
// 10 minutes, 1000 en cours au total : de quoi empêcher de remplir la table sans gêner une classe.
// Table public.qr_logins, lue seulement ici (clé secrète).
// Déployée dans le projet Supabase sous le nom « qr-login » (verify_jwt désactivé : la fonction
// vérifie elle-même le jeton de l'utilisateur pour « info » et « approve »).
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.117.2";

// Transition : tant que le nouveau site (qui affiche et demande le code) n'est pas en ligne, un QR créé par
// l'ancien site (sans « v: 2 ») reste validable sans code. Passer à true une fois le nouveau site publié.
const PIN_REQUIRED = false;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

// clé secrète : la nouvelle (sb_secret_…) d'abord, l'ancienne « service_role » pouvant être désactivée
function secretKey() {
  try { const k = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}'); const v = k.default || Object.values(k)[0]; if (v) return String(v); } catch { /* absent */ }
  return Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
}
const admin = createClient(Deno.env.get('SUPABASE_URL')!, secretKey(), {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function sha256(s: string) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('');
}
function randomSecret() {
  const b = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function randomPin() {
  const b = crypto.getRandomValues(new Uint32Array(1));
  return String(b[0] % 100).padStart(2, '0');
}
async function userOf(req: Request) {
  const m = /^Bearer\s+(.+)$/.exec(req.headers.get('Authorization') || '');
  if (!m) return null;
  const { data, error } = await admin.auth.getUser(m[1]);
  return error || !data.user ? null : data.user;
}
const clientIp = (req: Request) => (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'inconnue';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Méthode POST attendue' }, 405);
  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch { /* corps invalide */ }
  const a = String(b.a || ''), id = String(b.id || '');
  const now = new Date().toISOString();
  try {
    if (a === 'create') {
      // ménage : QR expirés depuis plus de 10 minutes (jetons de connexion périmés, aucune donnée d'élève)
      await admin.from('qr_logins').delete().lt('expires_at', new Date(Date.now() - 600000).toISOString());
      const ip_hash = await sha256('qr-login:' + clientIp(req));
      const since = new Date(Date.now() - 600000).toISOString();
      const { count: mine } = await admin.from('qr_logins').select('id', { count: 'exact', head: true }).eq('ip_hash', ip_hash).gt('created_at', since);
      const { count: all } = await admin.from('qr_logins').select('id', { count: 'exact', head: true }).gt('expires_at', now);
      if ((mine || 0) >= 100 || (all || 0) >= 1000) return json({ error: 'Trop de QR codes demandés, réessaie dans quelques minutes' }, 429);
      const secret = randomSecret();
      const pin = PIN_REQUIRED || Number(b.v) >= 2 ? randomPin() : null;
      const agent = String(b.agent || '').replace(/[^\w .·()\/-]/g, '').slice(0, 60);
      const { data, error } = await admin.from('qr_logins').insert({ secret_hash: await sha256(secret), agent, pin, ip_hash }).select('id,expires_at').single();
      if (error) throw error;
      return json({ id: data.id, secret, pin, expires: data.expires_at });
    }
    if (!UUID.test(id)) return json({ error: 'QR code invalide' }, 400);

    if (a === 'poll') {
      const h = await sha256(String(b.secret || ''));
      // validé : la ligne est supprimée dans la même requête, le jeton ne peut sortir qu'une fois
      const { data: done } = await admin.from('qr_logins').delete().eq('id', id).eq('secret_hash', h).not('user_id', 'is', null).select('user_id');
      if (done && done.length) {
        const { data: u, error: e1 } = await admin.auth.admin.getUserById(done[0].user_id);
        if (e1 || !u.user?.email) throw e1 || new Error('Compte introuvable');
        const { data: link, error: e2 } = await admin.auth.admin.generateLink({ type: 'magiclink', email: u.user.email });
        if (e2) throw e2;
        return json({ status: 'ok', token_hash: link.properties.hashed_token });
      }
      const { data: row } = await admin.from('qr_logins').select('expires_at').eq('id', id).eq('secret_hash', h).maybeSingle();
      if (!row || row.expires_at < now) return json({ status: 'expired' });
      return json({ status: 'pending' });
    }

    if (a === 'info' || a === 'approve') {
      const user = await userOf(req);
      if (!user) return json({ error: 'Connexion requise' }, 401);
      const { data: row } = await admin.from('qr_logins').select('agent,created_at,expires_at,user_id,pin,tries').eq('id', id).maybeSingle();
      if (!row || row.expires_at < now) return json({ status: 'expired' });
      if (row.user_id) return json({ status: 'used' });
      const needPin = !!row.pin || PIN_REQUIRED;
      if (a === 'info') {
        return json({ status: 'pending', pin: needPin, agent: row.agent || '', age: Math.max(0, Math.round((Date.now() - Date.parse(row.created_at)) / 1000)) });
      }
      if (needPin && (!row.pin || String(b.pin || '').trim() !== row.pin)) {
        const tries = (row.tries || 0) + 1;
        // 3 codes faux : le QR ne peut plus servir (il faut en afficher un nouveau)
        await admin.from('qr_logins').update(tries >= 3 ? { tries, expires_at: now } : { tries }).eq('id', id).is('user_id', null);
        return json({ status: tries >= 3 || !row.pin ? 'expired' : 'badpin', left: Math.max(0, 3 - tries) });
      }
      const { data: ok } = await admin.from('qr_logins').update({ user_id: user.id, approved_at: now }).eq('id', id).is('user_id', null).gt('expires_at', now).lt('tries', 3).select('id');
      return json({ status: ok && ok.length ? 'ok' : 'expired' });
    }
    return json({ error: 'Action inconnue' }, 400);
  } catch (e) {
    console.error(e);
    return json({ error: 'Erreur du serveur' }, 500);
  }
});
