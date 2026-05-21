import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useWorkspace } from '../contexts/WorkspaceContext';

const AUTH_PATHS = ['/login', '/register'];

export default function CreateWorkspace() {
  const [name,    setName]    = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const { createWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const location = useLocation();
  const cardRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fromAuth = AUTH_PATHS.includes((location.state as { from?: string } | null)?.from ?? '');
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: fromAuth ? 1.4 : 0 }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    setLoading(true);
    try {
      await createWorkspace(name.trim());
      const hasPendingPlan = !!sessionStorage.getItem('pending_plan');
      navigate(hasPendingPlan ? '/checkout' : '/dashboard');
    } catch {
      setError('Could not create workspace. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-6">
      <div ref={cardRef} className="w-full max-w-md" style={{ opacity: 0 }}>

        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-10">
          <span className="w-2.5 h-2.5 rounded-full bg-[#111827] shadow-[0_0_10px_rgba(14,159,110,0.5)]" />
          <span className="text-xl font-headline font-bold tracking-tight text-[#0F172A]">Vielinks</span>
        </div>

        <div className="bg-[#FFFFFF] rounded-3xl border border-border p-8 shadow-[0_30px_80px_rgba(0,0,0,0.10)]">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111827]/10 border border-[#111827]/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#111827]" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#111827]">Getting Started</span>
            </div>
            <h1 className="text-3xl font-headline font-extrabold tracking-tight text-[#0F172A] mb-2">
              Create your workspace
            </h1>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Your workspace is where you manage all your social platforms, posts, and analytics. You can create more later.
            </p>
          </div>

          <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-2">
                Workspace Name
              </label>
              <input
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. My Brand Studio"
                maxLength={48}
                disabled={loading}
                className="w-full bg-white border border-[#0F172A]/20 rounded-xl px-4 py-3 text-[#0F172A] text-sm placeholder:text-[#94A3B8]/50 focus:outline-none focus:border-[#111827]/50 focus:ring-1 focus:ring-[#0E9F6E]/20 transition-all disabled:opacity-50"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-[0.8125rem] text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="w-full py-3 rounded-xl bg-[#111827] text-white font-bold text-sm tracking-wide hover:bg-[#0B1220] disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_0_24px_rgba(14,159,110,0.25)]"
            >
              {loading ? 'Creating…' : 'Create Workspace'}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-[#64748B] mt-6 font-mono">
          You can add more workspaces anytime from Settings.
        </p>
      </div>
    </div>
  );
}
