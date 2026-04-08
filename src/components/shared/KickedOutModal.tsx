import { useEffect, useState } from 'react';

interface Props {
  onClose: () => void;
}

export default function KickedOutModal({ onClose }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[300] flex items-center justify-center p-4 transition-all duration-300 ${
        visible ? 'bg-black/70 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div
        className={`w-full max-w-sm bg-[#1a1919] border border-[#4c4450]/20 rounded-3xl p-7 shadow-[0_24px_80px_rgba(0,0,0,0.7)] transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 flex items-center justify-center mb-5">
          <span
            className="material-symbols-outlined text-[#ff6b6b]"
            style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}
          >
            devices
          </span>
        </div>

        <h2 className="text-white font-bold text-lg mb-2">Signed out remotely</h2>
        <p className="text-[#988d9c] text-sm mb-6 leading-relaxed">
          Your account was accessed from another device. You've been signed out for security.
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#ff6b6b]/15 text-[#ff6b6b] text-sm font-bold hover:bg-[#ff6b6b]/25 transition-colors border border-[#ff6b6b]/20"
        >
          Sign in again
        </button>
      </div>
    </div>
  );
}
