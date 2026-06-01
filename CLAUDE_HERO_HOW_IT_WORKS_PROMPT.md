# Prompt para Claude: Hero Principal + How It Works

## Contexto

Proyecto: Vielinks.

Stack actual:

- Vite + React + TypeScript.
- Tailwind CSS v4 usando `src/index.css` con `@theme`.
- Estructura tipo shadcn ya presente.
- Ruta real para componentes UI: `src/components/ui`.
- Alias `@/*` configurado hacia `src/*`, por eso los imports correctos son `@/components/ui/...`.
- `lenis` ya existe en `package.json`.
- El app ya inicializa Lenis globalmente en `src/App.tsx` mediante `LenisProvider`.

No instales shadcn, Tailwind ni TypeScript. Ya existen.

Si necesitas el componente pedido como `/components/ui`, en este repo debes crearlo en `src/components/ui`, porque esa es la ruta real usada por el alias `@/components/ui`. Crear una carpeta raíz `/components/ui` rompería el patrón del proyecto y los imports.

## Skills / criterio de diseño que debes aplicar

Antes de editar, usa estos criterios:

- Emil Kowalski / design engineering: movimiento con propósito, detalles invisibles, animaciones rápidas, nada ornamental si no mejora comprensión.
- Impeccable Claude skill: implementa con precisión, lee el contexto local, no inventes datos, verifica build.
- Taste skill: jerarquía clara, composición limpia, contraste, ritmo visual, menos ruido.
- Mantén el enfoque minimalista, conciso y premium.

## Objetivo

Arreglar el hero principal y rehacer la sección `How it works`.

Archivos principales:

- `src/pages/LandingPage.tsx`
- `src/components/ui/aurora-background.tsx`
- `src/index.css`
- nuevo componente: `src/components/ui/smooth-scroll.tsx`

## Requisitos del Hero Principal

1. El hero debe ocupar toda la pantalla.
   - Usa `min-h-screen` o `min-h-[100svh]`.
   - No debe dejar ver parte de la siguiente sección en desktop ni mobile.
   - Considera el header fijo para que el contenido no quede tapado.

2. Mantener fondo blanco.
   - No cambies el hero a fondo oscuro.
   - No uses gradientes de colores llamativos.

3. Hacer los rayos/reflejos negros más visibles.
   - Actualmente casi no se ven.
   - Mantén los reflejos en negro/gris slate, no azules, violetas ni verdes.
   - Deben sentirse como luces o líneas suaves sobre blanco, no como ruido pesado.
   - Sugerencia: subir opacidad de la capa Aurora, reducir blur si hace falta y ajustar `mask-image`.
   - Debe seguir siendo elegante y minimalista.

4. El copy debe ser conciso.
   - No inventes datos como “200+ marketers”, porcentajes, métricas falsas, nombres de personas o campañas ficticias.
   - Mantén una promesa clara:
     - Vielinks.
     - Plan, approve, publish, and measure posts for Instagram, LinkedIn, and Facebook from one quiet workspace.

5. Usa iconos en el hero para las funciones.
   - Funciones esperadas:
     - Calendar
     - Approval
     - Publishing
     - Analytics
   - Usa iconos consistentes con el proyecto.
   - Puedes usar `lucide-react` porque ya está instalado, pero usa tamaños y stroke coherentes.
   - No uses emojis.
   - Evita cards grandes; usa una fila compacta, refinada, con borde sutil.

6. Botones del hero.
   - CTA primario: `Start free`, fondo `#111827`, texto blanco.
   - CTA secundario: `View product` o equivalente, borde sutil sobre blanco.
   - Radio moderado (`rounded-md` o similar), no pills exageradas.

## Requisitos de Aurora

El componente ya existe en:

`src/components/ui/aurora-background.tsx`

Ajústalo para:

- Fondo blanco.
- Rayos/reflejos negros más visibles.
- Animación suave y lenta.
- No usar colores brillantes.
- No crear orbs decorativos.
- No romper `prefers-reduced-motion`; si agregas comportamiento extra, respétalo.

Tailwind v4:

- No crees `tailwind.config.js` si el proyecto no lo usa.
- La animación `aurora` debe vivir en `src/index.css` con `@keyframes aurora` y `--animate-aurora` dentro de `@theme`.

## Requisitos de How It Works

La sección actual `HowItWorks` no debe seguir como está.

Debes crear e integrar este componente:

`src/components/ui/smooth-scroll.tsx`

