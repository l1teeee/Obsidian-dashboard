import { useEffect, useState } from 'react';

interface SessionWarningModalProps {
  visible:     boolean;   // drives both enter and exit animation
  countdown:   number;
  onKeepAlive: () => void;
  onLogout:    () => void;
}

export default function SessionWarningModal({
  visible: show,
  countdown,
  onKeepAlive,
  onLogout,
}: SessionWarningModalProps) {
  const [visible, setVisible] = useState(false);
  const pct = (countdown / 30) * 100;

  // On mount: trigger enter. When show→false: trigger exit.
  useEffect(() => {
    if (show) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    } else {
      setVisible(false);
    }
  }, [show]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop — fades in */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-500 ease-out"
        style={{ opacity: visible ? 1 : 0 }}
      />

      {/* Card — fades in + slides up */}
      <div
        className="relative w-full max-w-sm bg-[#131313] border border-[#4c4450]/30 rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 ease-out"
        style={{
          opacity:   visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
        }}
      >
        {/* Top glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 bg-[#d394ff]/10 blur-[60px] rounded-full pointer-events-none" />

        <div className="relative p-8 flex flex-col items-center text-center gap-5">

          {/* Circular countdown */}
          <div className="relative w-20 h-20">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#2a2a2a" strokeWidth="5" />
              <circle
                cx="40" cy="40" r="34"
                fill="none"
                stroke={countdown <= 10 ? '#ff6b6b' : '#d394ff'}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - pct / 100)}`}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-black font-mono tabular-nums transition-colors duration-300 ${
                countdown <= 10 ? 'text-[#ff6b6b]' : 'text-white'
              }`}>
                {countdown}
              </span>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-1.5">
            <h2 className="text-lg font-extrabold text-white tracking-tight">Still there?</h2>
            <p className="text-sm text-[#988d9c] leading-relaxed">
              Your session will expire due to inactivity.
              <br />
              Keep it active or you'll be signed out.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 w-full pt-1">
            <button
              onClick={onKeepAlive}
              className="w-full py-3 rounded-2xl bg-[#d394ff] text-[#2f004d] text-sm font-extrabold hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_24px_rgba(211,148,255,0.3)]"
            >
              Keep session active
            </button>
            <button
              onClick={onLogout}
              className="w-full py-2.5 rounded-2xl text-[#988d9c] text-sm font-medium hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
