---
name: instagram-carousel
description: >
  Generate Instagram carousels as a fully self-contained, swipeable HTML file
  where every slide is export-ready as an individual 1080x1350px PNG for Instagram.
  Use when the user asks to create an Instagram carousel, carrusel de Instagram,
  design slides for IG, or export carousel images. Workflow: collect brand details →
  generate HTML with IG preview frame → export PNGs via Playwright.
---

# Instagram Carousel Generator

## Step 1: Collect Brand Details

Before generating, ask the user for (if not already provided):

1. **Topic / content** — what the carousel is about
2. **Brand name** — shown in the IG frame header
3. **Instagram handle** — shown in IG frame header
4. **Primary brand color** — one hex code (or provide brand images for auto-extraction)
5. **Logo** — image file path (WebP, PNG, SVG) for the IG frame avatar, or skip
6. **Heading font** — a premium/custom font file (.otf/.ttf) to embed, or a Google Fonts choice. Default: Inter Bold.
7. **Body font** — Google Fonts choice. Default: Inter.
8. **Tone** — professional, casual, playful, bold, minimal, etc.
9. **Images** — profile photo, screenshots, product images to embed

If the user provides a website URL, derive colors and style from it.
Do not assume defaults — ask before generating.

---

## BRAND IDENTITY SYSTEM

### Overview

The Brand Identity System lets users define their complete visual and verbal identity once, then reuse it across all carousels without repeating the same details. A saved brand profile is stored as `workspace/brands/{brand-slug}/brand.json`.

---

### Brand Commands

| Command | Description |
|---------|-------------|
| `brand new` | Interactive wizard to create a new brand profile |
| `brand load {name}` | Load an existing brand profile for current carousel |
| `brand list` | List all saved brand profiles |
| `brand edit {name}` | Update fields in an existing brand profile |
| `brand inspect {name}` | Show full brand profile in readable format |
| `brand delete {name}` | Remove a brand profile |

---

### Brand New — Wizard Flow

When the user runs `brand new` or there is no brand loaded, walk through these sections in order:

---

#### Section A: Identity

```
Brand name (display name):
Instagram handle (@):
Tagline or slogan (optional):
Website URL (optional — used to auto-derive style):
```

---

#### Section B: Visual References (NEW)

```
Do you have brand reference images? (logo, color palette, product photos, style tiles)
→ Provide file paths (space-separated), or press Enter to skip.
```

**When images are provided:**

1. Read each image file and embed as base64.
2. Analyze dominant colors using Python `colorthief` or `Pillow`:

```python
from PIL import Image
import base64, io

def extract_dominant_colors(image_path, n=5):
    img = Image.open(image_path).convert("RGB")
    img.thumbnail((200, 200))
    pixels = list(img.getdata())
    # Cluster pixels manually or use colorthief
    from colorthief import ColorThief
    ct = ColorThief(image_path)
    palette = ct.get_palette(color_count=n, quality=1)
    return [f"#{r:02x}{g:02x}{b:02x}" for r, g, b in palette]
```

3. Display the extracted palette to the user:

```
Extracted palette from your images:
  1. #1A2B3C  ████  (dominant)
  2. #F4E9D8  ████
  3. #C84B31  ████
  4. #2E7D32  ████
  5. #FFFFFF  ████

→ Which should be your PRIMARY brand color? (enter number or custom hex):
```

4. Save all reference image paths in `brand.json` under `visual_references`.
5. Store the full extracted palette under `color_palette_extracted`.

**If no images provided:** ask directly for the primary hex color.

---

#### Section C: Color System

After primary color is confirmed (from images or manual entry):

Auto-derive the 6-token palette using the design-system rules:

```
PRIMARY:       {input}
BRAND_LIGHT:   lighten 20%
BRAND_DARK:    darken 20%
LIGHT_BG:      near-white, 5% tint of primary
LIGHT_BORDER:  15% opacity of primary
DARK_BG:       very dark, 90% shade of primary
```

Show the derived palette and ask:
```
Derived color system:
  PRIMARY      #...  ████
  BRAND_LIGHT  #...  ████
  BRAND_DARK   #...  ████
  LIGHT_BG     #...  ████
  LIGHT_BORDER #...  ████
  DARK_BG      #...  ████

→ Accept this palette or adjust any token? (enter token name + new hex, or press Enter to accept):
```

---

#### Section D: Typography

