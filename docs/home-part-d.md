# Home — Parte D (inglés, pendiente de aprobación)

Las partes C y C.1 están aprobadas. D comienza después del reposo final del CTA de
La Argentina, sin modificar sus tiempos. Vista: http://localhost:3000/en.

## Secuencia y edición

Distancia adicional: `--part-d-scroll: 900svh` en `HomeStory.module.css`.
Además se añade un tramo corto de scroll normal calculado desde la cobertura
real de la vegetación. No consume ni acelera los 900svh de las animaciones D.
Los intervalos se editan en `projectsMotion.ts`, `PROJECTS_TIMING`:

| Progreso D | Acción |
| --- | --- |
| 0–.05 | Se retira suavemente C.1. |
| Después de .05 | Se libera el escenario: avanza con la página a escala 1:1 y vuelve a fijarse antes del borde inferior de la vegetación. El progreso D permanece en .05 durante este tramo. |
| .05–1 después de fijar | El nuevo encuadre permanece inmóvil durante las entradas. |
| .17–.31 | Sube tree1 directamente hasta su posición final. |
| .22–.36 | Sube tree2, solapando su entrada con tree1. |
| .27–.41 | Sube tree3, solapando su entrada con tree2. |
| .42–.70 | Iglesia y camino suben juntos, con exactamente el mismo desplazamiento. |
| .70–1 | Iglesia y camino mantienen su posición final. |
| .72–.84 | OUR PROJECTS y las tarjetas aparecen juntos por delante de la iglesia. |
| .84–1 | Reposo para explorar los cuatro enlaces. |

Las entradas tienen inicios distintos, con solapamiento para evitar pausas. Toda la secuencia revierte al subir;
también se restaura el contenido y CTA de C.1 al regresar a su tramo.

## Posiciones y escala

`getProjectsGeometry` calcula medidas desde el tamaño del escenario. `CHURCH_ANCHOR`
usa las coordenadas normalizadas de **la imagen del camino**, no de la pantalla:

- `x: .55`: centro del espacio superior.
- `y: .055`: punto donde apoya la base de la iglesia.
- `width: .32`: ancho de la iglesia respecto al camino.

Camino e iglesia comparten escala y desplazamiento; la iglesia está por delante.
El camino completo entra desde fuera de la pantalla junto con la iglesia, sin
dividirlo, sin una segunda animación de máscara y sin alterar su transparencia.
`PROJECTS_SCALE` aplica árboles ×1.30 y camino ×1.20 ×1.10 respecto a la primera versión.
D.1 añade un 10% a camino e iglesia sobre su tamaño anterior (32% acumulado).
La iglesia hereda esa escala una sola vez. Los árboles se distribuyen a
izquierda, derecha y detrás de la iglesia, siguiendo las capturas del 14 de octubre.
El recorrido se detiene en la iglesia; no avanza hasta el final del camino ni
comprime el archivo completo dentro de una pantalla. Projects se superpone a la
iglesia con un nivel de capa superior, sin mover el conjunto durante su entrada.
D.2 reemplaza la entrada separada de D.1. Tras el tramo de scroll normal, la
vegetación permanece inmóvil y su borde inferior queda fuera del encuadre. Tree1 y
tree3 comparten una base de primer plano limitada a 98svh; tree2 conserva su base
a 87svh y su capa detrás del camino. No hay reajustes después de las entradas.
Iglesia y camino usan el mismo desplazamiento en cada frame, incluso al invertir
el scroll. Se conservan las escalas de D.1.
El ajuste de encuadre `PROJECTS_REST_OFFSET` en `projectsMotion.ts` modifica
únicamente la posición de reposo de los árboles, la iglesia y el camino. Se
conservó el valor actual `.12`, sin modificar tamaños ni tiempos de entrada.
Los originales se conservan y se copiaron a `public/images/home`.

## Editar dónde vuelve a fijarse la vegetación

En `src/components/home/vegetationPin.ts`, `VEGETATION_PIN_MARGIN_PX = 24`
es el margen que debe quedar oculto debajo de la pantalla. Bajar a `12` permite
avanzar 12px más; subir a `40` detiene la escena 16px antes, siempre que exista
espacio suficiente. Hay un mínimo de seguridad de 4px. El límite adicional
`VEGETATION_MAX_TRAVEL_VH = .35` evita un tramo excesivo en pantallas muy anchas;
no fuerza a avanzar si antes se descubriría una zona transparente.

La cobertura se mide al cargar las imágenes y al cambiar el tamaño de pantalla,
componiendo sus canales alfa en un canvas de análisis. No se ejecuta al hacer
scroll ni modifica los originales. El recorrido disponible cambia con la resolución.

El escenario pasa de sticky a una posición absoluta en el documento durante
ese tramo: 1px de scroll desplaza el escenario 1px. Después vuelve a sticky con
el nuevo encuadre. Las posiciones locales de las imágenes no se animan. Al subir
se recorren las mismas fases en reversa. A/B/B.1/C/C.1 conservan sus distancias.

## OUR PROJECTS

El color se cambia **solo** en `src/components/home/ProjectsScene.module.css`:

```css
.scene {
  --projects-title-color: var(--color-ivory);
}
```

Se puede sustituir por `var(--color-forest)`, `var(--color-ink)` o un hexadecimal.
La sombra está en `.title`. Se mantienen la familia, el peso y el tamaño del título
OUR MISSION; el color Ivory tiene una sombra reforzada sobre el camino claro.

Las cuatro tarjetas enlazan, en orden, a MOCACAO, NUTRITION, ACADEMIC SUPPORT y
MEDICAL CARE. En escritorio, hover y foco de teclado abren el encabezado Ivory,
cambian el título a Forest y reducen el área de la fotografía. Las demás tarjetas
se atenúan al pasar el cursor. Las frases breves son propuestas editables en
`content/en/home.json`, `partD.projects[].summary`.

En móvil vertical aparecen dos filas, con encabezados siempre visibles y enlaces
directos (sin requerir hover ni doble toque). Con movimiento reducido o sin JS,
los proyectos permanecen en flujo normal y no se añaden tramos de scroll decorativo.

## Verificación

- `scripts/check-home-part-d.cjs`: archivos, dimensiones, transparencia, orden,
  rutas existentes, árboles con entradas escalonadas y solapadas, aumentos exactos
  de tamaño, fondo inmóvil, cobertura inferior por píxeles alfa, subida conjunta,
  reposo de la iglesia durante Projects, reversibilidad y anclaje de
  iglesia/camino en siete tamaños de pantalla.
- Pruebas de B/B.1/C/C.1 y compilación del proyecto.
- `scripts/check-home-vegetation-pin.cjs`: recorrido 1:1, margen, cobertura alfa,
  pausa del progreso D durante el scroll normal y continuidad al volver a fijar.
- Navegador: imágenes cargadas; iglesia anclada y tarjetas dentro del viewport a
  1920×1080 y 2560×1440; revisión visual a 1280×720 y 390×844; navegación por teclado.
- El encuadre y el ritmo siguen pendientes de aprobación del usuario.
