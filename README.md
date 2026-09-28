# Vértice Gerencial

Reportes para la toma de decisiones a partir de los archivos que entrega la empresa (Excel, CSV, PDF, Word, PowerPoint, exportes de Power BI, JSON, XML, HTML o una tabla pegada). El informe se arma con el **Principio de la Pirámide** (Barbara Minto): primero la conclusión y la decisión que se pide, después cuatro argumentos MECE con su evidencia.

## Qué entrega

- **Mensaje principal** con impacto estimado y la decisión que se pide al directorio.
- **Cuatro pilares sin traslapes**: A · Ingresos y mercado, B · Costos, margen y gastos, C · Inventario y operación, D · Solidez financiera. Cada uno trae hallazgos, causas, gráficos, riesgos y acciones.
- **KPIs**: producto más vendido por año, semestre, trimestre, mes y semana; fechas de mayor y menor venta; sucursales con más y menos ingresos; estacionalidad; comparación con el período anterior; efecto precio, volumen y mezcla.
- **Gastos** ordenados de mayor a menor, presupuesto vs real, punto de equilibrio.
- **Inventario**: cobertura, quiebres, sobre-stock y productos fuera de temporada.
- **Precios frente a la competencia** (tus archivos) y, en claude.ai, precios de mercado referenciales estimados con IA.
- **Ratios financieros** con referencias por industria (Damodaran, NYU Stern, enero 2026, empresas de EE.UU.: úsalas como orientación).
- **Mapa de riesgos**, tres alternativas para el directorio, plan a 30-60-90 días y tablero de seguimiento.
- **Calidad de datos**: falencias detectadas, correcciones automáticas, cuadraturas entre fuentes y la estructura de datos recomendada.
- Descargas: **PDF ejecutivo**, **PowerPoint** con gráficos editables y **Excel** con anexos y datos limpios.

## Dos formas de usarla

| | En claude.ai | App instalable (esta carpeta) |
|---|---|---|
| Análisis, gráficos, alertas y recomendaciones | Sí | Sí |
| Descargas PDF, PowerPoint y Excel | Sí | Sí |
| Funciona sin conexión | No | Sí |
| Redacción con IA, contexto de la industria, precios de mercado con IA, asistente y lectura de imágenes o PDF escaneados | Sí | No |

Los archivos se procesan en el navegador y no se suben a ningún servidor. En claude.ai, solo cuando usas una función con IA se envía a Claude un resumen de las cifras calculadas.

## Publicarla en GitHub Pages

1. En GitHub, crea un repositorio nuevo, por ejemplo `vertice`, público.
2. Entra al repositorio y usa **Add file → Upload files**. Arrastra **todo el contenido** de esta carpeta: `index.html`, `sw.js`, `manifest.webmanifest` y las carpetas `vendor`, `fonts` e `icons`. Presiona **Commit changes**.
3. Ve a **Settings → Pages**. En *Build and deployment* elige **Deploy from a branch**, rama **main** y carpeta **/ (root)**. Guarda.
4. En uno o dos minutos la app queda en `https://TU-USUARIO.github.io/vertice/`.

## Instalarla

- **Chrome o Edge (Windows o Mac)**: abre la dirección y usa el botón **Instalar** de la app o el ícono de instalar en la barra de direcciones. Queda con su ícono y ventana propia.
- **Android**: menú ⋮ → **Instalar app**.
- **iPhone o iPad (Safari)**: botón Compartir → **Agregar a inicio**.

Después de abrirla una vez con conexión, funciona sin internet.

## Actualizar

Sube la nueva versión reemplazando los archivos en el repositorio. La app instalada toma la versión nueva la próxima vez que se abre con conexión.

## Consejos para mejores reportes

- Descarga la **Plantilla de datos** (menú Exportar) para ver las columnas mínimas de cada tabla.
- **Power BI**: exporta los datos del visual (… → Exportar datos → .xlsx o .csv) o exporta el informe a PDF o PowerPoint. Un archivo .pbix no trae los datos legibles fuera de Power BI; Vértice lo detecta y explica cómo exportarlo.
- Completa **La empresa** (industria y contexto): la industria define las referencias y los umbrales de inventario, y el contexto se cita en las causas.
- Revisa el paso **2 · Datos**: ahí se corrigen el tipo de cada tabla, el rol de cada columna y los gastos atípicos. Lo que ajustes se recuerda para las próximas cargas.
