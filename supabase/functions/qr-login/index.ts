// Connexion par QR code (comme TikTok / WhatsApp Web).
// 1. L'appareil à connecter (ex. le PC de la salle) demande un QR : « create » → { id, secret }.
//    Le QR ne contient que l'id ; le secret reste dans la page de cet appareil.
// 2. Le téléphone déjà connecté scanne le QR (accueil du site ?qr=<id>), voit l'appareil (« info »)
//    et valide (« approve ») avec son propre jeton de connexion.
// 3. L'appareil interroge « poll » avec id + secret. Une fois validé, il reçoit une seule fois un jeton
//    de connexion à usage unique (lien magique généré sans e-mail) qu'il échange contre une session.
// Un QR vit 3 minutes et ne sert qu'une fois. Table public.qr_logins, lue seulement ici (clé de service).
// Déployée dans le projet Supabase sous le nom « qr-login » (verify_jwt désactivé : la fonction
// vérifie elle-même le jeton de l'utilisateur pour « info » et « approve »).
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.117.2";

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
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
async function userOf(req: Request) {
  const m = /^Bearer\s+(.+)$/.exec(req.headers.get('Authorization') || '');
  if (!m) return null;
  const { data, error } = await admin.auth.getUser(m[1]);
  return error || !data.user ? null : data.user;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Méthode POST attendue' }, 405);
  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch { /* corps invalide */ }
  const a = String(b.a || ''), id = String(b.id || '');
  const now = new Date().toISOString();
  try {
    if (a === 'create') {
      // ménage : QR expirés depuis plus de 10 minutes
      await admin.from('qr_logins').delete().lt('expires_at', new Date(Date.now() - 600000).toISOString());
      const secret = randomSecret();
      const agent = String(b.agent || '').replace(/[^\w .·()\/-]/g, '').slice(0, 60);
      const { data, error } = await admin.from('qr_logins').insert({ secret_hash: await sha256(secret), agent }).select('id,expires_at').single();
      if (error) throw error;
      return json({ id: data.id, secret, expires: data.expires_at });
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
      if (a === 'info') {
        const { data: row } = await admin.from('qr_logins').select('agent,created_at,expires_at,user_id').eq('id', id).maybeSingle();
        if (!row || row.expires_at < now) return json({ status: 'expired' });
        if (row.user_id) return json({ status: 'used' });
        return json({ status: 'pending', agent: row.agent || '', age: Math.max(0, Math.round((Date.now() - Date.parse(row.created_at)) / 1000)) });
      }
      const { data: ok } = await admin.from('qr_logins').update({ user_id: user.id, approved_at: now }).eq('id', id).is('user_id', null).gt('expires_at', now).select('id');
      return json({ status: ok && ok.length ? 'ok' : 'expired' });
    }
    return json({ error: 'Action inconnue' }, 400);
  } catch (e) {
    console.error(e);
    return json({ error: 'Erreur du serveur' }, 500);
  }
});
