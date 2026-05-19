# Component Audit — Minimal Editorial Design System Compliance
**Date:** 2026-05-18  
**Status:** CRITICAL ISSUES — 13 Files with Design Violations

---

## Summary Table

| # | File Path | Line | Issue | Fix |
|---|-----------|------|-------|-----|
| 1 | `src/pages/Calendar.tsx` | 24 | `text-[#2f004d]` on brand button | → `text-white` |
| 2 | `src/components/calendar/CalendarNav.tsx` | 47 | `text-[#2f004d]` active indicator | → `text-white` |
| 3 | `src/components/calendar/DayPanel.tsx` | 28 | `text-[#2f004d]` button text | → `text-white` |
| 4 | `src/components/calendar/MonthView.tsx` | 70 | `text-[#2f004d]` today circle | → `text-white` |
| 5 | `src/components/calendar/WeekView.tsx` | 36 | `text-[#2f004d]` today circle | → `text-white` |
| 6 | `src/components/composer/SchedulePicker.tsx` | 78 | `text-[#2f004d]` active button | → `text-white` |
| 7 | `src/components/composer/SchedulePicker.tsx` | 94 | `text-[#2f004d]` active button | → `text-white` |
| 8 | `src/components/profile/AvatarCropModal.tsx` | 170 | `text-[#2f004d]` + weak hover | → `text-white` + `hover:bg-[#A53F28]` |
| 9 | `src/components/profile/ChangePasswordModal.tsx` | 157 | `text-[#2f004d]` + weak hover | → `text-white` + `hover:bg-[#A53F28]` |
| 10 | `src/components/profile/EditProfileModal.tsx` | 145 | `text-[#2f004d]` + weak hover | → `text-white` + `hover:bg-[#A53F28]` |
| 11 | `src/components/shared/DateTimePicker.tsx` | 79 | `text-[#2f004d]` date picker | → `text-white` |
| 12 | `src/components/shared/ConfirmModal.tsx` | 20-25 | 4x color variants off-brand | See detail below |
| 13 | `src/components/posts/PostsTable.tsx` | 23, 29-30 | `#ffd166` wrong context | → `#A8362A` error color |
| 14 | `src/pages/PostDetail.tsx` | 211 | `#ffd166` deactivate action | → `#B7841E` warning color |

---

## Issue Detail

### Issue 1: Wrong Button Text Color (11 instances)
`bg-[#C8553A] text-[#2f004d]` → `bg-[#C8553A] text-white`  
Dark purple text on terracotta = poor contrast + brand violation.

### Issue 2: ConfirmModal Broken Variants
```
danger variant:
  iconColor: '#ffb4ab' → '#A8362A'
  btn: 'bg-[#ffb4ab] text-[#2d0000]' → 'bg-[#A8362A] text-white hover:bg-[#8a2820]'

warning variant:
  iconColor: '#ffd166' → '#B7841E'
  btn: 'bg-[#ffd166] text-[#2d1800]' → 'bg-[#B7841E] text-white hover:bg-[#9a6d18]'

primary hover:
  hover:bg-[#e3b5ff] → hover:bg-[#A53F28]

success hover:
  hover:bg-[#d4e25a] → hover:bg-[#3d6239]
```

### Issue 3: Semantic Color Misuse
- PostsTable "Can't publish" = error state → use `#A8362A` not `#ffd166`
- PostDetail "Deactivate" = warning state → use `#B7841E` not `#ffd166`

### Issue 4: Missing Hover States on Modal Save Buttons
Add `hover:bg-[#A53F28]` to save buttons in AvatarCropModal, ChangePasswordModal, EditProfileModal.

---

## Design Tokens Reference
```
Primary:         #C8553A
On Primary:      #FFFFFF
Inverse Primary: #A53F28 (hover)
Error:           #A8362A
Warning:         #B7841E
Success:         #4F7A4A
Text Primary:    #15140F
Text Muted:      #6B655B
```
