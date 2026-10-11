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
| 1 | 2026-10-10 | 100% (controles de la vuelta 0) | 282/282 | D1: fuentes con codificación desordenada → OCR de los estados principales; tablas de OCR sin rayas armadas por posición; estados leídos con OCR reconocidos como principales; análisis razonado ya no manda; tablas en orden del documento; índices con puntos de relleno ya no pasan por OCR. TVN 2025 sola: 15/19 → 22/22 y el informe sale. |
| 2 | 2026-10-10 | (parcial) | — | E1/E2/E3 (reportado por el usuario): un solo período en todo el informe y en las tres descargas; trimestre posterior aparte contra su mismo tramo; PowerPoint con los 10 indicadores; fila de gastos del estado comparativo = línea del estado. |
| 3 | 2026-10-10 | **100% con los controles nuevos** | 407/407 | Interpretación de los textos (tabla "Vuelta 3"): pérdidas, impuestos diferidos, materialidad del inventario, estados por función, relacionadas, meses inventados, balance ilegible, #REF!, período anual, liquidez holgada, numeración del consultor. 16 casos; tu caso de TVN 34/34 con PDF = PowerPoint = Excel. |

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

## Vuelta 3 · errores de interpretación en los textos (TVN marzo 2026)

| Dónde | Antes | Ahora | Causa |
|---|---|---|---|
| Recomendación principal | "Acelerar la recuperación de impuestos: $ 7.293 MM de caja liberada"; "los impuestos por recuperar suman $ 24.309 MM… remanente de IVA" | "Documentar/revisar y cobrar los saldos con entidades relacionadas", $ 1.050 MM | "Activos por impuestos **diferidos**" ($ 24.289 MM) se clasificaba como IVA/PPM por recuperar. Ahora es otro activo no corriente; impuestos por recuperar = $ 20 MM (lo del estado). |
| Pilar B | "El resultado operacional subió 29%" | "La pérdida operacional se redujo 29% (de $ 4.786 MM a $ 3.374 MM): el margen bruto subió 11,2 pp (a −16,0%)" | `verb()` miraba solo el signo de la variación. Nueva `N.resultChange()` distingue ganancia/pérdida. |
| Pilar A | "crecen 1% al año desde ene–mar 2025" | "aumentó sus ventas 3% en ene–mar 2026 ($ 10.801 MM, +3% frente a ene–mar 2025)" | Tasa anual mezclando trimestres; ahora solo con 3+ años completos. |
| Pilar C | "ya rota en 1 días: hay caja inmovilizada" | "El inventario es menor ($ 160 MM, 0,2% del activo): no pesa en la caja ni en el resultado" | Sin materialidad; ahora bajo 2% del activo no es alerta. |
| KPI resultado | "2025: $ 0 en 12 meses" | "(ene–mar 2025: −$ 5.689 MM)" | Un cierre con solo balance se tomaba como resultado cero. |
| Situación | "$ 10.801 MM ($ 46.850 MM en 2024)" | "$ 10.801 MM ($ 10.489 MM en ene–mar 2025), una pérdida de $ 3.818 MM (pérdida de $ 5.689 MM en ene–mar 2025)" | Comparaba con el primer período del archivo. |
| Complicación | "Los indicadores no muestran alertas graves" | "Sin embargo, pierde dinero ($ 3.818 MM) y el Z″ de Altman está en zona de riesgo (−2,46)" | Solo miraba hallazgos de auditoría. |
| Puente del resultado | "Gastos −$ 1.109 MM, Depreciación −$ 1.122 MM" | "Gastos adm. −$ 2.231 MM" (la línea del estado) | En un estado por función la depreciación ya está en el costo y los gastos. |
| Hallazgo de gastos | "depreciación $ 4.478 MM (43%)" de los gastos de operación | sin esa parte | Ídem. |
| KPI gastos | "Gastos operacionales $ 9.795 MM" frente a "suman $ 10.349 MM" en el hallazgo | $ 10.349 MM en ambos | Las otras ganancias de la operación se restaban como gasto negativo; daban "% del total 105,7%". |
| Cobertura de intereses | "cubre −13,4 veces los intereses" | "La operación da pérdida, así que no cubre los intereses" | — |
| Relacionadas | "socios… retiro encubierto… global complementario" en una empresa del Estado | "entidades relacionadas… NIC 24, plazo de cobro" | Sin cuentas de socios no aplica. |
| Tablas comparativas | columna "2025" con "$ 0" y "nuevo" en el estado de resultados | cada estado con sus períodos; variación contra el mismo tramo | — |
| Hallazgo tributario | "iVA por recuperar" | "IVA por recuperar" | `low1()` rompía siglas. |
| Pasfer (Excel IFRS) · período | "Período: diciembre 2025" · "vendió $ 441 MM en diciembre 2025" | "Período: 2025" · "vendió $ 441 MM en 2025" | Una fila anual al 31-12 se tomaba como un mes. |
| Pasfer · último período | (no se mencionaba ene–jun 2026) | "En ene–jun 2026, el último período disponible, vendió $ 307 MM y ganó $ 37,2 MM" | — |
| Pasfer · pilar D | "En orden · La liquidez está bajo la referencia del sector (liquidez corriente –)" | "Sin datos · No se pudo leer el balance, así que no hay liquidez ni endeudamiento que evaluar" | Afirmaba algo sobre un dato inexistente. |
| Pasfer · calidad | "91/100 · Confiable" sin aviso | Aviso "La hoja «Estado Situación Financiera» tiene 69 celdas con errores de Excel (#REF!)…"; calidad 74 · Confiable con reservas | Las celdas #REF! se descartaban sin avisar. |
| Empresa de ejemplo · pilar D | "Posición financiera sólida: la liquidez corriente es 1,16…" (pilar en Atención) | "Solvente, pero con la caja justa: la liquidez corriente es 1,16 y la caja bajó 80% (a $ 38,9 MM), aunque el Z″… zona segura" | Faltaba el punto medio entre frágil y sólida. |
| Muestras · situación | "La empresa opera en otra industria con 7 puntos de venta" | "La empresa tiene 7 puntos de venta" | — |

## Resueltas

| ID | Vuelta | Qué se hizo | Verificación |
|---|---|---|---|
