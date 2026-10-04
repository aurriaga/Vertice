# Vértice Gerencial · versión 2.3

Reportes para la toma de decisiones a partir de los archivos que entrega la empresa (Excel, CSV, PDF con texto o escaneado, imágenes, Word, PowerPoint, exportes de Power BI, JSON, XML, HTML o una tabla pegada). El informe se arma con el **Principio de la Pirámide** (Barbara Minto): primero la conclusión y la decisión que se pide, después cuatro argumentos MECE con su evidencia.

## Qué hay de nuevo en la 2.3

**Revisión de auditoría (contable NIIF para PYMES y tributaria)**

- Lee los **formularios 22** de la carpeta tributaria: régimen (Pro Pyme, semi integrado), ingresos y egresos, base imponible, impuesto de primera categoría, PPM y resultado de la declaración. Verifica que la tasa aplicada sea la del régimen y año (Pro Pyme: 10% hasta 2023, 12,5% en 2024–2027, 15% en 2028 y 25% desde 2029; semi integrado 27%) y avisa si los estados financieros replican el F22 (base percibida y pagada en vez de contabilidad devengada).
- Nuevos hallazgos tipo auditoría: inventario o activo fijo que no se actualizan, cuentas por conciliar o sin rendir, saldos con socios y empresas relacionadas, saldos con signo contrario, notas de crédito altas, gastos de perfil personal, cotizaciones por pagar sin movimiento, honorarios sin retención, tasa de PPM distinta a la del régimen, IVA exportador por recuperar, financiamiento nuevo (factoring), corte del período, impuestos diferidos, vacaciones, activos biológicos y empresa en marcha. Cada uno trae su efecto, la norma y qué hacer.
- Lee las **notas** que trae un estado financiero ("no se determinó el costo de ventas") y no presenta como confiable un margen o una utilidad que esas notas advierten incompletos.
- Concilia el **registro de compras y ventas con el F29** documento a documento (liquidaciones-factura, facturas de compra y notas de crédito de exportación).
- Lee mejor los balances de planillas contables: suma todas las cuentas de un mismo tipo (dos bancos, préstamo y factoring), distingue activos y pasivos por el código o la posición de la cuenta y entiende los balances con saldos con signo.
- Concentración de clientes y proveedores con el registro del SII, crecimiento del año en curso y una proyección de 6 meses con límites razonables.

**Seguridad y privacidad**

- La librería de Excel se actualizó a SheetJS 0.20.3 (corrige dos vulnerabilidades al abrir archivos manipulados). Su huella se verificó contra la versión oficial.
- La app instalable trae una **política de seguridad de contenido** que bloquea scripts que no sean de Vértice, no se deja abrir dentro de páginas ajenas y no envía datos a ningún servidor.
- Los archivos de sesión y lo guardado en el navegador se validan antes de usarse, y los archivos demasiado grandes o "zip bomba" no se abren.
- Nueva opción en **1 · Fuentes**: elegir si el navegador recuerda tu último análisis, y un botón para **borrar los datos guardados** (útil en computadores compartidos).
- En la versión de claude.ai, las librerías se cargan con verificación de integridad, y la IA trata el contenido de los archivos como datos, no como instrucciones.

## Lo que trajo la 2.2.1

**Documentos largos**

- Recorre los PDF de hasta **300 páginas** y muestra el avance página por página ("página 12 de 44").
- En cada archivo indica cuántas páginas se leyeron ("Se recorrieron las 44 páginas del PDF"). Si una página está dañada o el lector de texto se queda sin memoria, la salta, avisa cuál fue y **sigue con el resto**; antes una página así podía dejar la lectura detenida.
- Libera la memoria de cada página al terminarla y reinicia el lector de PDF escaneados cada 5 páginas, para que los documentos largos no se traben.
- Una tabla que continúa en varias páginas se llama "Páginas 3–8".

**Carpeta tributaria del SII**

- Lee los **formularios 29** de la carpeta tributaria (uno por página) y los junta en una tabla de **ventas mensuales declaradas al SII**: base imponible, exportaciones, IVA débito y crédito, y PPM. Si hay una rectificatoria, usa la más reciente.
- Toma el nombre y la actividad del contribuyente desde la portada y sugiere la industria.
- Si también cargas los balances, compara las ventas contables con lo declarado al SII. Las páginas del formulario 22 quedan como contexto.

## Lo que trajo la 2.2

**Bancos (formato de la CMF)**

