# Home — Parte C.1: La Argentina (inglés, pendiente de aprobación)

Vista local: http://localhost:3000/en. Continúa después del encuadre final de la
vegetación. No modifica las distancias ni los movimientos de A, B, B.1 o C.

## Composición

- Izquierda: las tres imágenes `la-argentina-1.webp`, `la-argentina-2.webp` y
  `la-argentina-3.webp`, en ese orden, dentro de una máscara compartida. Cada imagen
  sale hacia arriba mientras la siguiente entra desde abajo. Radio del design
  system: `--radius-section`.
- Derecha: LA ARGENTINA / COLOMBIA centrado, con la familia, peso, color y sombra
  de OUR MISSION; tamaño adaptado al ancho de la columna. Párrafo original completo,
  Manrope Light, blanco y alineado a la izquierda, revelado palabra por palabra.
- Debajo del párrafo: CTA secundario SEE HOW WE HELP hacia `/en/la-argentina`,
  alineado a la izquierda y fuera de la ventana de recorte del texto para mantenerlo accesible.
  Se revela de .88 a .92, después de la última palabra; antes queda invisible y fuera
  de la navegación por teclado. Conserva su espacio para no mover el párrafo.
- La sección está por delante de la vegetación, sin panel opaco ni velo adicional.
- En móvil se apilan la imagen y el contenido. Si el párrafo no cabe, el mismo
  scroll desplaza el texto dentro de su ventana de lectura; no hay scroll interno
  que capture la rueda. La imagen y el título permanecen en su sitio.
- Con movimiento reducido o sin JavaScript, texto e imágenes aparecen completos
  en flujo normal. El párrafo tiene una lectura continua para lectores de pantalla.

## Recorrido independiente

Se añaden 600svh, configurables en `HomeStory.module.css`, `--part-c1-scroll`.

| Progreso C.1 | Acción |
| --- | --- |
| 0–.14 | Toda la sección entra desde abajo. |
| .16–.88 | Se revela progresivamente el párrafo. |
| .36–.44 | Imagen 1 → imagen 2. |
| .64–.72 | Imagen 2 → imagen 3. |
| .88–1 | Reposo con el final del texto y la tercera imagen. |

Todos los movimientos dependen del scroll actual, por lo que se revierten al
subir y no dependen de temporizadores. El encuadre queda en reposo al finalizar,
sin inventar aún una salida hacia una parte D.

## Edición y validación

- `content/en/home.json`, `partC1`: título, párrafo, rutas, dimensiones y textos alternativos.
- `src/components/home/argentinaMotion.ts`: tiempos, desplazamiento y revelación.
- `src/components/home/ArgentinaScene.tsx`: estructura de las dos columnas.
- `src/components/home/HomeStory.module.css`: encuadre, tipografía, máscara y móvil.
- `scripts/check-home-part-c1.cjs`: dimensiones reales, secuencia, máscara sin huecos,
  reversibilidad, lectura hasta el final y preservación de distancias anteriores.

Las imágenes se copiaron sin alterar los originales. Los controles matemáticos y
de compilación no sustituyen la revisión visual del ritmo y del encuadre en navegador.
