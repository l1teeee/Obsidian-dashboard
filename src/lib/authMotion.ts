export const AUTH_MOTION = {
  easeOut: 'power2.out',
  easeMove: 'linear',
  entry: {
    blur: 2,
    duration: 0.48,
    innerDuration: 0.36,
    innerY: 6,
    scale: 0.998,
    stagger: 0.04,
  },
  route: {
    cloneDuration: 0.56,
    formBlur: 2,
    formEnterDelay: 0.24,
    formEnterDuration: 0.42,
    panelEnterDelay: 0.2,
    panelEnterDuration: 0.42,
    panelBlur: 2,
    startBlur: 2,
    startScale: 0.998,
  },
} as const;
