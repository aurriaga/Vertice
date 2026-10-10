// Arnés de pruebas de Vértice (se inyecta en la página con javascript_tool)
(function () {
  window.T = {
    async load(names, base) {
      base = base || '/docs/';
      try { Object.keys(localStorage).filter((k) => /^vertice\./.test(k)).forEach((k) => localStorage.removeItem(k)); } catch (e) {}
      const app = V.app;
      app.settings.industry = 'otra'; app.settings.industryAuto = undefined; app.settings.entity = ''; app.settings.closeDate = '';
      app.sources = []; app.tables = []; app.model = app.Q = app.R = app.rep = null;
      app.settings.company = ''; app.settings.companyAuto = undefined; app.settings.overrides = { expenses: {} };
      const dt = new DataTransfer();
      for (const n of names) {
        const r = await fetch(base + n.split('/').map(encodeURIComponent).join('/'));
        if (!r.ok) throw new Error('no ' + n + ' ' + r.status);
        const b = await r.blob();
        dt.items.add(new File([b], n.split('/').pop(), { type: b.type }));
      }
      const inp = document.querySelector('#file-input');
      inp.files = dt.files;
      T.t0 = performance.now();
      inp.dispatchEvent(new Event('change', { bubbles: true }));
      return 'started';
    },
    async wait(maxMs) {
      // espera a que se oculte el aviso de "Leyendo…" sin temporizadores (en una pestaña oculta se frenan)
      const busyEl = document.querySelector('#busy');
      await new Promise((res) => {
        if (busyEl.hidden && performance.now() - T.t0 > 50 && V.app.sources.length) return res();
        const mo = new MutationObserver(() => busyEl.hidden && (mo.disconnect(), res()));
        mo.observe(busyEl, { attributes: true });
        setTimeout(() => (mo.disconnect(), res()), maxMs || 40000);
      });
      const busy = !document.querySelector('#busy').hidden;
      return { busy, text: busy ? document.querySelector('#busy-text').textContent : null, ms: Math.round(performance.now() - T.t0), sources: V.app.sources.length, tables: V.app.tables.length, error: V.app.error || null };
    },
    tables(filter) {
      return V.app.tables.filter((t) => !filter || t.type === filter || (filter === '!otro' && t.type !== 'otro')).map((t) => ({ name: t.name, type: t.type, on: t.enabled, rows: t.rows.length, scale: t.scale, title: (t.titleLines || []).slice(-2).join(' / ').slice(0, 90), cols: t.headers.map((h, i) => (h == null ? '·' : String(h).slice(0, 26)) + (t.mapping && t.mapping[i] ? '→' + t.mapping[i] : '')).slice(0, 10).join(' | ') }));
    },
    types() { const c = {}; V.app.tables.forEach((t) => (c[t.type] = (c[t.type] || 0) + 1)); return c; },
    notes() { return V.app.sources.map((s) => ({ name: s.name, notes: s.notes.map((n) => n.level + ': ' + n.text) })); },
    raw(name, n) { const t = V.app.tables.find((x) => x.name === name); if (!t) return null; return [t.headers.join(' ¦ ')].concat(t.rows.slice(0, n || 40).map((r) => r.map((v) => (v === null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v).slice(0, 40))).join(' ¦ '))); },
    fig() {
      const st = V.app.model && V.app.model.statements;
      if (!st) return null;
      const out = {};
      st.periods.forEach((p) => { const f = st.fig[p]; out[p] = {}; Object.keys(f).forEach((k) => { if (f[k] !== null && f[k] !== undefined && f[k] !== 0) out[p][k] = typeof f[k] === 'number' ? Math.round(f[k]) : f[k]; }); });
      return { periods: st.periods, info: st.info, fig: out };
    },
    async demo() {
      const b = Array.from(document.querySelectorAll('button')).find((x) => /empresa de ejemplo/i.test(x.textContent));
      T.t0 = performance.now();
      b.click();
      return T.wait(60000);
    },
    snap() {
      const a = V.app;
      const rep = a.rep;
      const st = a.model && a.model.statements;
      const m = (x) => (x == null ? null : Math.round(x / 1e6));
      return {
        company: a.settings.company,
        industry: a.settings.industry,
        headline: rep && rep.vertex ? rep.vertex.headline || rep.vertex.title : null,
        kpis: rep ? rep.kpis.map((k) => k.label + '=' + (k.fmt === 'money' ? m(k.value) : Math.round((k.value || 0) * 1000) / 1000)) : null,
        exhibits: rep && rep.pillars ? Object.fromEntries(rep.pillars.map((p) => [p.id, (p.exhibits || []).map((e) => (e.title || '').slice(0, 70))])) : null,
        periods: st ? st.periods : null,
        fig: st ? Object.fromEntries(st.periods.map((p) => [p, ['rev', 'cogs', 'ebit', 'ni', 'ta', 'eq'].map((k) => m(st.fig[p][k])).join('|')])) : null,
        sales: a.model ? a.model.sales.length : 0,
        issues: a.model ? a.model.issues.map((i) => i.title) : null,
        types: T.types(),
      };
    },
    summary() {
      const a = V.app;
      return { company: a.settings.company, industry: a.settings.industry, rep: !!a.rep, fin: !!a.fin, bank: !!a.bank, sales: a.model ? a.model.sales.length : 0, headline: a.rep && a.rep.vertex ? (a.rep.vertex.headline || a.rep.vertex.title || null) : null, types: T.types(), error: a.error };
    },
  };
  return 'ok';
})();
