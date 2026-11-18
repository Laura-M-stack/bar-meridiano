# Bar Meridiano

Landing de demostración para un bar de coctelería ficticio de Palermo, Buenos Aires, con estética **Art Déco**: verde esmeralda, negro y dorado, simetría, marcos de doble línea y mayúsculas con mucho espaciado. Es parte de mi portfolio y no representa a un negocio real.

**Sitio:** https://laura-m-stack.github.io/bar-meridiano/

## Qué incluye

- Carta con cuatro secciones, precios y descripciones.
- Estado en vivo: "Abierto ahora" o "Cerrado", calculado con la hora de Buenos Aires aunque el visitante esté en otra zona, y que contempla los cierres pasada la medianoche.
- Formulario de reservas con validación: fecha no pasada, días sin servicio, horarios disponibles según el día, límite de personas y mensaje listo para WhatsApp.
- Sin imágenes externas: toda la ilustración es SVG y CSS, así que no depende de terceros ni necesita créditos.

## Stack

Astro 5 (sitio estático), TypeScript estricto, CSS propio con variables y Vitest para la lógica. No usa frameworks de UI ni librerías de componentes.

## Estructura

```
src/
  data/site.ts         Datos del negocio, carta y eventos
  lib/horario.ts       Horarios y cálculo de "abierto ahora"
  lib/reserva.ts       Validación de reservas y mensaje de WhatsApp
  components/          Header, Hero, Carta, Ambiente, Eventos, Reservas, Footer y ornamentos SVG
  styles/global.css    Tokens y estilos
  pages/index.astro
```

## Scripts

```powershell
npm install
npm run dev       # servidor de desarrollo
npm run test      # tests de horarios y reservas
npm run build     # astro check + build a dist/
npm run preview
```

## Decisiones

- **Zonas horarias:** el estado y la fecha mínima de la reserva se calculan siempre en `America/Argentina/Buenos_Aires` con `Intl`, no con la hora del navegador. Los días de semana de una fecha ISO se obtienen en UTC para evitar corrimientos.
- **Cierre después de medianoche:** un horario se guarda como minutos desde las 00:00 y puede superar 1440. Así, el sábado a la 1:30 el bar sigue abierto por la noche del viernes.
- **Accesibilidad:** contrastes WCAG AA verificados (dorado sobre esmeralda 5,1:1 o más), foco visible, enlace para saltar al contenido, menú móvil con `aria-expanded` y cierre con Escape, áreas táctiles de al menos 44 px y `prefers-reduced-motion`.
- **Tipografías:** Poiret One para títulos y Josefin Sans para el texto, con `display=swap`.

## Límites

- El número de WhatsApp es ficticio: la reserva abre WhatsApp con el mensaje armado, pero no llega a ningún negocio.
- No hay backend ni disponibilidad real de mesas; los horarios salen solo del horario de atención.

## Publicación

GitHub Pages con el workflow de `.github/workflows/deploy.yml` (en el repo: Settings → Pages → Source: GitHub Actions).
