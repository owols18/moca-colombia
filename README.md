# Moca Colombia Web

Nuevo sitio bilingue de Moca Colombia, construido a partir del diseno aprobado en Illustrator.

## Estado

- Etapa 0: completa - inventario y normalizacion de fuentes.
- Etapa 1: completa - base tecnica y Design System navegable.
- Siguiente etapa: arquitectura bilingue, contenido JSON y componentes de pagina.
- Fuente original: `C:\Y-CARPETA DE DATOS\5-Moca Office\Fundacion\Moca-Colombia`.
- La carpeta fuente se trata como material de solo lectura.
- El Home se desarrollara al final como experiencia de scrollytelling.

## Desarrollo local

Requisitos: Node.js 22 o 24 y pnpm 11.

```bash
pnpm install
pnpm dev
```

- Estado del proyecto: `http://localhost:3000`
- Design System: `http://localhost:3000/design-system`
- Validacion completa: `pnpm check`

## Documentacion

- `docs/stage-0-inventory.md`: conclusiones del inventario inicial.
- `docs/stage-1-design-system.md`: decisiones, tokens y componentes de la etapa 1.
- `docs/source-inventory.csv`: manifiesto mecanico de archivos, dimensiones y hashes.
- `docs/decision-log.md`: decisiones de producto y tecnologia confirmadas.
