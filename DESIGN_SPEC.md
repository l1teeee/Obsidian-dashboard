# Vielinks Dashboard — Minimal Editorial Design Specification
Extracted from `Vielinks Dashboard _standalone_.html`

---

## COLOR SYSTEM

### Core Surfaces
- `--bg: #F6F2EA` — page background, warm ivory
- `--bg-elevated: #FBF8F2` — cards, panels
- `--bg-sunken: #EFE9DC` — recessed wells, inactive states
- `--bg-inset: #E7E0D0` — large dividers

### Typography (Ink)
- `--ink: #15140F` — primary text, headlines
- `--ink-2: #3D3A30` — secondary body text
- `--ink-3: #6B655B` — muted labels, captions
- `--ink-4: #A39B8B` — placeholders

### Accent (Terracotta)
- `--accent: #C8553A` — primary action/highlight
- `--accent-deep: #A53F28` — hover/pressed
- `--accent-soft: #F4E0D6` — background tint
- `--accent-ink: #FFFFFF` — text on accent

### Borders
- `--line: rgba(21,20,15,0.10)` — default hairline
- `--line-strong: rgba(21,20,15,0.18)` — emphasized
- `--line-soft: rgba(21,20,15,0.06)` — whisper

### Semantic
- Success: `#4F7A4A` + soft `#E4EBDF`
- Warning: `#B7841E` + soft `#F4EAD1`
- Danger: `#A8362A` + soft `#F2DCD7`
- Info: `#4A6A82` + soft `#E0E8EE`

### Platform Brands
- Instagram: `#E1306C`
- LinkedIn: `#0A66C2`
- Facebook: `#1877F2`

---

## TYPOGRAPHY

Font stack: `'Geist', Arial, ui-sans-serif, system-ui`
Mono: `'Geist Mono', ui-monospace, 'JetBrains Mono', Menlo`

| Usage | Size | Weight | Letter Spacing |
|-------|------|--------|----------------|
| Hero/Display | 88px | 500 | -0.04em |
| h1 | 64px | 500 | -0.035em |
| h2 | 44px | 500 | -0.03em |
| h3 | 32px | 600 | -0.015em |
| h4 | 24px | 600 | -0.015em |
| h5 | 20px | 600 | 0 |
| Lead | 17px | 400 | 0 |
| Body | 15px | 400 | 0 |
| Small | 13px | 400 | 0 |
| Caption | 12px | 400 | 0 |
| Eyebrow | 11px | 500 | 0.18em |

---

## BORDER RADIUS

```
--r-xs:  4px
--r-sm:  6px
--r-md:  10px
--r-lg:  14px
--r-xl:  20px
--r-2xl: 28px
--r-full: 9999px
```

---

## SHADOW SYSTEM

```
--shadow-1: 0 1px 0 rgba(21,20,15,0.04), 0 1px 2px rgba(21,20,15,0.04)
--shadow-2: 0 1px 0 rgba(21,20,15,0.04), 0 4px 12px rgba(21,20,15,0.05)
--shadow-3: 0 2px 0 rgba(21,20,15,0.04), 0 12px 32px rgba(21,20,15,0.08)
--shadow-4: 0 4px 0 rgba(21,20,15,0.04), 0 28px 64px rgba(21,20,15,0.10)
--shadow-focus: 0 0 0 3px rgba(200,85,58,0.22)
```

Philosophy: Extremely restrained. Most components use shadow-1. Modals use shadow-3/4. No glows.

---

## MOTION

```
--ease-out:  cubic-bezier(0.16, 1, 0.3, 1)
--ease-soft: cubic-bezier(0.4, 0.0, 0.2, 1)
--d-fast:    120ms
--d-base:    200ms
--d-slow:    400ms
```

---

## LAYOUT

App shell: `248px sidebar + 1fr content`  
Content max-width: 1320px, padding 32px 40px 64px  
Narrow: 880px

Grids:
- KPI cards: `repeat(4, 1fr)` gap 14px
- Curation: `repeat(3, 1fr)` gap 16px
- Calendar: `repeat(7, 1fr)` rows 120px min
- Composer channels: `repeat(3, 1fr)` gap 10px
- Table: `2fr 1fr 1fr 1fr 1fr 90px`

---

## SIDEBAR

Width: 248px | Background: `--bg-elevated` | Border-right: 1px `--line`  
Padding: 20px 14px 16px

- Logo: 22px SVG
- Brand text: 17px, weight 500, letter-spacing -0.02em
- Workspace selector: 9px 12px padding, 10px radius, hover `--bg-sunken`
- Compose button: accent background, white text
- Nav items: 8px 12px padding, 8px radius
  - Active: 2px left accent bar + bold + `--bg-sunken` background
- Bottom user card: 30px avatar, 13px name, 9px plan

---

## TOPBAR

