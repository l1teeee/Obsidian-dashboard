import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { respondToInvite } from '../services/admin.service';

type Stage = 'confirm' | 'loading' | 'accepted' | 'rejected' | 'error';

const CAPABILITIES = [
  { icon: 'monitoring',           label: 'Platform Overview'  },
  { icon: 'group',                label: 'User Management'    },
  { icon: 'workspaces',           label: 'Workspace Control'  },
  { icon: 'article',              label: 'Post Moderation'    },
  { icon: 'admin_panel_settings', label: 'Admin Management'   },
];

export default function AdminInvite() {
  const [params]    = useSearchParams();
  const navigate    = useNavigate();
  const token       = params.get('token') ?? '';
  const action      = params.get('action') as 'accept' | 'reject' | null;

  const [stage,     setStage]     = useState<Stage>('confirm');
  const [errorMsg,  setErrorMsg]  = useState('');
  const [pending,   setPending]   = useState(false);

  // If URL already has action=accept|reject, auto-trigger on mount
  useEffect(() => {
    if (!token) { setStage('error'); setErrorMsg('Invalid invitation link.'); return; }
    if (action === 'accept' || action === 'reject') {
      void respond(action);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function respond(act: 'accept' | 'reject') {
    setPending(true);
    setStage('loading');
    try {
      const result = await respondToInvite(token, act);
      setStage(result.status === 'accepted' ? 'accepted' : 'rejected');
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Something went wrong.');
      setStage('error');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-2xl font-extrabold text-white tracking-tight font-headline">Vielink</span>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#f87171]" />
            <span className="text-[#f87171] text-xs uppercase tracking-widest font-bold">Admin Invitation</span>
          </div>
        </div>

        <div className="bg-[#141414] border border-[#4c4450]/15 rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">

          {/* Loading */}
          {stage === 'loading' && (
            <div className="p-10 flex flex-col items-center gap-4 text-center">
              <span className="material-symbols-outlined text-[#d394ff] text-[48px] animate-spin">progress_activity</span>
              <p className="text-white font-semibold">Processing your response…</p>
            </div>
          )}

          {/* Confirm (no action in URL yet) */}
          {stage === 'confirm' && (
            <>
              <div className="px-8 py-7 border-b border-[#4c4450]/10">
                <div className="w-12 h-12 rounded-2xl bg-[#f87171]/10 border border-[#f87171]/20 flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-[#f87171]" style={{ fontSize: 24, fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
                </div>
                <h1 className="font-headline text-2xl font-extrabold text-white tracking-tight">Admin Invitation</h1>
                <p className="text-[#988d9c] text-sm mt-2">You have been invited to become an administrator on the Vielink platform.</p>
              </div>

              <div className="px-8 py-6 border-b border-[#4c4450]/10">
                <p className="text-[10px] text-[#988d9c] uppercase tracking-widest font-semibold mb-3">You will have access to</p>
                <div className="space-y-2.5">
                  {CAPABILITIES.map(cap => (
                    <div key={cap.label} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#f87171]/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#f87171] text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>{cap.icon}</span>
                      </div>
                      <span className="text-sm text-[#cfc2d2]">{cap.label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-[#4c4450] mt-4 italic">
                  This invitation expires in 72 hours. Admin access gives significant control — only accept if you authorized this.
                </p>
              </div>

              <div className="px-8 py-6 flex flex-col gap-3">
                <button
                  onClick={() => { void respond('accept'); }}
                  disabled={pending}
                  className="w-full py-3.5 rounded-xl bg-[#f87171] text-white font-bold text-sm hover:bg-[#fca5a5] active:scale-95 transition-all disabled:opacity-50"
                >
                  Accept Invitation
                </button>
                <button
                  onClick={() => { void respond('reject'); }}
                  disabled={pending}
                  className="w-full py-3.5 rounded-xl border border-[#4c4450]/20 text-sm font-semibold text-[#988d9c] hover:text-white hover:bg-[#201f1f] transition-all disabled:opacity-50"
                >
                  Decline
                </button>
              </div>
            </>
          )}

          {/* Accepted */}
          {stage === 'accepted' && (
            <div className="p-10 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#c5d247]/10 border border-[#c5d247]/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#c5d247]" style={{ fontSize: 32, fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
              <div>
                <h2 className="font-headline text-xl font-extrabold text-white">You are now an admin</h2>
                <p className="text-[#988d9c] text-sm mt-2">Your admin access has been activated. You can now access the admin panel.</p>
              </div>
              <button
                onClick={() => navigate('/admin')}
                className="mt-2 px-8 py-3 rounded-xl bg-[#c5d247] text-[#1a1d00] font-bold text-sm hover:bg-[#d4e24f] active:scale-95 transition-all"
              >
                Go to Admin Panel
              </button>
            </div>
          )}

          {/* Rejected */}
          {stage === 'rejected' && (
            <div className="p-10 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#4c4450]/20 border border-[#4c4450]/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#988d9c]" style={{ fontSize: 32, fontVariationSettings: "'FILL' 1" }}>cancel</span>
              </div>
              <div>
                <h2 className="font-headline text-xl font-extrabold text-white">Invitation declined</h2>
                <p className="text-[#988d9c] text-sm mt-2">You have declined the admin invitation. Your account remains unchanged.</p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-2 px-8 py-3 rounded-xl border border-[#4c4450]/20 text-sm font-semibold text-[#988d9c] hover:text-white hover:bg-[#201f1f] transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {/* Error */}
          {stage === 'error' && (
            <div className="p-10 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#f87171]/10 border border-[#f87171]/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#f87171]" style={{ fontSize: 32, fontVariationSettings: "'FILL' 1" }}>error</span>
              </div>
              <div>
                <h2 className="font-headline text-xl font-extrabold text-white">Link invalid or expired</h2>
                <p className="text-[#988d9c] text-sm mt-2">{errorMsg || 'This invitation link is no longer valid.'}</p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="mt-2 px-8 py-3 rounded-xl border border-[#4c4450]/20 text-sm font-semibold text-[#988d9c] hover:text-white hover:bg-[#201f1f] transition-all"
              >
                Go to Home
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