```
Heading font:
  → Custom file (.otf/.ttf) path, or
  → Google Fonts name (e.g. "Playfair Display"), or
  → Press Enter for default (Inter Bold)

Body font:
  → Google Fonts name (e.g. "Lato"), or
  → Press Enter for default (Inter)

Font scale: compact / normal / large (default: normal)
```

---

#### Section E: Voice & Tone (NEW)

```
Brand tone:
  1. Professional & authoritative
  2. Warm & conversational
  3. Playful & energetic
  4. Bold & provocative
  5. Minimal & factual
  6. Inspirational & motivational
  7. Custom → describe in your own words

→ Select (1-7) or type custom:
```

After selecting tone, configure speech rules:

```
Language: Spanish / English / Both (bilingual)

CTA style:
  → Default: "Comenta [KEYWORD]"
  → Custom CTA pattern (e.g. "Guarda este post", "Comparte con alguien"):

Emoji usage: None / Minimal (1-2 per slide) / Moderate / Heavy

Sentence style: Short punchy sentences / Full paragraphs / Mixed

Vocabulary level: Simple & accessible / Technical & specific / Expert jargon

Hashtag style (for caption): None / Niche only / Mixed niche + broad / Full set

Caption template (optional — template for IG caption below the carousel):
```

Store all tone/speech rules under `voice` in `brand.json`.

**At generation time**, apply voice rules to all slide copy:
- Enforce sentence length based on `sentence_style`
- Apply emoji density from `emoji_usage`
- Use `cta_style` pattern on the last slide
- Output caption block using `caption_template` if set

---

#### Section F: Content Preferences (NEW)

```
Industry / niche (e.g. fitness, marketing, tech, finance, wellness):
Target audience (e.g. "entrepreneurs 25-40", "fitness beginners"):
Content pillars (comma-separated topics this brand talks about):
Avoid topics / words / themes (optional):
Preferred slide count: 5 / 7 / 9 / custom:
Default CTA keyword (used in "Comenta X" automation trigger):
```

---

#### Section G: Profile Assets

```
Logo file path (for IG frame avatar):
Profile photo path (optional — used in testimonial/proof slides):
Additional brand assets (product images, patterns, textures):
  → Provide file paths or press Enter to skip
```

All assets are stored by path in `brand.json`. At HTML generation time, embed as base64.

---

### brand.json Schema

```json
{
  "slug": "brand-slug",
  "name": "Brand Display Name",
  "handle": "@handle",
  "tagline": "Optional tagline",
  "website": "https://...",

  "visual_references": [
    "path/to/ref1.png",
    "path/to/ref2.jpg"
  ],
  "color_palette_extracted": ["#1A2B3C", "#F4E9D8", "#C84B31"],

  "colors": {
    "PRIMARY":      "#...",
    "BRAND_LIGHT":  "#...",
    "BRAND_DARK":   "#...",
    "LIGHT_BG":     "#...",
    "LIGHT_BORDER": "#...",
    "DARK_BG":      "#..."
  },

  "typography": {
    "heading_font": "Inter Bold",
    "heading_font_file": null,
    "body_font": "Inter",
    "font_scale": "normal"
  },

  "voice": {
    "tone": "professional",
    "tone_description": "Authoritative but approachable. Uses data and specifics.",
    "language": "Spanish",
    "cta_style": "Comenta [KEYWORD]",
    "emoji_usage": "minimal",
    "sentence_style": "short",
    "vocabulary_level": "accessible",
    "hashtag_style": "niche_only",
    "caption_template": ""
  },

  "content": {
    "industry": "marketing",
    "target_audience": "entrepreneurs 25-40",
    "content_pillars": ["growth", "conversion", "personal brand"],
    "avoid": [],
    "preferred_slide_count": 7,
    "default_cta_keyword": "INFO"
  },

  "assets": {
    "logo": "path/to/logo.svg",
    "profile_photo": null,
    "extras": []
  },

  "created_at": "YYYY-MM-DD",
  "updated_at": "YYYY-MM-DD"
}
```

---

### Brand Auto-Style Consistency Rules

When a brand is loaded, enforce these rules automatically across all slides:

1. **Color** — always use the brand's 6-token system; never introduce new colors
2. **Typography** — always embed the brand's heading/body fonts; never swap
3. **Tone** — rewrite all generated copy through the brand voice rules before rendering
4. **CTA** — always use the brand's `cta_style` on the last slide; never default to generic
5. **Emojis** — enforce `emoji_usage` density; strip or add accordingly
6. **Slide count** — default to `preferred_slide_count` unless overridden by the user
7. **Caption** — auto-generate IG caption using `caption_template` after export

