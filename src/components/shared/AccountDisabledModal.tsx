import { useEffect, useState } from 'react';

interface Props {
  onClose: () => void;
}

export default function AccountDisabledModal({ onClose }: Props) {
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
        className={`w-full max-w-sm bg-[#FBF8F2] border border-[#15140F]/20 rounded-3xl p-7 shadow-[0_24px_80px_rgba(0,0,0,0.7)] transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-[#ffd166]/10 border border-[#ffd166]/20 flex items-center justify-center mb-5">
          <span
            className="material-symbols-outlined text-[#ffd166]"
            style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}
          >
            block
          </span>
        </div>

        <h2 className="text-[#15140F] font-bold text-lg mb-2">Account disabled</h2>
        <p className="text-[#6B655B] text-sm mb-6 leading-relaxed">
          Your account has been disabled. Please contact support if you think this is a mistake.
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#ffd166]/15 text-[#ffd166] text-sm font-bold hover:bg-[#ffd166]/25 transition-colors border border-[#ffd166]/20"
        >
          Back to login
        </button>
      </div>
    </div>
  );
}
