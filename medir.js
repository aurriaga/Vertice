// Medidor del ciclo de mejora de Vértice.
// Se inyecta en la app (http://localhost:8765/) con un <script src>, porque la
// CSP no permite eval. Corre cada caso del corpus, compara con los valores de
// referencia (tomados del propio documento con un lector independiente) y
// revisa invariantes del informe. Deja el resultado en window.MEDICION.
(function () {
  const M = 1e3, MM = 1e6;                       // M$ y MM$ a pesos
  // esperado: {periodo: {campo: valor en pesos}}; '*' = el período más reciente
  const CASOS = [
    { id: 'tvn-2026-06', soloEstados: true, archivos: ['/docs/Estados Financieros TVN al 06-2026.pdf'], empresa: /televisi[oó]n nacional/i,
      esperado: { 'ene–jun 2026': { ta: 103811608 * M, tl: 97825265 * M, eq: 5986343 * M, rev: 22291139 * M, cogs: 23260411 * M, ni: -7925668 * M },
                  '2025': { ta: 100652868 * M, eq: 14633467 * M }, 'ene–jun 2025': { rev: 24237233 * M, ni: -7507494 * M } } },
    { id: 'tvn-2026-03', soloEstados: true, archivos: ['/docs/Estados-Financieros-TVN-03-2026.pdf'], empresa: /televisi[oó]n nacional/i,
      esperado: { 'ene–mar 2026': { ta: 106191715 * M, tl: 95376303 * M, eq: 10815412 * M, rev: 10801240 * M, ni: -3818055 * M },
                  '2025': { ta: 100652868 * M }, 'ene–mar 2025': { rev: 10488822 * M, ni: -5688910 * M } } },
    { id: 'tvn-2025-12', soloEstados: true, archivos: ['/docs/Estados-Financieros-TVN-31-12-2025.pdf'], empresa: /televisi[oó]n nacional/i,
      esperado: { '2025': { ta: 100652868 * M, tl: 86019401 * M, eq: 14633467 * M, ni: -15528705 * M },
                  '2024': { ta: 103380615 * M, tl: 72063989 * M, eq: 31316626 * M, ni: -18533865 * M } } },
    { id: 'tvn-2025-09', soloEstados: true, archivos: ['/docs/Estados_Financieros_TVN-30_09_2025.pdf'], empresa: /televisi[oó]n nacional/i,
      esperado: { 'ene–sep 2025': { ta: 103339242 * M, tl: 84390311 * M, eq: 18948931 * M, rev: 35543509 * M, ni: -11773318 * M },
                  '2024': { ta: 103380615 * M, eq: 31316626 * M }, 'ene–sep 2024': { rev: 33933490 * M, ni: -16423268 * M } } },
    { id: 'tvn-2025-06', soloEstados: true, archivos: ['/docs/Estados-Financieros-TVN-junio-2025.pdf'], empresa: /televisi[oó]n nacional/i,
      esperado: { 'ene–jun 2025': { rev: 24237233 * M, ni: -7507494 * M, eq: 23214755 * M } } },
    { id: 'tvn-2025-03', soloEstados: true, archivos: ['/docs/1-Estados-Financieros-TVN-032025.pdf'], empresa: /televisi[oó]n nacional/i,
      esperado: { 'ene–mar 2025': { ta: 109300323 * M, tl: 83672607 * M, eq: 25627716 * M, rev: 10488822 * M, ni: -5688910 * M },
                  '2024': { ta: 103380615 * M }, 'ene–mar 2024': { rev: 12089545 * M, ni: -5703842 * M } } },
    // el caso de la exportación del usuario (10-10-2026): el anual 2025 más el trimestre siguiente
    { id: 'tvn-anual-y-trimestre', soloEstados: true, lento: true, exportar: true, empresa: /televisi[oó]n nacional/i, coherencia: true,
      archivos: ['/docs/Estados-Financieros-TVN-31-12-2025.pdf', '/docs/Estados-Financieros-TVN-03-2026.pdf'],
      esperado: { '2025': { ta: 100652868 * M, eq: 14633467 * M, ni: -15528705 * M },
                  'ene–mar 2026': { ta: 106191715 * M, eq: 10815412 * M, rev: 10801240 * M, ni: -3818055 * M } } },
    { id: 'tvn-todos', soloEstados: true, lento: true, empresa: /televisi[oó]n nacional/i,
      archivos: ['/docs/Estados Financieros TVN al 06-2026.pdf', '/docs/Estados-Financieros-TVN-03-2026.pdf', '/docs/Estados-Financieros-TVN-31-12-2025.pdf',
                 '/docs/Estados_Financieros_TVN-30_09_2025.pdf', '/docs/Estados-Financieros-TVN-junio-2025.pdf', '/docs/1-Estados-Financieros-TVN-032025.pdf'],
      esperado: { '2025': { ta: 100652868 * M, tl: 86019401 * M, eq: 14633467 * M, ni: -15528705 * M },
                  '2024': { ta: 103380615 * M, eq: 31316626 * M, ni: -18533865 * M },
                  'ene–jun 2026': { ta: 103811608 * M, rev: 22291139 * M, ni: -7925668 * M } } },
    { id: 'banco-chile-2026-08', soloEstados: true, archivos: ['/docs/EEFF-Agosto-26_Banco_de_Chile_espan_ol.pdf'], empresa: /banco de chile/i,
      esperado: { '*': { ta: 55804006 * MM, tl: 50019324 * MM, eq: 5784682 * MM, ni: 837847 * MM } } },
    { id: 'redglobal-2026-06', soloEstados: true, archivos: ['/docs/EEFF-RedGlobal-06-2026.pdf'], empresa: /red ?global/i,
      esperado: { 'ene–jun 2026': { ta: 19303813 * M, tl: 8849928 * M, eq: 10453885 * M, rev: 14072394 * M, ni: 575521 * M },
                  '2025': { ta: 17629975 * M }, 'ene–jun 2025': { ni: -523868 * M } } },
    { id: 'farmaceutica-xlsx', soloEstados: true, archivos: ['/docs/BALANCES.xlsx'], empresa: /farmac[eé]utica/i,
      esperado: { '*': { ta: 3571487569, tl: 2544701085, eq: 1026786484, rev: 1382723487, cogs: 1236115427 } } },
    { id: 'pasfer-ifrs-xlsx', soloEstados: true, archivos: ['/esc/PASFER_EEFF_IFRS_2026.xlsx'], empresa: /pasfer/i,
      esperado: { '2025': { rev: 440682276, ni: 29609506 } } },
    { id: 'pasfer-8col-2024', soloEstados: true, lento: true, archivos: ['/docs/balance_general_2024_pasfer_chile_spa .firmado.pdf'], empresa: /pasfer/i, esperado: {} },
    { id: 'pasfer-8col-2025', soloEstados: true, lento: true, archivos: ['/docs/balance_general_2025_pasfer_chile_spa firmado.pdf'], empresa: /pasfer/i, esperado: {} },
    { id: 'muestras-ventas', archivos: ['/mejora/muestras/ventas_2024_2025.xlsx', '/mejora/muestras/gastos_2024_2025.csv',
      '/mejora/muestras/presupuesto_2025.xlsx', '/mejora/muestras/inventario_2025.pdf'], ventas: true, esperado: {} },
    { id: 'demo', demo: true, exportar: true, esperado: {} }
  ];

  const errores = [];
  const origErr = console.error;
  console.error = function (...a) { errores.push(a.map(String).join(' ').slice(0, 300)); return origErr.apply(this, a); };
  window.addEventListener('error', (e) => errores.push('window.error: ' + (e.message || e.error)));
  window.addEventListener('unhandledrejection', (e) => errores.push('promesa: ' + String(e.reason && (e.reason.message || e.reason)).slice(0, 300)));

  const sleep = (ms) => new Promise((r) => { const ch = new MessageChannel(); const t0 = performance.now(); ch.port1.onmessage = () => (performance.now() - t0 >= ms ? r() : ch.port2.postMessage(0)); ch.port2.postMessage(0); });

  async function cargar(archivos) {
    try { Object.keys(localStorage).filter((k) => /^vertice\./.test(k)).forEach((k) => localStorage.removeItem(k)); } catch (e) {}
    const app = V.app;
    app.settings.industry = 'otra'; app.settings.industryAuto = undefined; app.settings.entity = ''; app.settings.closeDate = '';
    app.sources = []; app.tables = []; app.model = app.Q = app.R = app.rep = null; app.error = null;
    app.settings.company = ''; app.settings.companyAuto = undefined; app.settings.overrides = { expenses: {} };
    const dt = new DataTransfer();
    for (const n of archivos) {
      const r = await fetch(n.split('/').map((x, i) => (i < 2 ? x : encodeURIComponent(x))).join('/'));
      if (!r.ok) throw new Error('no se pudo traer ' + n + ' (' + r.status + ')');
      const b = await r.blob();
      dt.items.add(new File([b], decodeURIComponent(n.split('/').pop()), { type: b.type }));
    }
    const inp = document.querySelector('#file-input');
    inp.files = dt.files;
    inp.dispatchEvent(new Event('change', { bubbles: true }));
  }
  async function esperar(maxMs) {
    const t0 = performance.now(), busy = document.querySelector('#busy');
    await sleep(300);
    while (performance.now() - t0 < maxMs) {
      if (busy.hidden && (V.app.sources.length || V.app.error)) { await sleep(400); if (busy.hidden) break; }
      await sleep(250);
    }
    return { ms: Math.round(performance.now() - t0), colgado: !busy.hidden };
  }
  async function verReporte() {
    const b = [...document.querySelectorAll('button')].find((x) => /3\s*Reporte/.test(x.textContent));
    if (b) b.click();
    await sleep(1200);
    const v = document.querySelector('#view-reporte');
    return v ? v : null;
  }

  const cerca = (a, b) => a != null && b != null && Math.abs(a - b) <= Math.max(1, Math.abs(b) * 0.005);
  const fmt = (x) => (x == null ? '—' : (Math.round(x / 1e6) / 1).toLocaleString('es-CL') + ' MM');

  async function correrCaso(c) {
    const out = { id: c.id, checks: [], datos: {} };
    const check = (ok, que, detalle) => out.checks.push({ ok: !!ok, que, detalle: detalle || '' });
    const nErr0 = errores.length;
    const t0 = performance.now();
    try {
      if (c.demo) {
        const b = [...document.querySelectorAll('button')].find((x) => /empresa de ejemplo/i.test(x.textContent));
        b.click();
      } else await cargar(c.archivos);
      const w = await esperar(c.lento ? 600000 : 240000);
      out.datos.ms = Math.round(performance.now() - t0);
      check(!w.colgado, 'la lectura termina', w.colgado ? 'sigue "Leyendo…" después de ' + w.ms + ' ms' : '');
    } catch (e) { check(false, 'la carga no falla', e.message); return out; }

    const a = V.app;
    check(!a.error, 'sin error de la app', a.error ? String(a.error.message || a.error).slice(0, 200) : '');
    const st = a.model && a.model.statements;
    out.datos.empresa = a.settings.company;
    out.datos.industria = a.settings.industry;
    out.datos.periodos = st ? st.periods : [];
    out.datos.tablas = a.tables.length;
    if (c.empresa) check(c.empresa.test(a.settings.company || ''), 'nombre de la empresa', 'salió «' + (a.settings.company || '') + '»');
    else check((a.settings.company || '').length < 80, 'nombre de la empresa razonable', '«' + (a.settings.company || '') + '»');

    // cifras contra la referencia
    for (const [per, campos] of Object.entries(c.esperado)) {
      const p = per === '*' ? (st && st.periods[0]) : per;
      const f = st && st.fig[p];
      if (!f) { check(false, 'período ' + per, 'no existe; períodos: ' + (st ? st.periods.join(', ') : 'sin estados')); continue; }
      for (const [k, v] of Object.entries(campos)) check(cerca(f[k], v), `${p} · ${k}`, `esperado ${fmt(v)}, salió ${fmt(f[k])}`);
    }
    // invariantes de los estados
    if (st) for (const p of st.periods) {
      const f = st.fig[p];
      if (f.ta && f.tl != null && f.eq != null) check(Math.abs(f.ta - f.tl - f.eq) <= Math.abs(f.ta) * 0.01, `${p} · activo = pasivo + patrimonio`, `${fmt(f.ta)} vs ${fmt(f.tl + f.eq)}`);
      if (f.rev != null && f.cogs != null && f.gp != null) check(Math.abs(f.rev - f.cogs - f.gp) <= Math.max(Math.abs(f.rev) * 0.01, 1), `${p} · ingresos − costo = margen bruto`, `${fmt(f.rev)} − ${fmt(f.cogs)} ≠ ${fmt(f.gp)}`);
    }
    if (c.ventas) check(a.model && a.model.sales.length > 0, 'lee las ventas', (a.model ? a.model.sales.length : 0) + ' filas');

    // el informe
    check(!!a.rep, 'se genera el informe');
    const v = await verReporte();
    if (v) {
      const txt = v.innerText;
      const malos = txt.match(/\bNaN\b|undefined|Infinity|\[object Object\]|null %|\$ ?-?0,0 ?MM? de \$ ?0/g) || [];
      check(!malos.length, 'el informe no muestra valores rotos', malos.slice(0, 5).join(', '));
      const svgs = [...v.querySelectorAll('svg')].filter((s) => s.getBoundingClientRect().width > 50);
      // vacío = sin formas y sin un trazo con varios puntos (una mini línea de tendencia es path + punto)
      const vacios = svgs.filter((s) => s.querySelectorAll('rect,path,circle,line,polyline,polygon').length < 3
        && ![...s.querySelectorAll('path,polyline')].some((p) => ((p.getAttribute('d') || p.getAttribute('points') || '').match(/\d[\s,]+-?\d/g) || []).length >= 3));
      out.datos.graficos = svgs.length;
      check(svgs.length >= 4, 'el informe trae gráficos', svgs.length + ' gráficos');
      check(!vacios.length, 'ningún gráfico vacío', vacios.length + ' vacíos');
      const svgMal = svgs.filter((s) => /NaN|undefined|Infinity/.test(s.outerHTML));
      check(!svgMal.length, 'gráficos sin coordenadas rotas', svgMal.length + ' con NaN/undefined');
      out.datos.titular = a.rep && a.rep.vertex ? String(a.rep.vertex.headline || a.rep.vertex.title || '').slice(0, 220) : '';
      // --- interpretación: lo que dice el informe tiene que ser cierto ---
      // D2: no comparar resultados contra un período que no tiene estado de resultados ("2025: $ 0 en 12 meses")
      const ceroMeses = txt.match(/:\s*\$\s*0 en \d+ meses/g) || [];
      check(!ceroMeses.length, 'no compara resultados contra un período sin estado de resultados', ceroMeses.slice(0, 2).join(' | '));
      const tablasER = [...v.querySelectorAll('table')].filter((tb) => /Estado de resultados comparativo/i.test((tb.closest('figure, section, div') || tb).innerText.slice(0, 300)));
      const nuevos = tablasER.reduce((s, tb) => s + (tb.innerText.match(/\bnuevo\b/g) || []).length, 0);
      check(nuevos < 3, 'el estado de resultados comparativo tiene base de comparación', nuevos + ' partidas "nuevo"');
      // D3: sin datos mensuales no hay gráficos mensuales ni de estacionalidad
      if (c.soloEstados && a.rep && a.rep.pillars) {
        const inventados = a.rep.pillars.flatMap((p) => (p.exhibits || []).map((e) => e.title || '')).filter((t) => /mensual|estacionalidad|por mes\b|mes a mes/i.test(t));
        check(!inventados.length, 'no muestra datos mensuales que el documento no trae', inventados.slice(0, 3).join(' | '));
      }
      // E1: un solo período en todo el informe: el del consultor es el de la portada, y un tramo de meses no se compara
      // con un año completo ("ene–mar 2026 … ($ 46.850 MM en 2024)", "al ritmo anual … vs 2025")
      const portada = (txt.match(/Período: ([^\n]+?) vs /) || [])[1];
      const consultor = (txt.match(/ejercicio ([^\n]+?) comparado con/) || [])[1];
      if (portada && consultor) check(portada === consultor, 'el informe del consultor usa el período de la portada', 'portada «' + portada + '», consultor «' + consultor + '»');
      const mezcla = txt.match(/\b(?:ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov)[–-][a-z]{3} \d{4}[^.\n]{0,90}\(\$ ?[\d.,]+ MM en \d{4}\)/g) || [];
      check(!mezcla.length, 'no compara un tramo de meses con un año completo', mezcla.slice(0, 2).join(' | '));
      if (c.coherencia) check(!/al ritmo anual equivalen/.test(txt), 'con el mismo tramo del año anterior disponible, no anualiza', '');
      // D5: un "% del total" no puede pasar de 100%
      const sobre100 = [];
      v.querySelectorAll('table').forEach((tb) => {
        const hs = [...tb.querySelectorAll('thead th, tr:first-child th')].map((th) => th.innerText.trim());
        const ci = hs.findIndex((h) => /^% ?(del )?total$/i.test(h));
        if (ci < 0) return;
        tb.querySelectorAll('tbody tr').forEach((tr) => {
          const cel = tr.children[ci];
          const n = cel ? parseFloat(cel.innerText.replace(/\./g, '').replace(',', '.')) : NaN;
          if (n > 100.5) sobre100.push(cel.innerText.trim());
        });
      });
      check(!sobre100.length, 'ningún "% del total" pasa de 100%', sobre100.slice(0, 3).join(', '));
      // coherencia: si el último período tiene pérdida, el titular no puede hablar de ganancia sin matices
      const f0 = st && st.fig[st.periods[0]];
      // D4: una pérdida que se achica no "sube": se dice que la pérdida bajó
      if (f0 && f0.ebit < 0) {
        const malDicho = txt.match(/resultado operacional (subi[oó]|aument[oó]|creci[oó]|mejor[oó] un)[^.\n]{0,40}/gi) || [];
        check(!malDicho.length, 'la variación de una pérdida se explica como pérdida', malDicho.slice(0, 2).join(' | '));
      }
      if (f0 && f0.ni != null && out.datos.titular) {
        const dicePerdida = /p[ée]rdida|negativ|d[ée]ficit|cae|baja|deterior/i.test(out.datos.titular);
        const diceGanancia = /\bgan(a|ó|ancia)|utilidad positiva|rentable/i.test(out.datos.titular);
        if (f0.ni < 0) check(!(diceGanancia && !dicePerdida), 'el titular es coherente con la pérdida', '«' + out.datos.titular + '»');
      }
    } else check(false, 'se puede abrir el informe');

    // E1: las tres exportaciones dicen lo mismo (los mismos indicadores con los mismos montos, y las mismas tablas)
    if (c.exportar && a.rep) {
      try {
        if (!window.EXP) {
          const s = document.createElement('script');
          s.src = '/mejora/exportes.js?' + Date.now();
          document.head.appendChild(s);
          await new Promise((r, j) => { s.onload = r; s.onerror = j; });
        }
        await EXP.generar();
        const R = EXP.res;
        const f$ = (x) => V.U.fmtMoney(x, { compact: true }).replace(/-/g, '−');
        const plano = (s) => String(s).replace(/[−-]/g, '-').replace(/\s+/g, ' ');
        const pdf1 = plano(R.pdf.slice(0, 2).flat().join(' '));
        const kpiL = R.pptx.find((s) => s.texto.some((t) => /^Estado actual$/i.test(t.trim())));
        const ppt1 = plano(kpiL ? kpiL.texto.join(' ') : '');
        const res = R.xlsx['Resumen'] || [];
        const faltan = [];
        a.rep.kpis.filter((k) => k.fmt === 'money').forEach((k) => {
          const t = plano(f$(k.value));
          if (!pdf1.includes(t)) faltan.push(k.label + ' (PDF)');
          if (!ppt1.includes(t)) faltan.push(k.label + ' (PowerPoint)');
          const fila = res.find((r) => String(r[0]).trim() === k.label);
          if (!fila || typeof fila[1] !== 'number' || Math.abs(fila[1] - k.value) > Math.max(1, Math.abs(k.value) * 0.005)) faltan.push(k.label + ' (Excel)');
        });
        check(!faltan.length, 'los indicadores son los mismos en PDF, PowerPoint y Excel', faltan.slice(0, 6).join(', '));
        const dif = EXP.compararPdfPpt();
        check(!dif.length, 'las tablas del PowerPoint coinciden con las del PDF', dif.slice(0, 2).map((d) => 'L' + d.lamina + '/' + d.pagina + ': ' + d.distintas.map((x) => x.rotulo).join(', ')).join(' | '));
      } catch (e) { check(false, 'se generan las tres exportaciones', e.message); }
    }

    const nuevos = errores.slice(nErr0);
    check(!nuevos.length, 'sin errores en la consola', nuevos.slice(0, 3).join(' | '));
    return out;
  }

  window.MEDICION = { estado: 'lista', casos: CASOS.map((c) => c.id), resultados: [] };
  window.MEDIR = async function (ids) {
    const lista = CASOS.filter((c) => !ids || ids.includes(c.id));
    Object.assign(window.MEDICION, { estado: 'corriendo', resultados: [], inicio: new Date().toISOString() });
    for (const c of lista) {
      window.MEDICION.actual = c.id;
      let r;
      try { r = await correrCaso(c); } catch (e) { r = { id: c.id, checks: [{ ok: false, que: 'el medidor no se cae', detalle: e.message }], datos: {} }; }
      window.MEDICION.resultados.push(r);
    }
    const tot = window.MEDICION.resultados.flatMap((r) => r.checks);
    Object.assign(window.MEDICION, { estado: 'lista', actual: null, fin: new Date().toISOString(),
      puntaje: tot.length ? Math.round((tot.filter((x) => x.ok).length / tot.length) * 1000) / 10 : 0,
      pasan: tot.filter((x) => x.ok).length, total: tot.length });
    return window.MEDICION;
  };
  // resumen compacto para el registro
  window.RESUMEN = function () {
    const m = window.MEDICION;
    return { puntaje: m.puntaje, pasan: m.pasan, total: m.total, casos: m.resultados.map((r) => ({ id: r.id, ok: r.checks.filter((x) => x.ok).length + '/' + r.checks.length,
      ms: r.datos.ms, empresa: r.datos.empresa, periodos: (r.datos.periodos || []).join(', '), graficos: r.datos.graficos,
      fallas: r.checks.filter((x) => !x.ok).map((x) => x.que + (x.detalle ? ': ' + x.detalle : '')) })) };
  };
  return 'medidor listo';
})();
