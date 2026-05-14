import os

REPLACEMENTS = [
    # ── Dark backgrounds → warm light ──────────────────────────────────────
    ('bg-[#0B0B0A]',  'bg-[#F4F0E8]'),
    ('bg-[#0b0b0a]',  'bg-[#F4F0E8]'),
    ('bg-[#0e0e0e]',  'bg-[#F4F0E8]'),
    ('bg-[#0E0E0E]',  'bg-[#F4F0E8]'),
    ('bg-[#1a1919]',  'bg-[#FAF7F2]'),
    ('bg-[#1A1919]',  'bg-[#FAF7F2]'),
    ('bg-[#1c1b1b]',  'bg-[#FAF7F2]'),
    ('bg-[#1C1B1B]',  'bg-[#FAF7F2]'),
    ('bg-[#171615]',  'bg-[#F3EEE6]'),
    ('bg-[#201f1f]',  'bg-[#F0EBE2]'),
    ('bg-[#2a2a2a]',  'bg-[#E5DFD6]'),
    ('bg-[#242322]',  'bg-[#EDE8DF]'),
    ('bg-[#242321]',  'bg-[#EDE8DF]'),

    # Gradient variants of dark backgrounds
    ('from-[#0B0B0A]', 'from-[#F4F0E8]'),
    ('from-[#0b0b0a]', 'from-[#F4F0E8]'),
    ('from-[#1a1919]', 'from-[#FAF7F2]'),
    ('from-[#1c1b1b]', 'from-[#FAF7F2]'),
    ('to-[#0B0B0A]',   'to-[#F4F0E8]'),
    ('to-[#0b0b0a]',   'to-[#F4F0E8]'),
    ('to-[#1a1919]',   'to-[#FAF7F2]'),
    ('to-[#1c1b1b]',   'to-[#FAF7F2]'),

    # Glass input backgrounds (near-invisible white-on-dark → subtle tint on light)
    ('bg-white/[0.03]', 'bg-[#1C1814]/[0.05]'),
    ('bg-white/[0.06]', 'bg-[#1C1814]/[0.05]'),
    ('bg-white/3',      'bg-[#1C1814]/5'),
    ('bg-white/6',      'bg-[#1C1814]/5'),

    # ── Text: light → dark ─────────────────────────────────────────────────
    ('text-[#F4F1EC]', 'text-[#1C1814]'),
    ('text-[#f4f1ec]', 'text-[#1C1814]'),
    ('text-[#e5e2e1]', 'text-[#1C1814]'),
    ('text-[#E5E2E1]', 'text-[#1C1814]'),
    ('text-[#C8C0B5]', 'text-[#5C5650]'),
    ('text-[#c8c0b5]', 'text-[#5C5650]'),
    ('text-[#adaaaa]', 'text-[#78736E]'),
    ('text-[#ADAAAA]', 'text-[#78736E]'),
    ('text-[#988d9c]', 'text-[#6A6470]'),
    ('text-[#A6A19A]', 'text-[#6A6470]'),
    ('text-[#a6a19a]', 'text-[#6A6470]'),
    ('text-[#cfc2d2]', 'text-[#5C5650]'),
    # text-white catches hover:text-white, focus:text-white etc. as substrings
    ('text-white',     'text-[#1C1814]'),

    # ── Border/surface base color (purple-dark → warm dark) ─────────────────
    ('[#4c4450]', '[#1C1814]'),
    ('[#494847]', '[#1C1814]'),
]

updated = 0
for root, dirs, files in os.walk('src'):
    for fname in files:
        if not fname.endswith(('.tsx', '.ts')):
            continue
        fpath = os.path.join(root, fname)
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        new_content = content
        for old, new in REPLACEMENTS:
            new_content = new_content.replace(old, new)
        if new_content != content:
            updated += 1
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(new_content)

print(f'Updated {updated} files')
