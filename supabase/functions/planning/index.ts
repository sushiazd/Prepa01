// Relais vers l'emploi du temps ADE de l'Université de Rennes (export iCal).
// Le serveur de l'université n'autorise pas la lecture depuis un autre site (pas d'en-tête CORS) :
// cette fonction récupère le calendrier côté serveur et le renvoie au site Prépa 01.
// Elle n'accepte QUE les liens d'export ADE de planning.univ-rennes.fr (pas un relais ouvert),
// et seulement pour un compte connecté : la clé publique du site ne suffit pas.
// Déployée dans le projet Supabase sous le nom « planning » (verify_jwt activé).
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ALLOWED = /^https:\/\/planning\.univ-rennes\.fr\/jsp\/custom\/modules\/plannings\/(?:[A-Za-z0-9]{4,32}\.shu|anonymous_cal\.jsp\?[A-Za-z0-9=&,._%-]{1,1000})$/;
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

// Le jeton doit être celui d'un utilisateur connecté (vérifié auprès du service d'authentification)
async function signedIn(req: Request): Promise<boolean> {
  const auth = req.headers.get('Authorization') || '';
  const key = Deno.env.get('SUPABASE_ANON_KEY') || req.headers.get('apikey') || '';
  if (!/^Bearer\s+ey/.test(auth)) return false;
  try {
    const r = await fetch(`${Deno.env.get('SUPABASE_URL')}/auth/v1/user`, { headers: { Authorization: auth, apikey: key } });
    if (!r.ok) return false;
    const u = await r.json();
    return !!(u && u.id);
  } catch { return false; }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Méthode POST attendue' }, 405);
  if (!await signedIn(req)) return json({ error: 'Connexion requise' }, 401);
  let url = '';
  try { const b = await req.json(); url = typeof b?.url === 'string' ? b.url.trim() : ''; } catch { /* corps invalide */ }
  if (!ALLOWED.test(url)) return json({ error: "Lien non reconnu : il faut un lien d'export ADE de planning.univ-rennes.fr (…/plannings/XXXX.shu)" }, 400);
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 15000);
  try {
    const r = await fetch(url, { signal: ctl.signal, redirect: 'manual', headers: { 'User-Agent': 'Prepa01-planning/1.0' } });
    if (r.status !== 200) return json({ error: `Le serveur de planning a répondu ${r.status}` }, 502);
    const text = await r.text();
    if (text.length > 4_000_000) return json({ error: 'Calendrier trop volumineux' }, 502);
    if (!text.startsWith('BEGIN:VCALENDAR')) return json({ error: "La réponse n'est pas un calendrier (lien expiré ?)" }, 502);
    return new Response(text, { headers: { ...CORS, 'Content-Type': 'text/calendar; charset=utf-8', 'Cache-Control': 'no-store' } });
  } catch (_e) {
    return json({ error: 'Serveur de planning injoignable' }, 504);
  } finally {
    clearTimeout(timer);
  }
});
