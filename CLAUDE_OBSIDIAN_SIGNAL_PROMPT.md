# Prompt para Claude: aplicar Vielinks Obsidian Signal

```text
Necesito que apliques un retheme completo del proyecto usando la paleta oficial "Vielinks Obsidian Signal".

Lee primero `VIELINKS_COLOR_SYSTEM.md` y usalo como fuente de verdad para colores, reglas de uso, tokens y criterios de contraste.

Contexto del proyecto:
- Stack: Vite + React + TypeScript + Tailwind CSS v4.
- El sistema de color actual usa muchos hex hardcodeados en `src/index.css`, `src/pages/*`, `src/components/*`, `src/App.tsx` y algunos estilos inline.
- La paleta vieja tipo Claude usa terracotta/cream:
  - `#C8553A`
  - `#A53F28`
  - `#F6F2EA`
  - `#FBF8F2`
  - `#EFE9DC`
  - `#E7E0D0`
  - `#15140F`
  - `#3D3A30`
  - `#6B655B`
  - `#A39B8B`

Objetivo:
Eliminar la identidad terracotta/cream y reemplazarla por "Vielinks Obsidian Signal", sin cambiar layout, copy, rutas, logica, arquitectura ni comportamiento.

Nueva paleta:
- Primary / CTA principal: `#111827`
- Primary hover: `#0B1220`
- Signal green: `#0E9F6E`
- Success / solid green button: `#047857`
- Success hover: `#065F46`
- Success soft: `#ECFDF5`
- Info blue: `#2563EB`
- Info soft: `#EFF6FF`
- Warning: `#B45309`
- Warning soft: `#FEF3C7`
- Error: `#DC2626`
- Error soft: `#FEE2E2`
- Background: `#F8FAFC`
- Card / modal / popover: `#FFFFFF`
- Surface raised: `#F1F5F9`
- Divider: `#E2E8F0`
- Divider strong: `#CBD5E1`
- Text primary: `#0F172A`
- Text secondary: `#334155`
- Text muted: `#64748B`

Reglas de uso:
- Usa `#111827` para CTAs principales: create post, schedule post, connect account, start publishing, upgrade plan.
- Usa `#0B1220` como hover del CTA principal.
- Usa `#0E9F6E` para dots, iconos, focus rings, highlights, crecimiento, conectado, activo y senales positivas.
- No uses `#0E9F6E` como boton solido con texto blanco pequeno.
- Para botones verdes solidos usa `#047857` con texto blanco y `#065F46` en hover.
- Usa `#2563EB` solo para links, acciones informativas, analytics y conectividad.
- Usa `#334155` para texto secundario legible.
- Usa `#64748B` solo para metadata, labels, timestamps y texto de baja prioridad.
- Mantener la fuente actual del proyecto: Geist. No cambiar a Inter.
- Mantener los colores oficiales de plataformas sociales:
  - Instagram: `#E1306C`, `#E4405F` y gradientes oficiales existentes.
  - LinkedIn: `#0A66C2`, `#0077B5`.
  - Facebook: `#1877F2`.

Archivos importantes:
1. `src/index.css`
   - Actualiza `@theme`.
   - Actualiza aliases `:root`.
   - Actualiza `html`, `body`, selection, scrollbars, focus rings, datepicker y chart variables.
   - Crea o conserva variables `--vl-*` si ayudan a centralizar el sistema.

2. `src/App.tsx`
   - Reemplaza splash/loading/toasts que usen colores viejos.

3. `src/components/layout/*`
   - Sidebar, topbar, dashboard shell y admin shell deben usar la nueva jerarquia visual.

4. `src/pages/*` y `src/components/*`
   - Reemplaza clases Tailwind arbitrarias con hex viejos.
   - Cuando sea posible, usa tokens semanticos: `bg-primary`, `text-on-surface`, `text-muted-foreground`, `border-border`, `bg-card`, `bg-muted`.
   - Si una clase arbitraria sigue siendo necesaria, usa los hex nuevos de la paleta.

5. `index.html`
   - Actualiza `meta name="theme-color"` a `#F8FAFC`.

Mapa de reemplazo recomendado:
- `#C8553A` -> `#111827` si es CTA principal.
- `#C8553A` -> `#0E9F6E` si es dot, badge, focus, highlight, icono o senal positiva.
- `#A53F28` -> `#0B1220` si es hover de CTA principal.
- `#A53F28` -> `#047857` si es hover/acento verde.
- `#F6F2EA` -> `#F8FAFC`
- `#FBF8F2` -> `#FFFFFF`
- `#EFE9DC` -> `#F1F5F9`
- `#E7E0D0` -> `#E2E8F0`
- `#D8D2C4` -> `#CBD5E1`
- `#15140F` -> `#0F172A`
- `#3D3A30` -> `#334155`
- `#6B655B` -> `#64748B`
- `#A39B8B` -> `#94A3B8`
- `#4F7A4A` -> `#047857`
- `#B7841E` -> `#B45309`
- `#A8362A` -> `#DC2626`
- `#4A6A82` -> `#2563EB`
- `#2F004D` -> eliminar; usa blanco sobre primary o `#0F172A` sobre superficie.
- `#FFD166` -> `#B45309` para texto warning o `#FEF3C7` como fondo warning.
- `#988D9C` -> `#94A3B8`
- `#A78BFA` -> `#2563EB` solo si tiene sentido informativo; si no, usa token semantico.
- `rgba(200,85,58,...)` -> `rgba(14,159,110,...)` para focus/accent glow, o elimina el glow si se ve decorativo.
- `rgba(21,20,15,...)` -> `rgba(15,23,42,...)`

Requisitos de accesibilidad:
- Texto normal debe cumplir WCAG AA 4.5:1.
- `#111827` con `#FFFFFF` para CTA principal.
- `#047857` con `#FFFFFF` para boton verde solido.
- No uses `#0E9F6E` con texto blanco pequeno.
- Focus visible obligatorio en links, botones, tabs, inputs y controles interactivos.

Validacion:
1. Ejecuta busquedas con `rg` para confirmar que no quedan colores viejos:
   - `#C8553A`
   - `#A53F28`
   - `#F6F2EA`
   - `#FBF8F2`
   - `#EFE9DC`
   - `#E7E0D0`
   - `#15140F`
   - `#3D3A30`
   - `#6B655B`
   - `#A39B8B`
   - `#2F004D`
   - `#FFD166`

2. Ejecuta:
   - `npm run build`

Criterios de aceptacion:
- La app ya no se ve terracotta/cream ni tipo Claude.
- La identidad se siente como Vielinks: profesional, limpia, SaaS, enfocada en publicar, planificar y crecer.
- CTAs principales usan obsidian.
- Senales positivas usan verde.
- Links e informacion usan azul.
- Los colores oficiales de redes sociales se mantienen.
- No hay regresiones visuales evidentes, texto ilegible ni contrastes pobres.
- No cambiaste layout, copy, rutas, comportamiento ni arquitectura.
```

