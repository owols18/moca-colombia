# Home — Parte F (pendiente de aprobación visual)

Implementación en inglés. Conserva los valores aprobados de A–E.

## Ajuste posterior del slider

El CTA está después de la galería y sus controles. Las imágenes ocupan `84vw` en escritorio (2150px a 2560px) y `90vw` en móvil, sin límite ligado a la altura de pantalla. `object-fit: contain` conserva la foto completa, también la segunda imagen panorámica. Después de completar la animación F se añade un tramo independiente: altura excedente del contenido más `75svh` de pausa. Durante ese tramo, un píxel de scroll desplaza un píxel el contenido y el paisaje hasta dejar visible el CTA; al subir se revierte. El fondo puede quedar visible. Se conservaron los ajustes manuales de casa, cacao y overlay al 50%.

## Controles de edición

Altura unificada según la foto de la escuela: `.galleryWindow` usa `calc(var(--slide-width) * 859 / 1919)`. Todas las fotos activas comparten esa altura; su ancho es automático y conservan la proporción original, sin recorte. Las fotografías 16:9 son más estrechas que la panorámica. Se mantiene el tramo adicional de scroll y el CTA inferior.

Las seis fotografías se sirven como WebP preparados mediante `node scripts/prepare-about-gallery.cjs`, conservando dimensiones y originales PNG/JPG. La galería evita la optimización dinámica de Next para estas copias ya comprimidas, después de observar errores de carga en versiones ampliadas de los PNG. Se comprobó `naturalWidth > 0` para las seis imágenes en el navegador.

- `src/components/home/aboutMotion.ts`: `ABOUT_TIMING` controla las entradas en progreso local 0–1 de F. `FINAL_HOUSE_ANCHOR` ubica house5 en la sexta plataforma; `COCOA_ANCHORS` ubica los granos respecto al camino. El grano izquierdo queda recortado al 50% por el borde de la pantalla.
- En `getAboutFrame`, `overlay: .60 * ease(...)` fija la intensidad máxima del overlay: .60 es 60% de opacidad / 40% de transparencia. Cambiar solo ese número mantiene la transición reversible.
- `src/components/home/AboutScene.module.css`: `.scene[data-enhanced] .overlay` define el color con `background: var(--color-ink)`.
- `src/components/home/HomeStory.module.css`: `--part-f-scroll: 800svh` controla la distancia de scroll de F.
- `content/en/home.json`, bloque `partF`: textos, CTA, imágenes y textos alternativos del carrusel.

## Secuencia

1. El desenfoque de E desaparece entre 0 y .12. Impact no pierde opacidad: sale hacia arriba junto al avance del paisaje.
2. House5 entra desde la derecha (.08–.30). Los granos entran desde abajo (.28–.49 derecha, .24–.45 izquierda), en una capa superior a las casas.
3. La cámara avanza (.02–.60) hasta alinear el borde inferior del camino con el borde inferior de la vista; no se calcula con una altura fija de escritorio.
4. Overlay (.61–.71), título por letras (.66–.79), párrafo (.78–.85), CTA (.84–.90) y galería (.89–.96).
5. CTA `DISCOVER OUR STORY` dirige a `/en/about-us`. Galería manual con imagen central, laterales visibles, flechas, indicadores, teclado y arrastre horizontal; sin reproducción automática.

Todas las transformaciones dependen del scroll, por lo que se revierten al subir. Con movimiento reducido se usa el contenido en flujo normal y se quitan las transiciones del carrusel.

## Verificación

- `node scripts/check-home-part-e.cjs`: regresión de E y parámetros manuales de D.
- `node scripts/check-home-part-f.cjs`: geometría en ocho tamaños, fin del camino, sexta plataforma, reversibilidad, overlay, letras, metadatos y navegación circular.
- TypeScript y compilación de producción correctos.
- Revisión visual en escritorio y móvil; navegación por flechas, indicadores, teclado y arrastre comprobada en navegador.
