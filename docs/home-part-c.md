# Home — Parte C (revisión en inglés)

Vista: http://localhost:3000/en. Partes B y B.1 aprobadas; sus funciones de movimiento,
zoom, posiciones y distancias de scroll se conservan sin modificaciones.

## Entrada y orden de capas

«La mitad de mountain6» se interpreta como **50% de su entrada final de B.1**, no
la primera aparición de mountain6 durante B. Con los tiempos actuales esto ocurre
en `.88` de B.1: punto medio de su intervalo `.76–1`.

- Vegetation1 entra desde fuera del borde izquierdo hacia la derecha; z-index 70.
- Vegetation2 entra simultáneamente desde la derecha hacia la izquierda; z-index 80,
  por delante de vegetation1 y 12svh más arriba en escritorio (la separación se
  reduce progresivamente hasta 3svh en móvil para que no tape la primera).
- Vegetation3 entra después desde abajo; z-index 90, por delante de ambas, alineada
  al borde izquierdo y 10svh más abajo que vegetation1.
- Las montañas mantienen z-index 10–60. Las nuevas plantas no reciben desenfoque.

En escritorio se muestra el 90% del ancho de vegetation1 (10% fuera por la izquierda),
75% de vegetation2 (25% fuera por la derecha), y 90% de vegetation3 (10% fuera por
la derecha, manteniendo su borde izquierdo alineado a la pantalla).
Los porcentajes describen el recorte horizontal antes de las superposiciones entre capas.

El encuadre de escritorio sitúa las imágenes al 25%, 13% y 35% del alto de pantalla,
respectivamente; antes empezaban al 60%, 48% y 70%, dejando demasiado contenido fuera.
En retrato se aplica un alto mínimo de 90svh para las dos primeras y 72svh para la
tercera, manteniendo su proporción. Se recorta más horizontalmente para no mostrar
las bases y se conserva más del lado izquierdo de vegetation1. En pantallas muy anchas se
sube la composición en conjunto para cerrar huecos entre las pendientes. Esto conserva
la separación exacta de 10svh entre vegetation1 y vegetation3.

## Scroll reversible

C añade **400svh** a la altura total, sin estirar A, B ni B.1. Su comienzo se solapa con
la mitad final de la entrada de mountain6, por lo que su recorrido efectivo incluye
los 48svh restantes de B.1: 448svh con la configuración actual.

| Progreso C | Movimiento |
| --- | --- |
| 0–.32 | Vegetation1 y vegetation2 entran simultáneamente. |
| .32–.54 | Pausa de unos 99svh de scroll para apreciar ambas imágenes. |
| .54–.82 | Vegetation3 sube. |
| .82–1 | Composición completa en reposo durante unos 81svh de scroll. |

Todos los valores se calculan desde el scroll actual, sin estados de reproducción
ni animaciones temporizadas: al subir, se recorre exactamente el camino inverso.

## Dónde editar

- `content/en/home.json`, `partC.vegetation`: rutas y dimensiones originales.
- `src/components/home/vegetationMotion.ts`, `VEGETATION_LAYERS`: porcentajes visibles,
  alturas, recortes y orden de las plantas. `top` usa fracciones del alto de pantalla.
- `VEGETATION_TIMING`: duración relativa de las entradas lateral y vertical.
- `src/components/home/HomeStory.module.css`, `--part-c-scroll`: distancia adicional.

Las imágenes se copiaron sin modificar los originales: 1680×770, 2410×1023 y 1860×868.
Next sirve versiones responsivas y se solicitan anticipadamente para no esperar a
que la planta llegue al encuadre. No se interpolaron nuevos detalles ni se retocaron.
Con movimiento reducido o sin JavaScript, las plantas decorativas no se animan ni
añaden recorrido; se conserva el contenido accesible de la misión en flujo normal.

## Pruebas

`node scripts/check-home-part-c.cjs` verifica transparencia y dimensiones, orden de
capas, direcciones, entrada simultánea, reversibilidad, porcentajes horizontales en
1920×1080 y 2560×1440, separación vertical y cobertura del borde inferior mediante
el canal alpha real de las imágenes, también en móvil, tablet y ultrawide. También
comprueba que cada planta aporte píxeles visibles en el encuadre final, teniendo en
cuenta las transparencias y las capas que tiene por delante, y la pausa entre entradas.
La validación geométrica no sustituye la revisión visual del ritmo en navegador.
