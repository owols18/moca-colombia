# Fondo estático de vegetación — G/H

`vegetation-path-2.webp` se copia desde los originales al directorio `public/images/home`; el original no se modifica.

- Configuración del recurso: `content/en/home.json`, `partG.background`.
- Capa independiente en `HomeStory.tsx`, `data-donation-backdrop`, fuera de DonationScene: montañas (z-index 5), nueva vegetación (6), escena del camino (7), casas (8/9), donación/grano3 (10) y Contact Us/granos4/5 (11). Así no tapa el camino ni las casas.
- Aparición: desde `DONATION_TIMING.cta[0]` en `donationMotion.ts`, cuando comienza Change a Life Today. Permanece visible durante H aunque el CTA desaparezca; al retroceder antes de ese punto vuelve a ocultarse.
- Se carga anticipadamente con `loading="eager"`. Sin transición de opacidad, entrada, zoom ni desplazamiento de cámara. La traslación constante compensa únicamente el desplazamiento de la escena fijada.
- Tamaño/encuadre: `.donationBackdrop` y `.donationBackdrop img` en `HomeStory.module.css`. `inset: -5%` proporciona margen para recortar bordes transparentes; `object-fit: cover` evita deformación y cubre el viewport; `object-position: center` define el encuadre.
- Se conservan los tamaños y posiciones personalizados de los granos y frutos. No cambian los footers ni las páginas interiores.