Height: 64px | Background: `--bg` | Border-bottom: 1px `--line` | Padding: 0 32px

- Title: Geist, 18px, weight 500, letter-spacing -0.02em
- Sub-text: 13px, `--ink-3`
- Action buttons: 34px circles

---

## CARDS

Standard card:
- Background: `--bg-elevated`
- Border: 1px solid `--line`
- Border-radius: 14px
- Padding: 24px

Hero card:
- Border-radius: 16px
- Padding: 28px 32px
- Title: 36px, weight 500, letter-spacing -0.032em
- Subtitle: 14px, `--ink-3`

---

## BUTTONS

Base: padding 8px 14px, font 13px weight 500, radius 10px, transition 200ms

Variants:
- Primary: bg `--ink`, text `--bg`, hover `--ink-2`
- Accent: bg `--accent`, text white, hover `--accent-deep`
- Ghost: transparent, text `--ink-2`, hover `--bg-sunken`
- Outline: bg `--bg`, border `--line-strong`, text `--ink`

Sizes:
- Small: 6px 10px, 12px, radius 8px
- Large: 11px 20px, 14px, radius 10px

---

## FORMS & INPUTS

Field label: 11px, weight 500, uppercase, letter-spacing 0.14em, color `--ink-3`

Input:
- Padding: 11px 14px
- Border: 1px solid `--line`
- Background: `--bg`
- Radius: 10px
- Font: 14px
- Focus: border `--ink`, shadow `--shadow-focus`

Chips: padding 5px 10px, radius 999px, 12px  
Active chip: border + text `--accent`, bg `--accent-soft`

Badges: padding 3px 8px, 10px mono, uppercase  
Variants: success, warning, danger, info, muted, accent, ink

Tabs: background `--bg-sunken`, radius 10px, active: bg `--bg-elevated`, shadow-1

---

## MODALS

Scrim: `rgba(21,20,15,0.42)`, backdrop-blur 4px

Modal:
- Max-width: 520px (lg: 720px)
- Background: `--bg-elevated`
- Border-radius: 18px
- Shadow: `0 28px 64px rgba(21,20,15,0.18)`
- Entrance: translateY(8px) → 0

Head: padding 20px 24px 16px  
Icon: 40px, bg `--accent-soft`, color `--accent-deep`, radius 10px

---

## TABLES

Head: background `--bg-sunken`, 10px eyebrow, uppercase  
Row: padding 14px 22px, border-bottom `--line`, hover `--bg`  
Thumb: 36px, radius 8px  
Icon button: 28px, radius 6px, hover `--bg-sunken`

---

## CALENDAR

Grid: 7 columns  
Day cell: 120px min-height, padding 8px 10px  
Day number: mono, 12px, weight 500  
Today: 22px circle, accent bg, white text  
Event chip: 11px, bg `--bg-sunken`, border-left 2px platform color  
Platform colors: Instagram `#E1306C`, LinkedIn `#0A66C2`, Facebook `#1877F2`

---

## KPI CARDS

Padding: 18px 20px, min-height 132px  
Label: 10px eyebrow  
Value: 36px Geist, weight 500, letter-spacing -0.03em  
Delta badge: 11px mono, padding 2px 6px, radius 999px  
Spark bars: 24px height, radius 2px, off=`--bg-sunken`, on=`--accent`

---

## COMPOSER

Layout: grid `1fr 380px`, gap 32px

Channels: `repeat(3,1fr)`, gap 10px  
- Padding: 14px 16px, radius 12px
- Active: border `--accent` + bg `--accent-soft`

Dropzone: 1.5px dashed `--line-strong`, radius 12px, padding 32px 24px  
- Hover: border `--accent`, bg `--accent-soft`

---

## PLATFORMS

Connection card: padding 20px 22px  
Logo: 40px, radius 10px, brand-colored bg  
Rows: grid `100px 1fr`, border-bottom `--line`

Add card: 1.5px dashed `--line-strong`, padding 22px, flex gap 14px  
Icon: 40px, bg `--bg-sunken`, radius 10px

---

## ENGAGEMENT ROW

Grid: `56px 1fr auto auto`  
Thumb: 48px, radius 10px  
Metrics: mono font, value 14px weight 500, label 9px uppercase letter-spacing 0.14em

---

## ACTIVITY TIMELINE

Flex column, gap 8px  
Group head: bg `--bg-sunken`, padding 14px 22px, border-bottom `--line`  
Row: grid `32px 1fr auto`, padding 14px 22px, hover `--bg`  
Icon: 28px, radius 8px, bg `--bg-sunken`

---

## GLOBAL RESETS

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
::placeholder { color: var(--ink-4); }
::selection { background: var(--accent); color: white; }
:focus-visible { outline: none; box-shadow: var(--shadow-focus); }
-webkit-font-smoothing: antialiased;
font-feature-settings: 'ss01', 'cv01';
```
