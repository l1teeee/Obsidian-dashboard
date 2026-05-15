import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'fb_token_expired_dismissed';

interface Props {
  onClose: () => void;
}

export default function FacebookTokenModal({ onClose }: Props) {
  const [visible,   setVisible]   = useState(false);
  const [noRepeat,  setNoRepeat]  = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    if (noRepeat) localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4 transition-all duration-300 ${
        visible ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent pointer-events-none'
      }`}
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className={`w-full max-w-sm bg-[#FBF8F2] border border-[#15140F]/20 rounded-3xl p-6 shadow-[0_24px_80px_rgba(0,0,0,0.6)] transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Icon + title */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#1877F2]/15 border border-[#1877F2]/25 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#1877F2]">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="text-[#15140F] font-bold text-sm">Facebook token expired</h3>
            <p className="text-[#6B655B] text-xs mt-0.5 leading-relaxed">
              Your Facebook connection has expired. Reconnect to keep syncing metrics and posts.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Link
            to="/platforms"
            onClick={handleClose}
            className="w-full py-2.5 rounded-xl bg-[#1877F2]/15 text-[#1877F2] text-sm font-bold hover:bg-[#1877F2]/25 transition-colors border border-[#1877F2]/20 text-center"
          >
            Reconnect Facebook
          </Link>
          <button
            onClick={handleClose}
            className="w-full py-2 rounded-xl text-[#6B655B] text-xs hover:text-[#15140F] transition-colors"
          >
            Dismiss
          </button>
        </div>

        {/* Don't show again */}
        <label className="flex items-center gap-2 mt-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={noRepeat}
            onChange={e => setNoRepeat(e.target.checked)}
            className="w-3.5 h-3.5 rounded accent-[#C8553A] cursor-pointer"
          />
          <span className="text-[11px] text-[#15140F] group-hover:text-[#6B655B] transition-colors select-none">
            Don't show this again
          </span>
        </label>
      </div>
    </div>
  );
}

export { STORAGE_KEY as FB_TOKEN_DISMISSED_KEY };
