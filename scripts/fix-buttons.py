import os, re

files_changed = 0
for root, dirs, files in os.walk('src'):
    for fname in files:
        if not fname.endswith(('.tsx', '.ts')):
            continue
        fpath = os.path.join(root, fname)
        with open(fpath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        new_lines = []
        changed = False
        for line in lines:
            if 'bg-[#F4F1EC]' in line:
                line = line.replace('bg-[#F4F1EC]', 'bg-[#1C1814]')
                line = line.replace('text-[#0B0B0A]', 'text-[#F4F0E8]')
                line = line.replace('hover:bg-[#2A2420]', 'hover:bg-[#2A2520]')
                line = line.replace('hover:bg-white', 'hover:bg-[#2A2520]')
                line = re.sub(r'rgba\(244,241,236,[^)]+\)', 'rgba(125,211,199,0.28)', line)
                changed = True
            new_lines.append(line)
        if changed:
            files_changed += 1
            with open(fpath, 'w', encoding='utf-8') as f:
                f.writelines(new_lines)

print(f'Fixed {files_changed} files')
