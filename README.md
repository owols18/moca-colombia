# Moca Colombia Web

Nuevo sitio bilingue de Moca Colombia, construido a partir del diseno aprobado en Illustrator.

## Estado

- Etapa 0: completa - inventario y normalizacion de fuentes.
- Etapa 1: completa - base tecnica y Design System navegable.
- Etapa 2: completa - arquitectura bilingue, contenido JSON, navegacion publica y primera pagina interior.
- Siguiente etapa: desarrollo y aprobacion progresiva de las paginas interiores restantes.
- Fuente original: `C:\Y-CARPETA DE DATOS\5-Moca Office\Fundacion\Moca-Colombia`.
- La carpeta fuente se trata como material de solo lectura.
- El Home se desarrollara al final como experiencia de scrollytelling.

## Desarrollo local

Requisitos: Node.js 22 o 24 y pnpm 11.

```bash
pnpm install
pnpm dev
```

- Inicio ingles: `http://localhost:3000/en`
- Inicio espanol: `http://localhost:3000/es`
- Our Mission: `http://localhost:3000/en/our-mission`
- Nuestra mision: `http://localhost:3000/es/our-mission`
- Contact Us: `http://localhost:3000/en/contact`
- Contacto: `http://localhost:3000/es/contact`
- Design System: `http://localhost:3000/design-system`
- Validacion completa: `pnpm check`

## Formulario de contacto

El formulario envia al correo definido en `CONTACT_TO_EMAIL` (por defecto,
`fabian.andres82@gmail.com`) mediante SMTP. Copia `.env.example` como `.env.local` y completa
las variables privadas de la cuenta de correo antes de publicar. Las credenciales solo se usan
en el servidor y nunca deben llevar el prefijo `NEXT_PUBLIC_`.

Los accesos desde Get Involved usan `?interest=volunteer` y
`?interest=partnership` para seleccionar automaticamente el tipo de solicitud.

## Documentacion

- `docs/stage-0-inventory.md`: conclusiones del inventario inicial.
- `docs/stage-1-design-system.md`: decisiones, tokens y componentes de la etapa 1.
- `docs/stage-2-localized-foundation.md`: rutas bilingues, deteccion de idioma y pagina Our Mission.
- `docs/source-inventory.csv`: manifiesto mecanico de archivos, dimensiones y hashes.
- `docs/decision-log.md`: decisiones de producto y tecnologia confirmadas.
