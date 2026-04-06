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
        className={`w-full max-w-sm bg-[#1a1919] border border-[#4c4450]/20 rounded-3xl p-7 shadow-[0_24px_80px_rgba(0,0,0,0.7)] transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-[#ffd166]/10 border border-[#ffd166]/20 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-[#ffd166]" style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}>
            lock_person
          </span>
        </div>

        <h2 className="text-white font-bold text-lg mb-2">Account already in use</h2>
        <p className="text-[#988d9c] text-sm mb-6 leading-relaxed">
          Someone else is signed in to this account. Sign them out to continue.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#ffd166] text-[#3d2a00] text-sm font-bold hover:bg-[#ffe08a] transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing out…' : 'Sign out & continue'}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-[#988d9c] text-sm hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
