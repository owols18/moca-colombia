# Etapa 2 - Base bilingüe y primera página interior

## Resultado

La etapa 2 establece la arquitectura pública bilingüe y convierte `Our Mission` en la primera página interior funcional. El Home permanece deliberadamente reservado para la fase final de scrollytelling.

## Rutas e idioma

- Inglés: `/en/...`
- Español: `/es/...`
- Slugs estables en inglés para evitar duplicar lógica de rutas.
- Prioridad de detección: idioma guardado por el visitante, país informado por el hosting, idioma del navegador y, finalmente, inglés.
- Los países hispanohablantes se dirigen inicialmente a español; los demás, a inglés.
- El selector EN/ES conserva la página actual y guarda la elección durante un año.

La detección geográfica depende de que GoDaddy o el proxy de producción envíe uno de los encabezados compatibles. Si el hosting no lo hace, se mantiene el comportamiento correcto mediante idioma del navegador e inglés como respaldo.

## Navegación

- El header es transparente y absoluto sobre el hero, con `z-index: 100`.
- El menú abre una capa de navegación accesible y se cierra con Escape.
- Projects es un grupo y enlaza directamente a MOCACAO, Nutrition, Academic Support y Medical Care; no existe una página general de Projects.
- Todas las rutas planificadas tienen una superficie provisional para evitar enlaces rotos mientras se desarrollan por fases.

## Contenido

Cada página tiene un JSON por idioma dentro de `content/en` y `content/es`. `Our Mission` incluye el contenido completo; las páginas posteriores ya tienen contrato de SEO, hero, estado y nota de implementación. La traducción española actual está marcada como provisional.

## Imágenes y comportamiento responsive

- El hero usa una fotografía original de aproximadamente 1920 px de ancho.
- La visión de largo plazo usa el máster de 2880 px, adecuado para pantallas de 2560 × 1440.
- `next/image` genera variantes responsive y evita enviar el máster completo cuando no es necesario.
- El contenido se limita a 1760 px, manteniendo márgenes proporcionados en pantallas anchas.
- La composición cambia a una columna en pantallas pequeñas y respeta `prefers-reduced-motion`.

## Pendiente para producción

- Confirmar que el plan exacto de GoDaddy soporta Next.js con proceso Node.js persistente.
- Confirmar qué encabezado de país entrega GoDaddy para GeoIP.
- Aprobar traducciones finales.
- Completar las páginas interiores restantes.
- Configurar Stripe, formularios, privacidad y Analytics en sus fases previstas.