- Lee los **estados financieros de bancos** chilenos, mensuales e intermedios (formato del Compendio de Normas Contables de la CMF): estado de situación financiera, estado del resultado y sus notas al pie, como las colocaciones netas y las provisiones adicionales.
- Calcula los indicadores de la banca: rentabilidad sobre patrimonio y sobre activos (anualizadas), eficiencia, margen de intereses y reajustes, peso de las comisiones, costo de riesgo (con y sin provisiones adicionales), patrimonio sobre activos, activos líquidos y colocaciones sobre depósitos, y los compara con el sistema bancario (CMF, agosto de 2026).
- Arma el informe con pilares propios de un banco (ingresos y márgenes, eficiencia y gastos, riesgo de crédito, y solvencia, liquidez y rentabilidad), el **Informe del analista**, los riesgos y las prioridades. Las descargas en PDF, PowerPoint y Excel traen los estados y los indicadores del banco.
- Pone solo el **nombre del banco** y la industria **Bancos e instituciones financieras**. Si cargas archivos de otra empresa, el perfil cambia solo, salvo que hayas escrito el nombre a mano.

**Lectura**

- Encabezados en dos líneas ("Al 30 de junio de" / "2026") y títulos de grupo sobre varias columnas ("Por los períodos de seis meses terminados al…"), típicos de los estados intermedios.
- Nombres de empresa bien escritos ("Banco de Chile S.A.", "Comercial Los Aromos Ltda.").
- Al retomar un análisis guardado, las tablas se vuelven a leer con el lector nuevo; se respetan solo los cambios que hiciste a mano.

## Lo que trajo la 2.1

**Lectura**

- **PDF escaneados e imágenes sin internet**: el reconocimiento de texto (OCR) corre en tu equipo. Si el PDF trae una capa de texto de otro OCR (común en documentos firmados o escaneados por el banco), Vértice la descarta y lo lee de nuevo.
- **Balance de 8 columnas** (PDF con texto, PDF escaneado o Excel): reconoce cuentas, código y nombre, y verifica todas las cuadraturas (debe = haber, deudor = acreedor, activo − pasivo = resultado, sumas impresas). Si un monto quedó mal leído, lo corrige con esas cuadraturas y lo marca con ✎ en el anexo.
- **Estados financieros en PDF** (balance clasificado y estado de resultados): encabezados de sección, columnas de notas, balances partidos en dos tablas y años escritos solo en el título ("al 31 de diciembre de 2025 y 2024").
- **Excel con varias tablas por hoja**, períodos parciales ("ene–mar 2026"), formularios 29 del SII y hojas de conciliación.
- Toma el **nombre, RUT y giro** de la empresa desde el encabezado del balance y sugiere la industria.

**Análisis**

- **Informe del consultor** redactado por el motor de reglas: conclusión, qué pasó en los resultados, cómo se financió la empresa, solidez, hallazgos contables, riesgos, recomendaciones, escenarios y límites del análisis.
- **Análisis financiero profundo**: estados comparativos (análisis horizontal y vertical), flujo de caja indirecto, capital de trabajo y NOF, DuPont, Z″ de Altman, punto de equilibrio y hallazgos tipo auditoría (depreciación o impuestos sin registrar, ventas del F29 fuera de la contabilidad, dependencia de proveedores y otros).
- **Proyecciones a 3 años** con escenarios base, pesimista y optimista, sensibilidad y un **simulador** para cambiar los supuestos.
- Las descargas en **PDF**, **PowerPoint** y **Excel** incluyen el informe, los estados, la caja, las proyecciones y el balance leído.

## Qué entrega

- **Mensaje principal** con impacto estimado y la decisión que se pide al directorio.
- **Cuatro pilares sin traslapes**: A · Ingresos y mercado, B · Costos, margen y gastos, C · Inventario y operación, D · Solidez financiera. Cada uno trae hallazgos, causas, gráficos, riesgos y acciones.
- **KPIs**: producto más vendido por año, semestre, trimestre, mes y semana; fechas de mayor y menor venta; sucursales; estacionalidad; comparación con el período anterior; efecto precio, volumen y mezcla.
- **Gastos** ordenados de mayor a menor, presupuesto vs real y punto de equilibrio.
- **Inventario**: cobertura, quiebres, sobre-stock y productos fuera de temporada.
- **Ratios financieros** con referencias por industria (Damodaran, NYU Stern, enero 2026, empresas de EE.UU.: úsalas como orientación).
- **Mapa de riesgos**, tres alternativas para el directorio, plan a 30-60-90 días y tablero de seguimiento.
- **Calidad de datos**: falencias detectadas, correcciones automáticas, cuadraturas entre fuentes y la estructura de datos recomendada.

