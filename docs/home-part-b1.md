# Home — Parte B.1 (inglés)

Vista local: http://localhost:3000/en. Solo afecta al home inglés.

## Secuencia

El título OUR MISSION ahora sube desde abajo, por detrás de mountain4, durante el
intervalo .88–.97 de la parte B. Llega a la misma posición de 24svh que tenía antes.
La jerarquía es: montañas 1–3, título y párrafo (z-index 35), mountain4, mountain5 y mountain6.
Las montañas 1–3 conservan el desenfoque; el título, párrafo y primer plano están nítidos.
No hay velo claro. Se mantienen `closeScale: 2.0` y el factor `.42` de mountain1.

La B.1 añade **400svh** de scroll. No estira los 260svh de A ni los 520svh de B.
Los intervalos siguientes son fracciones exclusivas de B.1:

| Intervalo | Acción |
| --- | --- |
| 0–.20 | El título se reduce exactamente a 85% y se desplaza a la izquierda, centrado verticalmente. |
| .14–.30 | El párrafo y CTA entran 48px de izquierda a derecha con desaceleración; opacidad 0→100%. |
| .30–.66 | Pausa de lectura. El usuario puede detener el scroll sin límite de tiempo. |
| .66–.94 | Título, párrafo y CTA disminuyen de tamaño y desaparecen progresivamente. |
| .66–1 | Mountain4 sube y regresan mountain5 y mountain6, escalonadas, al primer plano. |

El texto es el suministrado, en un solo párrafo **blanco #FFFFFF**, con sombra discreta
para probar su lectura sin añadir fondos. LEARN MORE reutiliza el botón Secondary
del design system y apunta a `/en/our-mission`; queda debajo, alineado a la izquierda.
Mountain4 baja suavemente hasta 90svh durante la lectura para dejar libre el CTA,
y vuelve a subir al salir. El título conserva su color Ivory.

## Edición

- `content/en/home.json` → `partB.description` y `partB.cta`: texto y botón.
- `src/components/home/missionMotion.ts` → `MISSION_TIMING`: entrada, pausa, salida,
  reducción `.85`, desplazamiento del párrafo y regreso de montañas.
- `src/components/home/HomeStory.module.css` → `--part-b1-scroll`: recorrido total.
- `.missionScene` → `--mission-top: 24svh` y `--mission-dock-x: -23vw`: posición inicial y desplazamiento lateral.
- `.missionCopy`: color, ancho, tipografía, interlineado y separación del CTA.

En pantallas de hasta 900px, título y párrafo se apilan en un bloque centrado verticalmente,
calculado a partir de su altura real. En alturas muy pequeñas, el párrafo puede desplazarse
internamente para mantener accesible todo el contenido y el botón.
El CTA se excluye de la navegación por teclado cuando el contenido está oculto o saliendo.
Con movimiento reducido o sin JavaScript, se ofrece el contenido en flujo normal sobre
Forest, sin montañas animadas ni desplazamiento fijo prolongado; el enlace sigue disponible.

## Comprobación

`node scripts/check-home-part-b1.cjs` verifica reducción exacta, entrada, pausa, salida,
reversibilidad, botón, color blanco y tiempos independientes de A/B.
`node scripts/check-home-part-b.cjs --timeline-only` conserva las comprobaciones de B.
La prueba estricta antigua de cobertura de mountain1 continúa fuera de estas comprobaciones:
el zoom 2.0 del usuario no cubre todos los píxeles del encuadre.
Las pruebas de código no sustituyen la revisión visual del contraste y ritmo en navegador.
