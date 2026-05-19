import { useEffect, useState } from 'react';

interface Props {
  onConfirm: () => void;
  onCancel:  () => void;
  loading:   boolean;
}

export default function SessionConflictModal({ onConfirm, onCancel, loading }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${visible ? 'bg-black/70 backdrop-blur-sm' : 'bg-transparent'}`}
    >
      <div
        className={`w-full max-w-sm bg-[#FBF8F2] border border-[#15140F]/20 rounded-3xl p-7 shadow-[0_24px_80px_rgba(0,0,0,0.7)] transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-[#B7841E]/10 border border-[#B7841E]/20 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-[#B7841E]" style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}>
            lock_person
          </span>
        </div>

        <h2 className="text-[#15140F] font-bold text-lg mb-2">Account already in use</h2>
        <p className="text-[#6B655B] text-sm mb-6 leading-relaxed">
          Someone else is signed in to this account. Sign them out to continue.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#B7841E] text-white text-sm font-bold hover:bg-[#9a6d18] transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing out…' : 'Sign out & continue'}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-[#6B655B] text-sm hover:text-[#15140F] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
