import { useCallback, useEffect, useRef, useState } from 'react';

const IDLE_MS      = 600_000;  // 10 minutes idle → show warning
const COUNTDOWN_S  = 60;       // 60 seconds to respond before logout

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'wheel',
];

interface UseInactivityTimerOptions {
  enabled:  boolean;
  onLogout: () => void;
}

export function useInactivityTimer({ enabled, onLogout }: UseInactivityTimerOptions) {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown,   setCountdown]   = useState(COUNTDOWN_S);

  const idleTimerRef      = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onLogoutRef       = useRef(onLogout);
  useEffect(() => { onLogoutRef.current = onLogout; }, [onLogout]);

  const clearCountdown = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  const startCountdown = useCallback(() => {
    setCountdown(COUNTDOWN_S);
    clearCountdown();
    countdownTimerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearCountdown();
          onLogoutRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearCountdown]);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      startCountdown();
    }, IDLE_MS);
  }, [startCountdown]);

  // Keep session alive — user clicked the button
  const keepAlive = useCallback(() => {
    setShowWarning(false);
    clearCountdown();
    setCountdown(COUNTDOWN_S);
    resetIdleTimer();
  }, [clearCountdown, resetIdleTimer]);

  // When session ends (logout), clear everything immediately
  useEffect(() => {
    if (enabled) return;
    setShowWarning(false);
    setCountdown(COUNTDOWN_S);
    clearCountdown();
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  }, [enabled, clearCountdown]);

  useEffect(() => {
    if (!enabled) return;

    const handleActivity = () => {
      if (!showWarning) resetIdleTimer();
    };

    ACTIVITY_EVENTS.forEach(ev => window.addEventListener(ev, handleActivity, { passive: true }));
    resetIdleTimer();

    return () => {
      ACTIVITY_EVENTS.forEach(ev => window.removeEventListener(ev, handleActivity));
      if (idleTimerRef.current)      clearTimeout(idleTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { showWarning, countdown, keepAlive };
}