Basado en el componente dado por el usuario, pero adaptado al proyecto:

```tsx
'use client';
import { ReactLenis } from 'lenis/react';
import { forwardRef } from 'react';

const Component = forwardRef<HTMLElement>((props, ref) => {
  return (
    <ReactLenis root>
      <main ref={ref}>
        <article>
          <section className="...">...</section>
          <section className="...">...</section>
          <section className="...">...</section>
        </article>
      </main>
    </ReactLenis>
  );
});

Component.displayName = 'Component';

export default Component;
```

Importante:

- `lenis` ya está instalado.
- El proyecto ya tiene `LenisProvider` global en `src/App.tsx`.
- Evita crear una segunda instancia raíz de Lenis si causa conflicto.
- Si usas `ReactLenis root`, verifica que no rompa el scroll global.
- Si hay conflicto, adapta el componente para usar el Lenis global existente sin envolver en otro root.

## Diseño de `smooth-scroll.tsx`

Debe reemplazar la sección `How it works` del landing.

Contenido recomendado, sin inventar métricas:

1. `Plan`
   - Background distinto.
   - Explica que el equipo organiza posts en calendario.

2. `Approve`
   - Background distinto.
   - Explica revisión antes de publicar.

3. `Publish`
   - Background distinto.
   - Explica publicación en canales conectados.

4. `Measure`
   - Background distinto.
   - Explica lectura de resultados por post y plataforma.

Cada background debe ser un color diferente, pero dentro de una paleta sobria:

- Blanco / `#FFFFFF`
- Surface / `#F8FAFC`
- Raised / `#F1F5F9`
- Primary dark / `#0F172A`

No uses fondos chillones.
No uses emojis.
No uses copy largo.
No uses datos inventados.

La sección debe tener:

- `h-screen` o `min-h-screen` por panel.
- `sticky top-0` si se mantiene el patrón del componente.
- Grid o layout centrado.
- Icono por paso.
- Texto corto.
- Bordes o líneas sutiles si ayudan.

## Integración

En `src/pages/LandingPage.tsx`:

1. Importa el nuevo componente:

```tsx
import SmoothScrollSections from '@/components/ui/smooth-scroll';
```

2. Reemplaza el `HowItWorks` actual por el nuevo componente.

3. Mantén el orden del landing claro:

```tsx
<Hero />
<SmoothScrollSections />
<Features />
<Pricing />
<FAQ />
<BigCTA />
```

Si existe `ScrollLegend`, actualiza sus ids para que funcionen con la nueva sección.

## Restricciones

- No cambies rutas.
- No cambies auth.
- No cambies páginas de producto.
- No modifiques footer ni header salvo que sea necesario por spacing del hero.
- No agregues nuevos datos comerciales sin fuente.
- No uses emojis.
- No uses orbs, bokeh blobs ni gradients coloridos.
- No uses cards dentro de cards.
- No dejes texto superpuesto o cortado en mobile.

## Verificación obligatoria

1. Ejecuta:

```bash
npm run build
```

2. Revisa visualmente:

- Desktop: hero ocupa exactamente la primera pantalla.
- Mobile: hero ocupa la pantalla y no corta CTAs.
- Rayos negros visibles pero no sucios.
- `How it works` se entiende con scroll sticky.
- Cada panel de `How it works` tiene background distinto.
- No aparecen datos inventados.

3. Busca restos problemáticos:

```bash
rg -n "200\\+|engagement rate|Weekend giveaway|Series A|Behind the scenes|emoji|👇|☝️|🎁|✨" src/pages/LandingPage.tsx src/components/ui
```

No debe quedar nada de eso.

## Prompt corto para pegar en Claude

```text
Lee `CLAUDE_HERO_HOW_IT_WORKS_PROMPT.md` completo y ejecuta el cambio. Usa criterio Emil Kowalski, Impeccable Claude y Taste skill. Arregla primero el hero principal: fondo blanco, rayos negros de Aurora más visibles, full screen real sin mostrar la siguiente sección, copy conciso y sin datos inventados, e iconos para Calendar, Approval, Publishing y Analytics. Después reemplaza la sección `How it works` con un componente reutilizable en `src/components/ui/smooth-scroll.tsx`, inspirado en el componente smooth-scroll dado, con paneles sticky/full-screen y background diferente por paso. Respeta Tailwind v4, TypeScript, la estructura `src/components/ui`, el Lenis global existente y ejecuta `npm run build` al final.
```
