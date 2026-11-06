# Home — Parte H: Contact Us y cierre

Implementación en inglés, pendiente de aprobación visual. Las distancias y posiciones aprobadas de A–G no se modifican.

## Recursos y contenido

`content/en/home.json` → `partH`: texto, CTA `/en/contact`, imagen `contac-us.webp`, `cocoagrain4/5.webp` y `cocoafruit1/2.webp`. Copias de los originales; no se alteraron los archivos fuente.

## Ajustes de animación

- `src/components/home/HomeStory.module.css`: `--part-h-scroll: 600svh` determina la duración del tramo nuevo, independiente de G. Después se añade el desplazamiento necesario para leer el contenido en móvil y una pausa de medio viewport.
- `src/components/home/contactMotion.ts`: `CONTACT_TIMING` controla salida de donación, avance de cámara, entrada de granos, foto, letras, párrafo, CTA y frutos. Los valores son proporciones de 0 a 1 del tramo H; el movimiento se invierte al retroceder.
- `CONTACT_GRAINS.overlapPrevious: .20` superpone los nuevos granos sobre el 20% inferior de grain3. `widthVw`, `minWidthVh` controlan tamaño sin deformar imágenes. `finalTopVh` determina el encuadre final. Los dos recortes transparentes se entrelazan para no dejar un hueco en el centro.
- La donación y el desenfoque desaparecen antes de mostrar Contact Us. Todos los enlaces ocultos quedan fuera de la navegación por teclado.

## Composición

`src/components/home/ContactScene.module.css`:

- Dos columnas en escritorio; una columna hasta 800px.
- `.photo`: radio compartido `--radius-section` (3rem). Apertura desde el centro y zoom suave de 1.08 a 1.
- Título: misma función de aparición letra a letra con opacidad y desenfoque que About Us. El CTA utiliza su revelado por máscara y escala.
- `.fruitOne`: ancho del 52% de la imagen, centrado y comienza al 90% de la altura de la foto (solapamiento inferior del 10%). La reserva inferior de `.visual` evita chocar con el texto en móvil.
- `.fruitTwo`: espacio propio después del CTA, alineado hacia la derecha. No intercepta clics ni cubre texto.
- El footer compartido no se duplica: únicamente en este home se superpone 160px, con fondo transparente, logo y texto blancos. El contenido reserva 180px para evitar cruces. Los footers interiores no cambian.
- Con movimiento reducido, Contact Us se muestra en flujo normal, sin fijación ni máscaras animadas.

## Verificación

`node scripts/check-home-part-h.cjs` comprueba dimensiones, transparencias, solapamiento del 20%, direcciones, continuidad, reversibilidad y cobertura real detrás del logo en siete resoluciones, incluyendo 1920×1080 y 2560×1440.
