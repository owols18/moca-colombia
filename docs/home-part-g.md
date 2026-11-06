# Home — Parte G (pendiente de aprobación)

La parte G comienza después de terminar F y su tramo adicional de lectura. No altera los tiempos aprobados ni las posiciones manuales de house5 y cocoagrain1/2.

## Secuencia y edición

- `donationMotion.ts`, `DONATION_TIMING`: salida de About Us 0–.16, retirada de su overlay 0–.18, árboles .04–.48, granos .26–.62, desenfoque .65–.77 y componente .74–.88. El inicio .26 de los granos coincide con el 50% del desplazamiento de ambos árboles.
- `COCOA_TREE_LAYOUT`: ancho .58 de pantalla (mínimo .46 de altura), 6% fuera de cada borde. Ambos árboles tienen su borde superior alineado con el punto medio de house5 en las coordenadas finales de F, incluyendo el avance de lectura. Las imágenes transparentes no se deforman.
- `getDonationGeometry`: cocoagrain3 ocupa el ancho completo y se coloca en primer plano, por delante de los árboles. Su posición vertical se calcula con el tamaño de pantalla y la proporción del recurso.
- `HomeStory.module.css`, `--part-g-scroll: 600svh`: duración de G. Se añade una pausa final de 50svh y el espacio necesario para recorrer el componente en pantallas bajas.
- `content/en/home.json`, `partG`: recursos y contenido de la llamada a la acción.

`DonationScene` reutiliza `SharedCta` con su misma foto, título y tres enlaces localizados. Solo se elimina el fondo blanco exterior dentro del home; las páginas interiores no cambian. El paisaje se desenfoca 12px, no el componente ni sus botones. No se agrega otro velo opaco.

Los desplazamientos y efectos son función del scroll, reversibles al subir. Sin JavaScript o con movimiento reducido, SharedCta aparece en flujo normal y no requiere completar una animación. Enlaces ocultos durante la animación quedan fuera del foco mediante `inert`.

Verificación: `node scripts/check-home-part-g.cjs`, pruebas de regresión E/F, TypeScript, compilación y navegador local.