---

### Brand Consistency Check

Before finalizing any carousel, run a brand consistency check:

```
Brand consistency check:
  [x] Primary color used in all slides
  [x] Heading font matches brand profile
  [x] Body font matches brand profile
  [x] CTA matches brand voice
  [x] No off-brand colors introduced
  [x] Emoji density within brand rules
  [ ] WARN: Slide 3 uses a color not in the brand palette → fix or override?
```

Report any warnings. Ask the user to confirm or override before export.

---

---

## Step 1.5: Load Brand Profile (REQUIRED before generating)

Before touching any HTML or copy, check if a brand profile exists:

```bash
ls workspace/brands/
```

**If a profile exists and the user has not specified one:** ask which brand to use.

**Once a brand is selected**, read `workspace/brands/{slug}/brand.json` and build the **Generation Context** — a live variable set used throughout all remaining steps:

```
GENERATION CONTEXT (active for this carousel)
----------------------------------------------
Brand:        {name} / {handle}
Colors:       PRIMARY={colors.PRIMARY}  LIGHT_BG={colors.LIGHT_BG}  DARK_BG={colors.DARK_BG}
              BRAND_LIGHT={colors.BRAND_LIGHT}  BRAND_DARK={colors.BRAND_DARK}
Fonts:        Heading={typography.heading_font}  Body={typography.body_font}
Tone:         {voice.tone} — {voice.tone_description}
Language:     {voice.language}
Sentences:    {voice.sentence_style}
Vocabulary:   {voice.vocabulary_level}
Emojis:       {voice.emoji_usage}
CTA pattern:  {voice.cta_style}
Audience:     {content.target_audience}
Niche:        {content.industry}
Slide count:  {content.preferred_slide_count}
CTA keyword:  {content.default_cta_keyword}
Avoid:        {content.avoid}
```

Print this block so the user can confirm the active brand context before generation starts.

**If no brand profile exists:** run the Brand New wizard (Section A-G above), then save `brand.json` before continuing.

---

## Step 2: Derive Color System & Typography

Read [`references/design-system.md`](references/design-system.md) for:
- The full 6-token color derivation rules (BRAND_PRIMARY → BRAND_LIGHT, BRAND_DARK, LIGHT_BG, LIGHT_BORDER, DARK_BG)
- Typography setup: heading font (embedded via base64 @font-face) + body font (via Google Fonts)
- All reusable components (progress bar, swipe arrow, tag labels, feature lists, etc.)
- **Logo**: ONLY in IG frame avatar (`.ig-header`), NEVER inside slide content (slides must be logo-free for Instagram export)

**Inject brand colors directly into CSS variables at the top of the generated HTML:**

```html
<style>
  :root {
    --primary:      {colors.PRIMARY};
    --brand-light:  {colors.BRAND_LIGHT};
    --brand-dark:   {colors.BRAND_DARK};
    --light-bg:     {colors.LIGHT_BG};
    --light-border: {colors.LIGHT_BORDER};
    --dark-bg:      {colors.DARK_BG};
  }
</style>
```

Every color reference in slide CSS must use these variables — never hardcode hex values.

---

## COPY GENERATION RULES (Brand Voice Applied)

Before writing ANY text for any slide, construct this internal writing prompt and apply it to every heading, body, tag label, and CTA:

```
You are writing copy for {name} (@{handle}).

Tone: {voice.tone_description}
Language: {voice.language}
Audience: {content.target_audience} in the {content.industry} space
Sentence style: {voice.sentence_style}
  - "short" = max 8 words per sentence, punchy, no filler
  - "paragraphs" = 2-3 complete sentences per block
  - "mixed" = short headlines, 1-2 sentence body
Vocabulary: {voice.vocabulary_level}
  - "accessible" = no jargon, plain language
  - "technical" = use field-specific terms freely
  - "expert" = assume domain expert reader
Emoji usage: {voice.emoji_usage}
  - "none" = zero emojis anywhere
  - "minimal" = max 1 emoji per slide, only in body text
  - "moderate" = 1-2 per slide, ok in headings
  - "heavy" = 2-4 per slide freely
Avoid these words/themes: {content.avoid}
Content pillars this brand covers: {content.pillars}
```

Apply this copy prompt to every slide. Do not deviate from the tone even on "neutral" structural slides like the proof slide or feature list.

