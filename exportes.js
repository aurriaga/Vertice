// Extractor de exportaciones de Vértice: genera el PDF, el PowerPoint y el Excel del análisis cargado (sin
// descargarlos) y deja su contenido legible en window.EXP para compararlo con el informe en pantalla.
(function () {
  const leerZip = async (blob) => {
    if (!window.JSZip) await V.L.load('jszip');
    return window.JSZip.loadAsync(await blob.arrayBuffer());
  };
  const textoXml = (xml) => (xml.match(/<a:t>([^<]*)<\/a:t>/g) || []).map((x) => x.replace(/<\/?a:t>/g, '')).map((s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'));
  async function pdfTexto(blob) {
    if (!window.pdfjsLib) {
      await V.L.load('pdfworker');
      await V.L.load('pdf');
      try { window.pdfjsLib.GlobalWorkerOptions.workerSrc = V.L.libUrl('pdfworker'); } catch (e) { /* worker ya cargado */ }
    }
    const lib = window.pdfjsLib;
    const doc = await lib.getDocument({ data: new Uint8Array(await blob.arrayBuffer()), isEvalSupported: false }).promise;
    const pags = [];
    for (let p = 1; p <= doc.numPages; p++) {
      const pg = await doc.getPage(p);
      const tc = await pg.getTextContent();
      // líneas por altura
      const ls = new Map();
      tc.items.forEach((it) => { const y = Math.round(it.transform[5]); const l = ls.get(y) || []; l.push(it); ls.set(y, l); });
      pags.push([...ls.entries()].sort((a, b) => b[0] - a[0]).map(([, it]) => it.sort((a, b) => a.transform[4] - b.transform[4]).map((i) => i.str).join(' ').replace(/\s+/g, ' ').trim()).filter(Boolean));
    }
    return pags;
  }
  async function pptxTexto(blob) {
    const z = await leerZip(blob);
    const num = (n) => +(n.match(/(\d+)\.xml$/) || [0, 0])[1];
    const slides = Object.keys(z.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a, b) => num(a) - num(b));
    const out = [];
    for (const s of slides) {
      const xml = await z.file(s).async('string');
      const rels = z.file(s.replace('slides/', 'slides/_rels/') + '.rels');
      const relXml = rels ? await rels.async('string') : '';
      const charts = [];
      for (const m of relXml.matchAll(/Target="\.\.\/charts\/(chart\d+\.xml)"/g)) {
        const cx = await z.file('ppt/charts/' + m[1]).async('string');
        const series = [...cx.matchAll(/<c:ser>([\s\S]*?)<\/c:ser>/g)].map((sm) => ({
          nombre: ((sm[1].match(/<c:tx>[\s\S]*?<c:v>([^<]*)<\/c:v>/) || [])[1]) || '',
          cats: [...((sm[1].match(/<c:cat>([\s\S]*?)<\/c:cat>/) || [])[1] || '').matchAll(/<c:v>([^<]*)<\/c:v>/g)].map((x) => x[1]),
          vals: [...((sm[1].match(/<c:val>([\s\S]*?)<\/c:val>/) || [])[1] || '').matchAll(/<c:v>([^<]*)<\/c:v>/g)].map((x) => +x[1])
        }));
        charts.push({ archivo: m[1], titulo: textoXml(cx).join(' ').slice(0, 120), series });
      }
      const notas = z.file(s.replace('slides/slide', 'notesSlides/notesSlide'));
      // filas de las tablas de la lámina: una lista de celdas por fila
      const filas = [...xml.matchAll(/<a:tr\b[\s\S]*?<\/a:tr>/g)].map((tr) => [...tr[0].matchAll(/<a:tc\b[\s\S]*?<\/a:tc>/g)].map((tc) => textoXml(tc[0]).join(' ').trim()));
      out.push({ lamina: num(s), texto: textoXml(xml), filas, charts, notas: notas ? textoXml(await notas.async('string')).join(' ').slice(0, 2000) : '' });
    }
    return out;
  }
  async function xlsxCeldas(blob) {
    if (!window.XLSX) await V.L.load('xlsx');
    // la hoja de datos limpios (miles de filas) no se lee: no es parte del informe
    const todas = window.XLSX.read(new Uint8Array(await blob.arrayBuffer()), { type: 'array', bookSheets: true }).SheetNames;
    const wb = window.XLSX.read(new Uint8Array(await blob.arrayBuffer()), { type: 'array', sheets: todas.filter((n) => !/^Datos limpios/i.test(n)) });
    const out = {};
    wb.SheetNames.forEach((n) => { out[n] = window.XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, raw: true, defval: '' }); });
    return out;
  }
  window.EXP = {
    async generar() {
      const app = V.app;
      const r = { empresa: app.settings.company };
      const pdf = await V.X.pdf(app); r.pdf = await pdfTexto(pdf);
      const ppt = await V.X.pptx(app); r.pptx = await pptxTexto(ppt);
      const xls = await V.X.xlsx(app); r.xlsx = await xlsxCeldas(xls);
      r.pantalla = document.querySelector('#view-reporte') ? document.querySelector('#view-reporte').innerText : '';
      EXP.res = r;
      return { pdfPaginas: r.pdf.length, laminas: r.pptx.length, hojas: Object.keys(r.xlsx) };
    },
    // exportaciones ya descargadas (las que generó el usuario): se leen igual que las recién generadas
    async leerArchivos(o) {
      const r = { empresa: '', pantalla: '', pdf: [], pptx: [], xlsx: {} };
      const traer = async (u) => (await fetch(u.split('/').map((x, i) => (i < 2 ? x : encodeURIComponent(x))).join('/'))).blob();
      if (o.pdf) r.pdf = await pdfTexto(await traer(o.pdf));
      if (o.pptx) r.pptx = await pptxTexto(await traer(o.pptx));
      if (o.xlsx) r.xlsx = await xlsxCeldas(await traer(o.xlsx));
      EXP.res = r;
      return { pdfPaginas: r.pdf.length, laminas: r.pptx.length, hojas: Object.keys(r.xlsx) };
    },
    // Montos de un texto, en millones: "$ 2.591 MM", "−$ 7.926 MM", "$ 38,9 MM", "$ 1.234 mil", "2.590.990.150"
    montos(t) {
      const out = [];
      String(t).replace(/([−-]?)\s?\$\s?([\d.]+(?:,\d+)?)\s?(MM|mil M|mil)?(?![\d.,])/g, (m, sg, n, u) => {
        let v = parseFloat(n.replace(/\./g, '').replace(',', '.'));
        if (u === 'MM') v = v; else if (u === 'mil M') v *= 1000; else if (u === 'mil') v /= 1000; else v /= 1e6;
        out.push((sg ? -1 : 1) * v);
        return m;
      });
      return out;
    },
    // fila por fila: los montos de cada hoja del Excel contra la misma fila en el PDF y en las tablas del PowerPoint
    // Un monto del PDF o del PowerPoint que no está en la misma fila del Excel (mismo rótulo exacto) es una
    // diferencia. Al revés no: el PowerPoint puede mostrar menos años que el Excel.
    comparar(hojas) {
      const r = EXP.res, norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
      const iguales = (a, b) => Math.abs(a - b) <= Math.max(0.051, Math.abs(b) * 0.006);
      // rótulo de una línea del PDF: el texto antes del primer monto
      const rotPdf = (l) => norm(l.split(/\s[−-]?\$|\s[+−-]?\d/)[0]);
      const filasPdf = r.pdf.flatMap((p, i) => p.map((l) => ({ donde: 'p' + (i + 1), l, n: rotPdf(l), ms: EXP.montos(l) }))).filter((x) => x.ms.length);
      const filasPpt = r.pptx.flatMap((s) => s.filas.map((f) => ({ donde: 'L' + s.lamina, l: f.join(' ¦ '), n: norm(f[0] || ''), ms: EXP.montos(f.slice(1).join(' ')) }))).filter((x) => x.ms.length);
      const dif = [];
      // las hojas de datos limpios tienen miles de filas y no se comparan: solo las del informe
      for (const h of hojas || Object.keys(r.xlsx).filter((n) => !/^Datos limpios/i.test(n))) {
        const rows = (r.xlsx[h] || []).slice(0, 400);
        rows.forEach((row, i) => {
          const lab = String(row[0] || '').trim();
          const nums = row.slice(1).filter((v) => typeof v === 'number' && Math.abs(v) >= 1e4).map((v) => v / 1e6);
          if (!lab || lab.length < 3 || !nums.length) return;
          const nl = norm(lab);
          for (const [lista, cual] of [[filasPdf, 'pdf'], [filasPpt, 'pptx']]) {
            lista.filter((x) => x.n === nl).forEach((f) => {
              const raros = f.ms.filter((m) => Math.abs(m) >= 0.05 && !nums.some((n) => iguales(m, n) || iguales(-m, n)));
              if (raros.length) dif.push({ hoja: h, fila: i + 1, rotulo: lab, excel: nums.map((n) => +n.toFixed(1)), en: cual, donde: f.donde, distintos: raros.map((m) => +m.toFixed(1)), linea: f.l.slice(0, 160) });
            });
          }
        });
      }
      return dif;
    },
    // Por sección: cada hoja del Excel se compara con las páginas del PDF y las láminas que mejor calzan con ella
    // (las que comparten más filas con los mismos montos), y ahí se listan las filas que no coinciden.
    compararSecciones(hojas) {
      const r = EXP.res, norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
      const iguales = (a, b) => Math.abs(a - b) <= Math.max(0.051, Math.abs(b) * 0.006);
      const rotPdf = (l) => norm(l.split(/\s[−-]?\$|\s[+−-]?\d/)[0]);
      const grupos = {
        pdf: r.pdf.map((p, i) => ({ donde: 'p' + (i + 1), filas: p.map((l) => ({ l, n: rotPdf(l), ms: EXP.montos(l) })).filter((x) => x.ms.length) })),
        pptx: r.pptx.map((s) => ({ donde: 'L' + s.lamina, filas: s.filas.map((f) => ({ l: f.join(' ¦ '), n: norm(f[0] || ''), ms: EXP.montos(f.slice(1).join(' ')) })).filter((x) => x.ms.length) }))
      };
      const out = [];
      for (const h of hojas || Object.keys(r.xlsx).filter((n) => !/^Datos limpios/i.test(n))) {
        const filasX = (r.xlsx[h] || []).slice(0, 400).map((row, i) => ({ fila: i + 1, n: norm(row[0] || ''), lab: String(row[0] || ''), nums: row.slice(1).filter((v) => typeof v === 'number' && Math.abs(v) >= 1e4).map((v) => v / 1e6) })).filter((x) => x.n.length >= 3 && x.nums.length);
        if (!filasX.length) continue;
        for (const [cual, gs] of Object.entries(grupos)) {
          const evaluados = gs.map((g) => {
            let calzan = 0;
            const malas = [];
            g.filas.forEach((f) => {
              const x = filasX.find((x) => x.n === f.n);
              if (!x) return;
              const raros = f.ms.filter((m) => Math.abs(m) >= 0.05 && !x.nums.some((n) => iguales(m, n) || iguales(-m, n)));
              if (raros.length) malas.push({ rotulo: x.lab, excel: x.nums.map((n) => +n.toFixed(1)), [cual]: raros.map((m) => +m.toFixed(1)), linea: f.l.slice(0, 140) });
              else calzan++;
            });
            return { donde: g.donde, calzan, malas };
          }).filter((e) => e.calzan >= 2);
          if (!evaluados.length) continue;
          const mejor = Math.max(...evaluados.map((e) => e.calzan));
          evaluados.filter((e) => e.calzan >= mejor * 0.5 && e.malas.length).forEach((e) => out.push({ hoja: h, en: cual, donde: e.donde, calzan: e.calzan, distintas: e.malas }));
        }
      }
      return out;
    },
    // PDF contra PowerPoint (cuando no hay Excel): cada tabla de una lámina contra la página del PDF que más se le
    // parece; se listan las filas con el mismo rótulo y montos distintos
    compararPdfPpt() {
      const r = EXP.res, norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
      const iguales = (a, b) => Math.abs(a - b) <= Math.max(0.051, Math.abs(b) * 0.006);
      const rotPdf = (l) => norm(l.split(/\s[−-]?\$|\s[+−-]?\d/)[0]);
      const pags = r.pdf.map((p, i) => ({ donde: 'p' + (i + 1), filas: p.map((l) => ({ l, n: rotPdf(l), ms: EXP.montos(l) })).filter((x) => x.ms.length) }));
      const out = [];
      r.pptx.forEach((s) => {
        const filas = s.filas.map((f) => ({ l: f.join(' ¦ '), n: norm(f[0] || ''), ms: EXP.montos(f.slice(1).join(' ')) })).filter((x) => x.ms.length && x.n.length >= 3);
        if (!filas.length) return;
        const ev = pags.map((p) => {
          let calzan = 0;
          const malas = [];
          filas.forEach((f) => {
            const g = p.filas.find((x) => x.n === f.n);
            if (!g) return;
            const raros = f.ms.filter((m) => !g.ms.some((n) => iguales(m, n)));
            if (raros.length) malas.push({ rotulo: f.n, pptx: f.l.slice(0, 130), pdf: g.l.slice(0, 130) });
            else calzan++;
          });
          return { donde: p.donde, calzan, malas };
        }).filter((e) => e.calzan + e.malas.length >= 2);
        if (!ev.length) return;
        const mejor = ev.sort((a, b) => b.calzan - a.calzan)[0];
        if (mejor.malas.length) out.push({ lamina: s.lamina, pagina: mejor.donde, calzan: mejor.calzan, distintas: mejor.malas });
      });
      // y los gráficos nativos del PowerPoint: sus series, para revisarlas contra el PDF
      return out;
    },
    // líneas o celdas que mencionan un rótulo, en cada salida
    buscar(re, max) {
      const r = EXP.res, out = { pantalla: [], pdf: [], pptx: [], xlsx: [] };
      r.pantalla.split('\n').forEach((l) => re.test(l) && out.pantalla.push(l.slice(0, 160)));
      r.pdf.forEach((p, i) => p.forEach((l) => re.test(l) && out.pdf.push('p' + (i + 1) + ': ' + l.slice(0, 160))));
      r.pptx.forEach((s) => { s.texto.forEach((l) => re.test(l) && out.pptx.push('L' + s.lamina + ': ' + l.slice(0, 160))); });
      Object.entries(r.xlsx).forEach(([n, rows]) => rows.forEach((row, i) => { const t = row.join(' | '); if (re.test(t)) out.xlsx.push(n + '!' + (i + 1) + ': ' + t.slice(0, 200)); }));
      Object.keys(out).forEach((k) => (out[k] = out[k].slice(0, max || 12)));
      return out;
    }
  };
  return 'extractor listo';
})();
