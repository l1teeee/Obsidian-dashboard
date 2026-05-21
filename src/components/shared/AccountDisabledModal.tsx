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
        className={`w-full max-w-sm bg-[#FFFFFF] border border-[#0F172A]/20 rounded-3xl p-7 shadow-[0_24px_80px_rgba(0,0,0,0.7)] transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-[#B45309]/10 border border-[#B45309]/20 flex items-center justify-center mb-5">
          <span
            className="material-symbols-outlined text-[#B45309]"
            style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}
          >
            block
          </span>
        </div>

        <h2 className="text-[#0F172A] font-bold text-lg mb-2">Account disabled</h2>
        <p className="text-[#64748B] text-sm mb-6 leading-relaxed">
          Your account has been disabled. Please contact support if you think this is a mistake.
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#B45309]/15 text-[#B45309] text-sm font-bold hover:bg-[#B45309]/25 transition-colors border border-[#B45309]/20"
        >
          Back to login
        </button>
      </div>
    </div>
  );
}
