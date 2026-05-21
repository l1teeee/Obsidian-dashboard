# Vielinks Obsidian Signal

Paleta oficial recomendada para Vielinks, enfocada en un SaaS profesional para publicar posts, planificar contenido, revisar métricas y trabajar con señales de crecimiento.

La dirección visual combina una base sobria tipo dashboard con acentos claros para estados, acciones y señales importantes.

## Brand Palette

| Token | Uso | Color |
|---|---|---:|
| `primary` | CTA principal, botones principales, navegación activa | `#111827` |
| `primary-hover` | Hover del CTA principal | `#0B1220` |
| `signal-green` | Señales positivas, publicado, conectado, crecimiento | `#0E9F6E` |
| `success` | Botones verdes sólidos, acciones de éxito | `#047857` |
| `success-hover` | Hover de botones verdes sólidos | `#065F46` |
| `info-blue` | Links, información, acciones secundarias | `#2563EB` |
| `warning` | Advertencias, pausado, atención requerida | `#B45309` |
| `warning-soft` | Fondo suave para warning | `#FEF3C7` |
| `error` | Errores, fallos, acciones destructivas | `#DC2626` |
| `error-soft` | Fondo suave para error | `#FEE2E2` |
| `background` | Fondo principal de la app | `#F8FAFC` |
| `card` | Cards, paneles, modales | `#FFFFFF` |
| `surface-raised` | Superficies elevadas, bloques secundarios | `#F1F5F9` |
| `divider` | Bordes suaves, separadores | `#E2E8F0` |
| `divider-strong` | Bordes más visibles | `#CBD5E1` |
| `text-primary` | Títulos y texto principal | `#0F172A` |
| `text-secondary` | Texto secundario | `#334155` |
| `text-muted` | Metadata, labels, timestamps | `#64748B` |

## CSS Variables

```css
:root {
  /* Brand */
  --vl-primary: #111827;
  --vl-primary-hover: #0B1220;

  /* Signals */
  --vl-signal-green: #0E9F6E;
  --vl-success: #047857;
  --vl-success-hover: #065F46;
  --vl-success-soft: #ECFDF5;

  /* Info */
  --vl-info-blue: #2563EB;
  --vl-info-soft: #EFF6FF;

  /* Warning and danger */
  --vl-warning: #B45309;
  --vl-warning-soft: #FEF3C7;
  --vl-error: #DC2626;
  --vl-error-soft: #FEE2E2;

  /* Surfaces */
  --vl-background: #F8FAFC;
  --vl-card: #FFFFFF;
  --vl-surface-raised: #F1F5F9;

  /* Borders */
  --vl-divider: #E2E8F0;
  --vl-divider-strong: #CBD5E1;

  /* Text */
  --vl-text-primary: #0F172A;
  --vl-text-secondary: #334155;
  --vl-text-muted: #64748B;

  /* Focus */
  --vl-focus-ring: rgba(14, 159, 110, 0.28);

  /* Shadows */
  --vl-shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.06);
  --vl-shadow-md: 0 8px 24px rgba(15, 23, 42, 0.08);

  /* Radius */
  --vl-radius-sm: 8px;
  --vl-radius-md: 12px;
  --vl-radius-lg: 16px;
  --vl-radius-xl: 24px;
}
```

## Tailwind v4 Token Mapping

Este proyecto usa Tailwind v4 con tokens en `src/index.css`. Además de las variables `--vl-*`, mapear estos valores a los tokens reales del tema:

```css
@theme {
  --color-primary: #111827;
  --color-primary-container: #E5E7EB;
  --color-on-primary: #FFFFFF;
  --color-inverse-primary: #0B1220;

  --color-secondary: #0E9F6E;
  --color-secondary-container: #ECFDF5;
  --color-on-secondary: #052E1C;

  --color-tertiary: #2563EB;
  --color-tertiary-container: #EFF6FF;
  --color-on-tertiary: #FFFFFF;

  --color-background: #F8FAFC;
  --color-surface: #F8FAFC;
  --color-card: #FFFFFF;
  --color-muted: #E2E8F0;
  --color-border: rgba(15, 23, 42, 0.12);
  --color-ring: rgba(14, 159, 110, 0.42);

  --color-on-background: #0F172A;
  --color-on-surface: #0F172A;
  --color-on-surface-variant: #334155;
  --color-muted-foreground: #64748B;

  --color-success: #047857;
  --color-warning: #B45309;
  --color-error: #DC2626;
  --color-info: #2563EB;
}
```

## Usage Rules

### Primary CTA

Usar `#111827` para acciones principales como:

- Create post
- Schedule post
- Connect account
- Start publishing
- Upgrade plan

```css
.button-primary {
  background: var(--vl-primary);
  color: #FFFFFF;
  border: 1px solid var(--vl-primary);
}

.button-primary:hover {
  background: var(--vl-primary-hover);
  border-color: var(--vl-primary-hover);
}
```

### Green Signal

Usar `#0E9F6E` para indicadores visuales, iconos, dots, métricas positivas y rings. No usarlo como botón sólido con texto blanco pequeño.

Ideal para:

- Published
- Connected
- Active
- Growth
- Positive metric
- AI ready
- Success icon

```css
.badge-success {
  background: var(--vl-success-soft);
  color: var(--vl-success);
  border: 1px solid rgba(14, 159, 110, 0.18);
}
```

