import { useEffect, useRef, useState } from 'react';
import type { ActiveSession } from '../../services/auth.service';

interface Props {
  sessions:  ActiveSession[];
  onConfirm: () => void;
  onCancel:  () => void;
  loading:   boolean;
}

function parseDevice(info: string | null): string {
  if (!info) return 'Unknown device';
  if (/iPhone|iPad/i.test(info))  return 'iPhone / iPad';
  if (/Android/i.test(info))      return 'Android device';
  if (/Windows/i.test(info))      return 'Windows PC';
  if (/Mac/i.test(info))          return 'Mac';
  if (/Linux/i.test(info))        return 'Linux';
  return 'Another device';
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function SessionConflictModal({ sessions, onConfirm, onCancel, loading }: Props) {
  const overlayRef  = useRef<HTMLDivElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${visible ? 'bg-black/70 backdrop-blur-sm' : 'bg-transparent'}`}
    >
      <div
        ref={cardRef}
        className={`w-full max-w-sm bg-[#1a1919] border border-[#4c4450]/20 rounded-3xl p-7 shadow-[0_24px_80px_rgba(0,0,0,0.7)] transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-[#ffd166]/10 border border-[#ffd166]/20 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-[#ffd166]" style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}>
            devices
          </span>
        </div>

        <h2 className="text-white font-bold text-lg mb-1">Account already in use</h2>
        <p className="text-[#988d9c] text-sm mb-5">
          Your account is active on {sessions.length === 1 ? 'another device' : `${sessions.length} other devices`}. Sign them out to continue.
        </p>

        {/* Session list */}
        <div className="space-y-2 mb-6">
          {sessions.map(s => (
            <div key={s.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#201f1f] border border-[#4c4450]/10">
              <span className="material-symbols-outlined text-[#988d9c]" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>
                computer
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium">{parseDevice(s.device_info)}</p>
                <p className="text-[10px] text-[#988d9c]">Session started {timeAgo(s.created_at)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#ffd166] text-[#3d2a00] text-sm font-bold hover:bg-[#ffe08a] transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing out…' : 'Sign out other devices & continue'}
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