## Dos formas de usarla

| | En claude.ai | App instalable (esta carpeta) |
|---|---|---|
| Lectura, análisis, informe del consultor, proyecciones y simulador | Sí | Sí |
| PDF escaneados e imágenes | Sí (OCR en tu equipo; si la vista no lo permite, con IA) | Sí, sin internet |
| Descargas PDF, PowerPoint y Excel | Sí | Sí |
| Funciona sin conexión | No | Sí |
| Redacción con IA, contexto de la industria, precios de mercado con IA y asistente | Sí | No |

Los archivos se procesan en el navegador y no se suben a ningún servidor. En claude.ai, solo cuando usas una función con IA se envía a Claude un resumen de las cifras calculadas.

**Privacidad en GitHub Pages.** Todas las apps publicadas en `TU-USUARIO.github.io` comparten el almacenamiento del navegador. Si publicas otras apps ahí, o usas un computador compartido, desmarca "Recordar mi último análisis" y guarda tus análisis como archivo (Exportar → Guardar análisis). Para aislar Vértice por completo, publícala con un dominio propio (Settings → Pages → Custom domain). Activa también la verificación en dos pasos de tu cuenta de GitHub: quien entre a tu cuenta podría cambiar la app que usan tus clientes.

## Actualizar tu app en GitHub Pages (si ya la tienes publicada)

1. Entra a tu repositorio (por ejemplo `github.com/TU-USUARIO/vertice`).
2. Usa **Add file → Upload files** y arrastra `index.html`, `sw.js` y `README.md`. **En la 2.3 también cambia `vendor/xlsx.full.min.js`**: entra a la carpeta `vendor` del repositorio y súbelo ahí (reemplaza al anterior). Si vienes de una versión anterior a la 2.1, sube **todo el contenido** de esta carpeta (`index.html`, `sw.js`, `manifest.webmanifest`, `.nojekyll` y las carpetas `vendor`, `fonts` e `icons`). Los archivos con el mismo nombre se reemplazan.
3. Presiona **Commit changes** y espera uno o dos minutos.
4. Abre la app con conexión: toma la versión nueva sola. Si todavía ves la anterior, ciérrala y ábrela de nuevo (en el navegador, Ctrl + F5).

## Publicarla por primera vez

1. En GitHub, crea un repositorio nuevo, por ejemplo `vertice`, público.
2. **Add file → Upload files**, arrastra todo el contenido de esta carpeta y presiona **Commit changes**.
3. Ve a **Settings → Pages**. En *Build and deployment* elige **Deploy from a branch**, rama **main** y carpeta **/ (root)**. Guarda.
4. En uno o dos minutos la app queda en `https://TU-USUARIO.github.io/vertice/`.

## Instalarla

- **Chrome o Edge (Windows o Mac)**: abre la dirección y usa el botón **Instalar** de la app o el ícono de instalar en la barra de direcciones.
- **Android**: menú ⋮ → **Instalar app**.
- **iPhone o iPad (Safari)**: botón Compartir → **Agregar a inicio**.

Después de abrirla una vez con conexión, funciona sin internet (incluido el lector de PDF escaneados).

## Consejos para mejores reportes

- **Estados financieros**: carga juntos el balance de 8 columnas de cada año (o los estados financieros) y, si los tienes, los formularios 29 del período. Con dos o más años se activan el flujo de caja, las tendencias y las proyecciones.
- **PDF escaneados**: mientras más nítido el escaneo, mejor. Revisa el anexo «Balance de 8 columnas leído»: los montos corregidos quedan marcados con ✎ y muestran lo que se leyó.
- **Ventas por producto o cliente** (libro de ventas, RCV del SII o el Excel del sistema): suman el análisis de productos, márgenes por línea, fechas y estacionalidad.
- **Power BI**: exporta los datos del visual (… → Exportar datos → .xlsx o .csv) o el informe a PDF o PowerPoint. Un archivo .pbix no trae los datos legibles fuera de Power BI.
- Completa **La empresa** (industria y contexto) y revisa el paso **2 · Datos**: ahí se corrige el tipo de cada tabla y el rol de cada columna. Lo que ajustes se recuerda para las próximas cargas.