### Solid Green Button

Para botones verdes sólidos, usar `#047857` porque tiene mejor contraste con texto blanco.

```css
.button-success {
  background: var(--vl-success);
  color: #FFFFFF;
  border: 1px solid var(--vl-success);
}

.button-success:hover {
  background: var(--vl-success-hover);
  border-color: var(--vl-success-hover);
}
```

### Links

Usar `#2563EB` para enlaces y acciones informativas.

```css
.link {
  color: var(--vl-info-blue);
  font-weight: 500;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
```

### Focus

Los estados de foco deben ser visibles, consistentes y accesibles.

```css
:focus-visible {
  outline: 2px solid var(--vl-signal-green);
  outline-offset: 3px;
  box-shadow: 0 0 0 4px var(--vl-focus-ring);
}
```

## Component Examples

### Page Layout

El proyecto usa Geist, no Inter. Mantener la tipografía actual.

```css
body {
  margin: 0;
  background: var(--vl-background);
  color: var(--vl-text-primary);
  font-family: "Geist", Arial, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
}
```

### Card

```css
.card {
  background: var(--vl-card);
  border: 1px solid var(--vl-divider);
  border-radius: var(--vl-radius-lg);
  box-shadow: var(--vl-shadow-sm);
  padding: 24px;
}

.card:hover {
  box-shadow: var(--vl-shadow-md);
}
```

### Raised Surface

```css
.surface-raised {
  background: var(--vl-surface-raised);
  border: 1px solid var(--vl-divider);
  border-radius: var(--vl-radius-md);
}
```

### Dashboard Metric Card

```css
.metric-card {
  background: var(--vl-card);
  border: 1px solid var(--vl-divider);
  border-radius: var(--vl-radius-lg);
  padding: 20px;
}

.metric-label {
  color: var(--vl-text-muted);
  font-size: 14px;
  font-weight: 500;
}

.metric-value {
  color: var(--vl-text-primary);
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.metric-positive {
  color: var(--vl-success);
  font-size: 14px;
  font-weight: 600;
}
```

### Post Status Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 13px;
  font-weight: 600;
}

.badge-published {
  background: var(--vl-success-soft);
  color: var(--vl-success);
  border: 1px solid rgba(14, 159, 110, 0.18);
}

.badge-draft {
  background: var(--vl-surface-raised);
  color: var(--vl-text-secondary);
  border: 1px solid var(--vl-divider);
}

.badge-scheduled {
  background: var(--vl-info-soft);
  color: var(--vl-info-blue);
  border: 1px solid rgba(37, 99, 235, 0.18);
}

.badge-failed {
  background: var(--vl-error-soft);
  color: var(--vl-error);
  border: 1px solid rgba(220, 38, 38, 0.18);
}
```

## Recommended UI Mapping

| Elemento | Color recomendado |
|---|---|
| Header / sidebar active item | `#111827` |
| Main CTA | `#111827` |
| Main CTA hover | `#0B1220` |
| Publish success | `#047857` |
| Published badge | `#ECFDF5` background + `#047857` text |
| Connected account | `#0E9F6E` icon or dot |
| Analytics growth | `#047857` |
| Links | `#2563EB` |
| Warning | `#FEF3C7` background + `#B45309` text |
| Error | `#FEE2E2` background + `#DC2626` text |
| App background | `#F8FAFC` |
| Cards | `#FFFFFF` |
| Card border | `#E2E8F0` |
| Strong divider | `#CBD5E1` |
| Main titles | `#0F172A` |
| Body text | `#334155` |
| Metadata | `#64748B` |

## Platform Colors

Mantener colores oficiales de plataformas. No reemplazarlos por la paleta de marca.

| Plataforma | Color |
|---|---:|
| Instagram | `#E1306C` / `#E4405F` |
| LinkedIn | `#0A66C2` / `#0077B5` |
| Facebook | `#1877F2` |

## Do

Use the obsidian primary color for important product actions.

```css
background: #111827;
color: #FFFFFF;
```

Use green for positive states and publishing status.

```css
color: #047857;
background: #ECFDF5;
```

Use blue only for informational actions and links.

```css
color: #2563EB;
```

## Avoid

Do not use `#0E9F6E` as a solid button with small white text.

```css
/* Avoid */
background: #0E9F6E;
color: #FFFFFF;
```

Instead use:

```css
/* Recommended */
background: #047857;
color: #FFFFFF;
```

Do not overuse blue for primary actions. Blue should feel informative, not like the main brand CTA.

Do not use muted text for long paragraphs. Use `#334155` for readable secondary text.

Do not use raw hex values deep inside components when a semantic token exists. Prefer `bg-primary`, `text-on-surface`, `border-border`, `text-muted-foreground`, or `var(--vl-*)`.

## Brand Feel

Vielinks should feel:

- Professional
- Clean
- Product-led
- Trustworthy
- SaaS-oriented
- Calm but actionable
- Focused on publishing, planning and growth

The palette should not feel too playful, overly neon or too close to a generic social media tool.

## Final Recommendation

Use **Obsidian** as the main brand action color.

Use **Signal Green** as a product signal color.

Use **Blue** as a utility color for links and secondary informational actions.

This gives Vielinks a clear SaaS identity: serious enough for business users, but still modern and friendly for creators, marketers and social media teams.
