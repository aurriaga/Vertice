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
| 1 | 2026-10-10 | en curso | — | D1: fuentes con codificación desordenada → OCR de los estados principales; tablas de OCR sin rayas armadas por posición; estados leídos con OCR reconocidos como principales; análisis razonado ya no manda; tablas en orden del documento; índices con puntos de relleno ya no pasan por OCR. TVN 2025 sola: 15/19 → 22/22 y el informe sale. |

## Deficiencias abiertas

| ID | Grav. | Caso | Deficiencia | Evidencia |
|---|---|---|---|---|
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
