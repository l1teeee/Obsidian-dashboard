export const AUTH_MOTION = {
  easeOut: 'power3.out',
  easeMove: 'power3.inOut',
  entry: {
    blur: 4,
    duration: 0.56,
    innerDuration: 0.42,
    innerY: 10,
    scale: 0.996,
    stagger: 0.06,
  },
  route: {
    cloneDuration: 0.68,
    formBlur: 4,
    formEnterDelay: 0.38,
    formEnterDuration: 0.56,
    panelEnterDelay: 0.32,
    panelEnterDuration: 0.48,
    panelBlur: 3,
    startBlur: 5,
    startScale: 0.992,
  },
} as const;
