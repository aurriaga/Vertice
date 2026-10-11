# Registro de mejoras de Vértice

Ciclo: **medir → elegir la deficiencia más grave → corregir → volver a medir → anotar**.

- La app que se mejora: `../vertice-app/index.html` (respaldo de la 2.5 en `historial/index-2.5.0.html`).
- El medidor: `medir.js`, que se inyecta en la app servida por `servir.ps1` (http://localhost:8765/).
  Corre 15 casos con documentos reales (TVN, Banco de Chile, Red Global, Farmacéutica, Pasfer,
  muestras de ventas y la empresa de ejemplo). Compara con **valores de referencia sacados del propio
  documento con un lector independiente** (el de Cuadratura) y revisa invariantes: activo = pasivo +
  patrimonio, ingresos − costo = margen, informe sin valores rotos, gráficos con contenido, titular
  coherente con el resultado y consola sin errores.
- Cada vuelta deja su resultado en `historial/`.

## Gravedad

- **A**: cifra equivocada o informe que no sale. Lleva a una decisión mal tomada.
- **B**: algo falta o se ve mal, pero lo que se muestra es correcto.
- **C**: lentitud, textos o detalles.

## Puntaje por vuelta

| Vuelta | Fecha | Puntaje | Pasan | Qué se corrigió |
|---|---|---|---|---|
| 0 | 2026-10-10 | 95,3% (97,8% sin el falso positivo de las mini líneas) | 264/277 | Línea base. Sin controles de interpretación todavía. |
| 2 | 2026-10-10 | parcial | — | E1/E2/E3: el análisis financiero sigue el período de la portada; el trimestre posterior va en una frase aparte contra su mismo tramo del año anterior (sin anualizar); PowerPoint con los 10 indicadores; fila "Gastos de administración y ventas" del estado comparativo = línea del estado (por función) + "Otras ganancias (pérdidas) de la operación". Verificado en tvn-anual-y-trimestre: indicadores iguales en PDF, PowerPoint y Excel. **Pendiente**: correr la regresión completa con el último cambio (fila de gastos) y con el control nuevo de exportaciones (`exportar: true`); D4, D5, E4, E5, D2, D3, D6–D9 siguen abiertas. |
| 1 | 2026-10-10 | 100% (282/282, controles antiguos) | 282/282 | (ver abajo) |
| 1b | 2026-10-10 | en curso | — | D1: fuentes con codificación desordenada → OCR de los estados principales; tablas de OCR sin rayas armadas por posición; estados leídos con OCR reconocidos como principales; análisis razonado ya no manda; tablas en orden del documento; índices con puntos de relleno ya no pasan por OCR. TVN 2025 sola: 15/19 → 22/22 y el informe sale. |

## Deficiencias abiertas

| ID | Grav. | Caso | Deficiencia | Evidencia |
|---|---|---|---|---|
| E1 | A | reportado por el usuario: exportación de TVN 10-10-2026 | **Montos distintos según la exportación y dentro de un mismo informe**: la portada dice "2025 vs 2024", pero el mensaje, el consultor y parte de los KPI usan ene–mar 2026 contra el año 2025. "Ingresos" vale $ 47.915 MM en un lugar y $ 10.801 MM en otro; la situación compara un trimestre con un año ("$ 10.801 MM ($ 46.850 MM en 2024)"); patrimonio a marzo 2026 junto a liquidez a diciembre 2025. | `Vertice_Television_Nacional_de_Chile_2025.pdf/.pptx`; caso `tvn-anual-y-trimestre`. Causa: el análisis de ventas usa el período de la portada y el financiero siempre el último estado. |
| E2 | A | tvn-anual-y-trimestre | "La empresa redujo sus ventas 10% en ene–mar 2026" es falso: frente a ene–mar 2025 subió 3%. Se anualizaba el trimestre contra el año completo anterior. | PDF del usuario, pilar A. |
| E3 | B | todas las exportaciones | El PowerPoint corta los indicadores en 8: faltan "Resultado del ejercicio" y "Patrimonio", que el PDF y el Excel sí traen. | `rep.kpis.slice(0, 8)`. |
| E4 | B | tvn-anual-y-trimestre | "Complicación: los indicadores no muestran alertas graves" con solidez Crítica y Z″ en zona de riesgo. | PDF del usuario, p1. |
| E5 | B | exportación del usuario | Industria detectada "Manufactura de alimentos y bebidas" para TVN (en el corpus sale "Publicidad, medios y marketing"). | PDF del usuario, p1. |
| D1 | A | tvn-2025-12, tvn-todos | Estados anuales con fuente de codificación desordenada: no se leen los estados principales, falta el resultado 2025 y 2024 y **no sale el informe**. | Págs. 9–15 extraen "01O34RO637(" en vez de cifras; solo se tomaron las tablas del análisis razonado (MM$). |
| D2 | A | tvn-2026-06 y todo estado intermedio | El estado de resultados comparativo y los KPI comparan contra un período **sin estado de resultados** (el balance de diciembre): "2025: $ 0 en 12 meses", "nuevo" en todas las partidas. | Informe TVN jun-2026, B-4 y KPI de resultado. |
| D3 | A | estados financieros sin datos mensuales | Gráficos **mensuales inventados** a partir de un total semestral: "Ingresos mensuales", "Margen bruto mensual" (−4,5%, −4,5%, −4,4%…), "Estacionalidad". | Informe TVN jun-2026, A-1, A-2, B-1. |
| D4 | A | resultados negativos | Variación de una pérdida redactada como alza: "El resultado operacional **subió** 8,4%" cuando la pérdida pasó de −$5.795 MM a −$5.307 MM. | Pilar B y KPI de TVN jun-2026. |
| D5 | A | tvn-2026-06 | "Gastos operacionales $ 4.337 MM, −7,9%" resta las otras ganancias de la operación; los gastos de administración **subieron** 13,8%. La tabla de gastos muestra "% total 133,8%". | KPI y B-2/B-3 de TVN jun-2026. |
| D6 | C | solo estados financieros | Pide "unidades vendidas, sucursal, producto, precios de la competencia" a estados financieros de un canal de TV. | Pilar A de TVN. |
| D7 | C | varios | Textos: "rota en 1 días", "iVA por recuperar", numeración del informe del consultor salta de 4 a 6. | Informe TVN jun-2026. |
| D8 | C | PDF con páginas escaneadas | El OCR con la pestaña en segundo plano es lento (TVN jun-2026: 71 s contra 10 s del resto). | Medición vuelta 0. |
| D9 | B | tvn-2025-12 | Las páginas de índice ("Índice de los Estados Financieros") quedan clasificadas como estados. | Tablas "Página 7/8 [estados]". |

## Resueltas

| ID | Vuelta | Qué se hizo | Verificación |
|---|---|---|---|
