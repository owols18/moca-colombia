# Home — Parte B (revisión en inglés)

Vista local: http://localhost:3000/en. No modifica el home español ni las páginas interiores.

**Actualización B.1:** el título ahora sube por detrás de mountain4 (z-index 35), se
acomoda a la izquierda y acompaña un párrafo y CTA. Consulta `home-part-b1.md` para
el comportamiento actual del título y los 400svh adicionales; abajo se conserva el
detalle de las montañas de B.

## Secuencia

La parte A conserva sus 260svh de recorrido y todos sus tiempos aprobados.
La B añade 520svh al mismo escenario fijo, sin interceptar la rueda ni el gesto táctil.
Un avance de 0 a 1 en la B equivale exclusivamente a esos 520svh adicionales.

| Intervalo B | Acción |
| --- | --- |
| 0–.18 | Mountain1 sube en primer plano y cubre la escena A. |
| .18–.20 | Breve pausa sobre la montaña cercana. |
| .20–.76 | Una cámara compartida pasa de escala 2.0 a 1; aparecen las cinco capas restantes. |
| .76–.88 | Se encuadra la misión: mountain4 baja hasta dejar una franja inferior; 5 y 6 quedan fuera del encuadre. |
| .84–.94 | Mountain3 y el paisaje detrás (mountain1 y mountain2) se desenfocan progresivamente hasta 12px, sin velo Ivory. |
| .88–.97 | OUR MISSION sube nítido por detrás de mountain4, delante de mountain3. |
| .97–1 | Pausa final antes de salir del escenario. |

La escena A se oculta al terminar la entrada de mountain1. Durante el alejamiento,
un fondo Ivory evita que vuelvan a verse sus textos detrás de los recortes transparentes.
Todo se reconstruye desde el scroll actual: retroceder también revierte la transición.
Se conservaron los ajustes del usuario: `closeScale: 2.0` y
`const closeTop = -firstMountainHeightVh * .42`. Con este encuadre menos ampliado,
mountain1 ya no garantiza cubrir todos los píxeles de la pantalla antes del cambio de escena.
El fondo Ivory base sigue detrás de las montañas; no hay una capa translúcida encima.

## Dónde editar

- `content/en/home.json`, bloque `partB`: título, rutas y dimensiones originales.
- `src/components/home/mountainMotion.ts`, `MOUNTAIN_TIMING`: llegada, alejamiento, desenfoque y aparición del título.
- En el mismo archivo, `MOUNTAIN_LAYERS`: ancho, desplazamiento horizontal, altura de cresta y entrada por capa. `missionTop` ajusta su posición al aparecer la misión; mountain4 termina en `.74`.
- `src/components/home/HomeStory.module.css`, `--part-b-scroll`: duración total de la B. No cambies `--part-a-scroll` para alargar la B.
- `.missionTitle`: tamaño y estilo de OUR MISSION; Ivory con sombra ligera para contrastar sobre el paisaje sin velo.
- `.missionScene`, `--mission-top: 24svh`: altura inicial del título. Su `z-index: 35` lo sitúa detrás de mountain4 (40), delante de mountain3 (30). Las imágenes no bloquean la selección del texto.

Las posiciones verticales finales avanzan aproximadamente 10% de alto de pantalla por capa.
Montañas 1, 2 y 5 tienen ancho base 110%; 3, 4 y 6 usan 120% para conservar un margen
de seguridad al lado contrario del recorte de 15%. En retrato se aplica un ancho mínimo
proporcional al alto de pantalla, evitando comprimir las montañas o descubrir sus bases.
El acercamiento inicial recorta mucho más que el encuadre final, de forma intencionada.

## Implementación y accesibilidad

No añade librerías de animación: usa el mismo bucle de actualización por cuadro que A,
transformaciones CSS y seis imágenes WebP originales con transparencia.
Next sirve variantes responsivas; las capas se solicitan anticipadamente para la transición.
No se modificaron los originales. El acercamiento es una simulación 2.5D, no una escena 3D real.
El filtro se aplica a mountain1, mountain2 y mountain3. Mountain4 y las capas más cercanas,
así como el título, permanecen nítidos.
Con movimiento reducido o sin JavaScript, los mensajes se muestran en flujo normal y
el paisaje final aparece estático: no hay un recorrido fijo largo ni desenfoque animado.

## Verificación

`node scripts/check-home-part-b.cjs` comprueba tiempos, reversibilidad, dimensiones y
transparencia de los seis archivos, además de la cobertura de mountain1 en 1920×1080,
2560×1440, 390×844, 768×1024, 3440×1440 y 1920×400.
Estas pruebas geométricas y la compilación no sustituyen la aprobación visual en navegador.
Con los valores actuales de zoom, la comprobación estricta de cobertura total falla (ya
ocurría antes del ajuste de profundidad). `node scripts/check-home-part-b.cjs --timeline-only`
verifica los archivos, la animación reversible, el encuadre de misión, la ausencia del velo
y que solo mountain1–3 reciben desenfoque, sin exigir esa cobertura total.
