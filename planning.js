/* =====================================================================
   Planning : emploi du temps ADE de l'Université de Rennes (export iCal)
   - Le lien d'export (…/plannings/XXXX.shu) est enregistré dans le compte (clé planning.v1,
     synchronisée par account.js). Le calendrier est récupéré par la fonction Supabase
     « planning » (le serveur de l'université n'autorise pas la lecture directe depuis le site).
   - Les évaluations (CC, QCM, oraux, TOEIC…) sont repérées dans les intitulés.
   - La date du CC d'électronique analogique remplit le compte à rebours de la page élec.
   Utilisé par l'accueil : <div id="vPlan"> (onglet) et <div id="planBanner"> (prochaine évaluation).
   ===================================================================== */
(function () {
  'use strict';
  const PREF = 'planning.v1', CACHE = 'planning.cache.v1', TZ = 'Europe/Paris';
  const LINK_RE = /^https:\/\/planning\.univ-rennes\.fr\/jsp\/custom\/modules\/plannings\/(?:[A-Za-z0-9]{4,32}\.shu|anonymous_cal\.jsp\?[A-Za-z0-9=&,._%-]{1,1000})$/;
  const get = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const A = () => window.SiteAccount;

  /* ---------- Lecture du fichier iCal ---------- */
  const unesc = s => s.replace(/\\n/gi, '\n').replace(/\\([,;\\])/g, '$1');
  function icsDate(v) {
    const m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?/.exec(v || '');
    if (!m) return null;
    const [, y, mo, d, h = '0', mi = '0', s = '0', z] = m;
    return z ? Date.UTC(+y, +mo - 1, +d, +h, +mi, +s) : new Date(+y, +mo - 1, +d, +h, +mi, +s).getTime();
  }
  function parseICS(text) {
    const lines = text.replace(/\r\n?/g, '\n').replace(/\n[ \t]/g, '').split('\n');
    const out = []; let ev = null;
    for (const line of lines) {
      if (line === 'BEGIN:VEVENT') { ev = {}; continue; }
      if (line === 'END:VEVENT') {
        if (ev && ev.s) out.push(ev);
        ev = null; continue;
      }
      if (!ev) continue;
      const i = line.indexOf(':'); if (i < 0) continue;
      const key = line.slice(0, i).split(';')[0], val = line.slice(i + 1);
      if (key === 'DTSTART') ev.s = icsDate(val);
      else if (key === 'DTEND') ev.e = icsDate(val);
      else if (key === 'SUMMARY') ev.t = unesc(val).trim();
      else if (key === 'LOCATION') ev.l = unesc(val).trim();
      else if (key === 'DESCRIPTION') ev.d = unesc(val).replace(/\(Updated\s*:[^)]*\)/i, '').trim();
      else if (key === 'UID') ev.id = val;
    }
    return out.sort((a, b) => a.s - b.s);
  }

  /* ---------- Classement des événements ---------- */
  const SUBJ = { ELECA: 'Électronique analogique', ELECN: 'Électronique numérique', MATH: 'Maths', MATHS: 'Maths', PHYS: 'Physique',
    ALGO: 'Algorithmique', MECA: 'Mécanique', ANG: 'Anglais', ATO: 'Atomistique' };
  const LINKS = { ELECA: 'elec/', MATH: 'maths-s1/', MATHS: 'maths-s1/', ATO: 'ato/', ALGO: 'algo/', PHYS: 'phys/', MECA: 'meca/' };
  // second CC de maths (janvier) : partie analyse
  const linkOf = e => { const sj = subjOf(e); if (/QCM/i.test(e.t)) return 'maths/'; if ((sj === 'MATH' || sj === 'MATHS') && e.s > Date.parse('2026-12-01')) return 'maths-s1-analyse/'; if (sj === 'ELECA' && e.s > Date.parse('2026-10-20')) return 'elec2/'; return LINKS[sj]; };
  const isTiers = e => /tiers[\s-]*temps/i.test(e.t);
  const isRatt = e => /rattrapage/i.test(e.t);
  const isEval = e => /(?:^|[^A-Za-zÀ-ÿ])(CC|QCM|DS|EXAMEN|EXAM|PARTIEL|CONTR[ÔO]LE|INTERRO|TOEIC|TOIEC|ORAUX|ORAL|SOUTENANCE|[ÉE]VALUATION)(?![A-Za-zÀ-ÿ])/i.test(e.t);
  function subjOf(e) {
    const m = /(?:^|[^A-Za-z])(ELECa|ELECn|MATHS?|PHYS|ALGO|MECA|ANG|ATO)(?![A-Za-z])/i.exec(e.t);
    return m ? m[1].toUpperCase() : '';
  }
  function kindOf(e) {
    if (/QCM/i.test(e.t)) return 'QCM';
    if (/oraux|oral/i.test(e.t)) return 'Oral';
    if (/TOEIC|TOIEC/i.test(e.t)) return 'TOEIC blanc';
    if (/(?:^|[^A-Za-z])CC(?![A-Za-z])/.test(e.t)) return 'CC';
    return 'Évaluation';
  }
  const roomOf = e => !e.l || /cherche la salle/i.test(e.l) ? 'salle pas encore attribuée' : e.l;

  /* ---------- Dates (heure de Paris) ---------- */
  const fmt = (ts, o) => new Intl.DateTimeFormat('fr-FR', Object.assign({ timeZone: TZ }, o)).format(new Date(ts));
  const dayKey = ts => fmt(ts, { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-');   // AAAA-MM-JJ
  const hm = ts => fmt(ts, { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');
  const dayLong = ts => fmt(ts, { weekday: 'long', day: 'numeric', month: 'long' });
  function daysUntil(ts) {
    const a = new Date(dayKey(Date.now()) + 'T00:00:00Z'), b = new Date(dayKey(ts) + 'T00:00:00Z');
    return Math.round((b - a) / 864e5);
  }
  const relDay = n => n === 0 ? "aujourd'hui" : n === 1 ? 'demain' : n === 2 ? 'après-demain' : n < 0 ? 'passé' : `dans ${n} jours`;
  // lundi de la semaine qui contient ts (clé AAAA-MM-JJ)
  function mondayOf(ts) {
    const k = dayKey(ts), d = new Date(k + 'T12:00:00Z'), w = (d.getUTCDay() + 6) % 7;
    return new Date(d.getTime() - w * 864e5).toISOString().slice(0, 10);
  }
  const addDays = (key, n) => new Date(new Date(key + 'T12:00:00Z').getTime() + n * 864e5).toISOString().slice(0, 10);

  /* ---------- Données ---------- */
  const prefs = () => Object.assign({ url: '', tiers: false }, get(PREF, {}) || {});
  function savePrefs(p) { put(PREF, p); if (A()) A().touch(PREF); }
  const cache = () => get(CACHE, null);
  let busy = false, lastErr = '', weekKey = null;

  // Comparaison avec la version précédente : cours déplacés, changés de salle, ajoutés ou supprimés
  function diff(prev, next) {
    const now = Date.now(), P = new Map(prev.filter(e => e.id).map(e => [e.id, e])), N = new Map(next.filter(e => e.id).map(e => [e.id, e]));
    if (!P.size || !N.size) return [];
    let common = 0; N.forEach((_, id) => { if (P.has(id)) common++; });
    if (common < 0.6 * Math.min(P.size, N.size)) return [];   // identifiants régénérés : comparaison impossible
    const out = [];
    N.forEach((e, id) => {
      const o = P.get(id);
      if (o) { if (e.s > now - 864e5 && (o.s !== e.s || o.e !== e.e || (o.l || '') !== (e.l || '') || o.t !== e.t)) out.push({ k: 'mod', id, t: e.t, s: e.s, e: e.e, l: e.l, os: o.s, oe: o.e, ol: o.l }); }
      else if (e.s > now) out.push({ k: 'add', id, t: e.t, s: e.s, e: e.e, l: e.l });
    });
    P.forEach((o, id) => { if (!N.has(id) && o.s > now) out.push({ k: 'del', id, t: o.t, s: o.s, e: o.e, l: o.l }); });
    // supprimé puis recréé ailleurs dans les 15 jours : c'est un déplacement
    out.filter(x => x.k === 'del').forEach(dl => { const a = out.find(x => x.k === 'add' && x.t === dl.t && Math.abs(x.s - dl.s) < 15 * 864e5); if (a) { Object.assign(a, { k: 'mod', os: dl.s, oe: dl.e, ol: dl.l }); dl.k = 'gone'; } });
    return out.filter(x => x.k !== 'gone');
  }
  function mergeChanges(old, fresh) {
    const now = Date.now(), byId = new Map((old || []).filter(x => x.at > now - 7 * 864e5 && x.s > now - 864e5).map(x => [x.id, x]));
    fresh.forEach(x => {
      const o = byId.get(x.id);
      if (o && o.k === 'mod' && x.k === 'mod') Object.assign(x, { os: o.os, oe: o.oe, ol: o.ol });   // on garde l'horaire d'origine
      if (x.k === 'mod' && x.os === x.s && x.oe === x.e && (x.ol || '') === (x.l || '') ) { byId.delete(x.id); return; }   // revenu comme avant
      byId.set(x.id, Object.assign(x, { at: now }));
    });
    return [...byId.values()].sort((a, b) => a.s - b.s);
  }
  const FRESH = 3 * 60e3;   // au-delà, on relit l'emploi du temps à l'ouverture ou au retour sur la page

  async function refresh(force) {
    const p = prefs(), acc = A(), c = cache();
    if (!p.url || busy || !acc || !acc.user || !acc.client) return;
    if (!force && c && c.url === p.url && Date.now() - c.at < FRESH) return;
    busy = true; lastErr = ''; render();
    try {
      const { data } = await acc.client.auth.getSession();
      const token = data && data.session && data.session.access_token, C = window.QCM_CONFIG || {};
      if (!token) throw new Error('Connexion requise');
      const r = await fetch(C.supabaseUrl + '/functions/v1/planning', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token, apikey: C.supabaseAnonKey },
        body: JSON.stringify({ url: p.url })
      });
      const txt = await r.text();
      if (!r.ok) { let m = 'Erreur ' + r.status; try { m = JSON.parse(txt).error || m; } catch (e) { /* ignore */ } throw new Error(m); }
      const evs = parseICS(txt);
      if (!evs.length) throw new Error('Calendrier vide : le lien est peut-être expiré.');
      const same = c && c.url === p.url && Array.isArray(c.evs);
      put(CACHE, { url: p.url, at: Date.now(), evs, chg: mergeChanges(same ? c.chg : [], same ? diff(c.evs, evs) : []) });
      fillElecDate(evs);
    } catch (e) { lastErr = e.message || String(e); }
    busy = false; render();
  }
  // Compte à rebours de la page élec : la date du prochain CC d'électronique analogique
  function fillElecDate(evs) {
    const next = evs.find(e => e.s > Date.now() - 864e5 && subjOf(e) === 'ELECA' && isEval(e) && !isTiers(e) && !isRatt(e));
    if (!next) return;
    const key = dayKey(next.s), cur = get('elec.ccdate.v1', '');
    if (!cur || cur < dayKey(Date.now())) { put('elec.ccdate.v1', key); if (A()) A().touch('elec.ccdate.v1'); }
  }

  /* ---------- Affichage ---------- */
  function evalsOf(evs, p) {
    const today = dayKey(Date.now());
    return evs.filter(e => isEval(e) && !isRatt(e) && (p.tiers || !isTiers(e)) && dayKey(e.s) >= today);
  }
  function evalRow(e) {
    const sj = subjOf(e), n = daysUntil(e.s), link = linkOf(e);
    const name = sj ? SUBJ[sj] : /QCM/i.test(e.t) ? 'Maths' : '', k = kindOf(e);
    return `<li class="pl-ev${n <= 3 ? ' soon' : n <= 10 ? ' near' : ''}">
      <div class="pl-when"><b>${esc(relDay(n))}</b><span>${esc(dayLong(e.s))}</span></div>
      <div class="pl-what"><b>${esc(k)}${name ? ' · ' + esc(name) : ''}</b><span>${esc(hm(e.s))}${e.e ? '–' + esc(hm(e.e)) : ''} · ${esc(roomOf(e))}</span><small>${esc(e.t)}</small></div>
      ${link ? `<a class="btn" href="${link}">Réviser</a>` : '<span></span>'}</li>`;
  }
  // Description d'un changement : « 10h15 → 13h30 · salle B02 → B07 »
  function changeHTML(x) {
    const what = [];
    if (x.k === 'add') what.push('nouveau créneau');
    else if (x.k === 'del') what.push('supprimé (cours annulé ou déplacé)');
    else {
      if (dayKey(x.os) !== dayKey(x.s)) what.push(`déplacé du ${dayLong(x.os)} ${hm(x.os)} au ${dayLong(x.s)} ${hm(x.s)}`);
      else if (x.os !== x.s || x.oe !== x.e) what.push(`horaire ${hm(x.os)}–${hm(x.oe)} → <b>${hm(x.s)}–${hm(x.e)}</b>`);
      if ((x.ol || '') !== (x.l || '')) what.push(`salle ${esc(x.ol || '?')} → <b>${esc(x.l || '?')}</b>`);
      if (!what.length) what.push('intitulé modifié');
    }
    return `<li class="pl-c ${x.k}"><span class="d">${esc(dayLong(x.s))} · ${esc(hm(x.s))}</span><span class="t">${esc(x.t)}</span><span class="w">${what.join(' · ')}</span><span class="a">détecté ${esc(ago(x.at))}</span></li>`;
  }
  const upcomingChanges = c => ((c && c.chg) || []).filter(x => x.s > Date.now() - 3 * 3600e3);
  function weekHTML(evs, p) {
    const chg = new Map(upcomingChanges(cache()).map(x => [x.id, x]));
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekKey, i));
    const by = {}; evs.forEach(e => { const k = dayKey(e.s); if (k >= days[0] && k <= days[6] && (p.tiers || !isTiers(e))) (by[k] = by[k] || []).push(e); });
    const label = `${fmt(new Date(days[0] + 'T12:00:00Z'), { day: 'numeric', month: 'long' })} – ${fmt(new Date(days[6] + 'T12:00:00Z'), { day: 'numeric', month: 'long' })}`;
    const today = dayKey(Date.now());
    return `<div class="pl-weekhead"><button type="button" class="btn" data-pl="prev" aria-label="Semaine précédente">←</button><b>${esc(label)}</b><button type="button" class="btn" data-pl="next" aria-label="Semaine suivante">→</button>${weekKey !== mondayOf(Date.now()) ? '<button type="button" class="btn btn-ghost" data-pl="now">Cette semaine</button>' : ''}</div>
      <div class="pl-days">${days.filter((d, i) => i < 5 || by[d]).map(d => `<section class="pl-day${d === today ? ' today' : ''}"><h4>${esc(fmt(new Date(d + 'T12:00:00Z'), { weekday: 'long', day: 'numeric' }))}</h4>
        ${(by[d] || []).length ? `<ul>${by[d].map(e => `<li class="${isEval(e) && !isRatt(e) ? 'ev' : /réservé/i.test(e.t) ? 'muted' : ''}${chg.has(e.id) ? ' chg' : ''}"><span class="h">${esc(hm(e.s))}${e.e ? '–' + esc(hm(e.e)) : ''}${chg.has(e.id) ? ` <span class="badge">${chg.get(e.id).k === 'add' ? 'nouveau' : 'modifié'}</span>` : ''}</span><span class="t">${esc(e.t)}</span><span class="l">${esc(e.l && !/cherche la salle/i.test(e.l) ? e.l : '')}</span></li>`).join('')}</ul>` : '<p class="pl-none">Rien</p>'}</section>`).join('')}</div>`;
  }
  function render() {
    const host = document.getElementById('vPlan'); if (!host) { banner(); return; }
    const acc = A(), p = prefs(), c = cache();
    let body;
    if (!acc || !acc.configured) body = '<section class="acc"><h2>Planning indisponible</h2><p class="sub">Le site n\'est pas relié à sa base de données.</p></section>';
    else if (!acc.user && !(c && c.evs)) body = `<section class="acc"><p class="eyebrow">Planning</p><h2>Connecte-toi pour afficher ton emploi du temps</h2><p class="sub">Le planning passe par ton compte : connecte-toi dans l'onglet Révisions, puis reviens ici.</p><div class="acc-row"><button type="button" class="btn btn-primary" data-ht="rev">Me connecter</button></div></section>`;
    else if (!p.url) body = setupHTML('');
    else {
      const evs = (c && c.url === p.url && c.evs) || [];
      if (!weekKey) weekKey = mondayOf(Date.now());
      const ev = evalsOf(evs, p), ch = c && c.url === p.url ? upcomingChanges(c) : [];
      body = (ch.length ? `<section class="acc pl-chg"><p class="eyebrow" style="margin-bottom:8px">Emploi du temps</p><h2>Changements récents</h2><p class="sub">Ce qui a bougé depuis les lectures précédentes (7 derniers jours).</p><ul>${ch.slice(0, 12).map(changeHTML).join('')}</ul>${ch.length > 12 ? `<p class="fine">… et ${ch.length - 12} autres.</p>` : ''}</section>` : '') + `<section class="acc">
        <div class="acc-row"><div><p class="eyebrow" style="margin-bottom:8px">Planning</p><h2>Prochaines évaluations</h2></div><span class="sp"></span>
          <span class="fine">${busy ? 'Mise à jour…' : c && c.at ? 'Mis à jour ' + esc(ago(c.at)) : ''}</span>
          <button type="button" class="btn" data-pl="refresh" ${busy || !(acc && acc.user) ? 'disabled' : ''}>Actualiser</button></div>
        ${lastErr ? `<p class="acc-msg err">${esc(lastErr)}</p>` : ''}
        ${!acc.user ? '<p class="acc-msg">Tu n\'es pas connecté : ce planning vient de la dernière mise à jour sur cet appareil.</p>' : ''}
        ${evs.length ? (ev.length ? `<ul class="pl-evs">${ev.slice(0, 12).map(evalRow).join('')}</ul>${ev.length > 12 ? `<p class="fine">… et ${ev.length - 12} autres plus tard dans l'année.</p>` : ''}` : '<p class="sub">Aucune évaluation à venir dans ton emploi du temps.</p>') : busy ? '<p class="sub">Chargement de ton emploi du temps…</p>' : ''}
        <label class="pl-opt"><input type="checkbox" id="plTiers" ${p.tiers ? 'checked' : ''}> J'ai un tiers temps (afficher aussi les créneaux « tiers temps »)</label>
      </section>
      ${evs.length ? `<section class="acc"><h2>Emploi du temps</h2>${weekHTML(evs, p)}</section>` : ''}
      <details class="pl-more"><summary>Changer de lien d'emploi du temps</summary>${setupHTML(p.url, true)}</details>`;
    }
    host.innerHTML = body;
    banner();
  }
  function setupHTML(url, inner) {
    return `<section class="${inner ? 'pl-setup' : 'acc'}">${inner ? '' : '<p class="eyebrow">Planning</p><h2>Relie ton emploi du temps</h2>'}
      <ol class="pl-steps"><li>Connecte-toi sur <a href="https://planning.univ-rennes.fr/portal/planning/calendar" target="_blank" rel="noopener">planning.univ-rennes.fr</a>.</li>
        <li>Ouvre l'export de ton agenda (iCal / « exporter ») et copie le lien généré : il ressemble à <code>…/plannings/AbCd1234.shu</code>.</li>
        <li>Colle-le ici. Il est enregistré sur ton compte, pas dans le code public du site.</li></ol>
      <form class="pl-form" data-pl-form novalidate><input id="plUrl" type="url" placeholder="https://planning.univ-rennes.fr/jsp/custom/modules/plannings/….shu" value="${esc(url)}" autocomplete="off" spellcheck="false"><button type="submit" class="btn btn-primary">Enregistrer</button></form>
      <p class="acc-msg" id="plMsg"></p></section>`;
  }
  function ago(ts) {
    const m = Math.round((Date.now() - ts) / 60e3);
    return m < 1 ? "à l'instant" : m < 60 ? `il y a ${m} min` : m < 1440 ? `il y a ${Math.round(m / 60)} h` : `le ${fmt(ts, { day: 'numeric', month: 'short' })}`;
  }
  // Bandeau de l'onglet Révisions : la prochaine évaluation
  function banner() {
    const el = document.getElementById('planBanner'); if (!el) return;
    const c = cache(), p = prefs();
    const ev = c && c.evs && c.url === p.url ? evalsOf(c.evs, p) : [];
    const soon = c && c.url === p.url ? upcomingChanges(c).filter(x => x.s < Date.now() + 8 * 864e5) : [];
    const alert = soon.length ? `<p class="pl-alert"><b>⚠ ${soon.length} changement${soon.length > 1 ? 's' : ''} dans ton emploi du temps</b> d'ici une semaine (${soon.slice(0, 2).map(x => esc(x.t.replace(/-S1|\s*GR\s*A/g, '')) + ' le ' + esc(dayLong(x.s))).join(', ')}${soon.length > 2 ? '…' : ''}). <button type="button" class="linkbtn" data-ht="plan">Voir</button></p>` : '';
    if (!ev.length && !alert) { el.hidden = true; el.innerHTML = ''; return; }
    el.hidden = false;
    if (!ev.length) { el.innerHTML = alert; return; }
    const e = ev[0], sj = subjOf(e), n = daysUntil(e.s);
    el.innerHTML = alert + `<div><p class="eyebrow" style="margin-bottom:6px">Prochaine évaluation</p><b>${esc(kindOf(e))}${sj ? ' · ' + esc(SUBJ[sj]) : /QCM/i.test(e.t) ? ' · Maths' : ''}</b> <span>${esc(relDay(n))}, ${esc(dayLong(e.s))} à ${esc(hm(e.s))}</span></div>
      <span class="sp"></span>${linkOf(e) ? `<a class="btn btn-primary" href="${linkOf(e)}">Réviser</a>` : ''}<button type="button" class="btn" data-ht="plan">Tout le planning</button>`;
  }

  /* ---------- Événements ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-pl]'); if (!b) return;
    const a = b.dataset.pl;
    if (a === 'refresh') refresh(true);
    else if (a === 'prev') { weekKey = addDays(weekKey, -7); render(); }
    else if (a === 'next') { weekKey = addDays(weekKey, 7); render(); }
    else if (a === 'now') { weekKey = mondayOf(Date.now()); render(); }
  });
  document.addEventListener('change', e => { if (e.target.id === 'plTiers') { const p = prefs(); p.tiers = e.target.checked; savePrefs(p); render(); } });
  document.addEventListener('submit', e => {
    if (!e.target.matches('[data-pl-form]')) return;
    e.preventDefault();
    const v = (document.getElementById('plUrl').value || '').trim(), msg = document.getElementById('plMsg');
    if (!LINK_RE.test(v)) { msg.className = 'acc-msg err'; msg.textContent = 'Ce lien ne ressemble pas à un export ADE (il doit commencer par https://planning.univ-rennes.fr/jsp/custom/modules/plannings/ et finir par .shu).'; return; }
    const p = prefs(); p.url = v; savePrefs(p);
    weekKey = null; refresh(true);
  });

  const Planning = window.SitePlanning = { render, refresh, parseICS, isEval, subjOf, diff, mergeChanges };
  function wire() {
    const acc = A(); if (!acc) return;
    acc.on('change', () => { render(); refresh(false); });
    acc.on('data', keys => { if (keys.includes(PREF)) { weekKey = null; render(); refresh(false); } });
    acc.ready.then(() => { render(); refresh(false); });
    // relecture automatique : au retour sur la page, au retour du réseau, et toutes les 5 minutes si la page est visible
    document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(false); });
    window.addEventListener('online', () => refresh(false));
    setInterval(() => { if (!document.hidden) { refresh(false); if (!busy) render(); } }, 5 * 60e3);
  }
  if (A()) wire(); else window.addEventListener('siteaccount', wire, { once: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
  void Planning;
})();