**CTA Slide (always the last slide):**
- Replace [KEYWORD] with `{content.default_cta_keyword}`
- Final CTA text = `{voice.cta_style}` with keyword substituted
- Example: if cta_style = "Comenta [KEYWORD]" and keyword = "GUIA" → "Comenta GUIA"

**IG Caption (generated after export):**
- Use `{voice.caption_template}` if set
- Apply same tone and language rules
- Apply `{voice.hashtag_style}`:
  - "none" = no hashtags
  - "niche_only" = 5-8 highly specific hashtags
  - "mixed" = 10-15 niche + broad mix
  - "full_set" = 20-30 hashtags covering all angles

---

## Step 3: Generate the HTML Carousel

### File location
Save as: `workspace/carousels/{YYYY-MM-DD}-{slug}/carousel.html`

### Structure
Generate a **single self-contained HTML file** containing:
- `@font-face` for heading font (embedded as base64 from the provided font file)
- Google Fonts `<link>` import for body font (Inter or user's choice)
- CSS classes `.heading` (heading font) and `.body` (body font)
- Instagram Frame wrapper (`.ig-frame` — must be **exactly 420px wide**)
- `.carousel-track` with all slides side by side (each slide: 420x525px, position:relative)
- Pointer-based swipe/drag interaction JS
- Dot indicators + IG actions (heart, comment, share, bookmark icons)

### Every slide must include:
1. **Progress bar** (bottom, absolute position) — see design-system.md for exact code
2. **Swipe arrow** (right edge) — on every slide EXCEPT the last
3. **Tag label** + **heading** + **body text** adapted to slide type
4. Content padding `0 36px 52px` (bottom clears the progress bar)

### Standard sequence (7 slides, flex 5-10):
| # | Type | Background |
|---|------|------------|
| 1 | Hero | LIGHT_BG — scroll-stopping hook |
| 2 | Context | DARK_BG — situation or pain point |
| 3 | Insight | Brand gradient — the key revelation |
| 4 | Features | LIGHT_BG — feature list with icons |
| 5 | Depth | DARK_BG — differentiators or details |
| 6 | Proof | LIGHT_BG — numbers, data, steps |
| 7 | CTA | Brand gradient — no arrow, full progress bar |

Adapt sequence to the topic. Not every carousel needs all 7 slides.

### Image embedding
All images must be embedded as base64 in the HTML:
```python
import base64
data = open("image.jpg", "rb").read()
b64 = base64.b64encode(data).decode()
# Use: data:image/jpeg;base64,{b64}
# Check actual format with `file` command — may be JPEG despite .png extension
```

**Always use Python (not shell scripts) to generate the HTML file** — shell variable interpolation corrupts `$` signs and numbers in HTML.

## Step 4: Show Preview & Iterate

Present the HTML file path and ask the user to open it in a browser to swipe through the preview. Iterate on specific slides based on feedback — do not rebuild from scratch.

## Step 5: Export PNG Slides

After the user approves, export each slide as 1080x1350px PNG:

```bash
python .claude/skills/instagram-carousel/scripts/export_slides.py \
  workspace/carousels/{slug}/carousel.html \
  workspace/carousels/{slug}/slides \
  --slides {N}
```

Requirements (if not installed):
```bash
pip install playwright
playwright install chromium
```

### Why it works
- Viewport stays at 420x525px; `device_scale_factor=2.5714` scales output to 1080x1350
- Layout never reflows — fonts, spacing, and positions match the HTML preview exactly
- Never set viewport to 1080x1350 — that would break the layout

### Common export mistakes
| Mistake | Fix |
|---------|-----|
| Viewport set to 1080px | Keep at 420px, use device_scale_factor |
| Shell script generates HTML | Use Python's `Path.write_text()` |
| Fonts render as fallback | `wait_for_timeout(3000)` after page load |
| Export includes IG chrome | Script hides `.ig-header,.ig-dots,.ig-actions,.ig-caption` |

## Design Principles

- First slide must stop the scroll — bold hook, not a description
- Last slide: no arrow (signals end), full progress bar, clear CTA
- Light/dark alternation sustains attention across swipes
- Content padding must never overlap the progress bar
- All images embedded as base64 — HTML is fully self-contained
- Tag labels describe the TOPIC of the slide, not the structural role
- CTA uses the brand's configured `cta_style` — default "Comenta [KEYWORD]"
- All slides vertically centered (`justify-content: center`) — never leave empty space at top
- Every Python string line containing `{variable}` MUST have the `f` prefix — watch multi-line concatenation
