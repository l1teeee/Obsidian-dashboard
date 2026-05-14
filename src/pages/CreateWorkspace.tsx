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
    <div className="min-h-screen bg-[#131313] flex items-center justify-center p-6">
      <div ref={cardRef} className="w-full max-w-md" style={{ opacity: 0 }}>

        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-10">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7DD3C7] shadow-[0_0_10px_rgba(125,211,199,0.8)]" />
          <span className="text-xl font-headline font-bold tracking-tight text-[#1C1814]">Vielinks</span>
        </div>

        <div className="glass-card rounded-3xl border border-[#1C1814]/20 p-8 shadow-2xl shadow-black/60">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7DD3C7]/10 border border-[#7DD3C7]/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3C7]" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#7DD3C7]">Getting Started</span>
            </div>
            <h1 className="text-3xl font-headline font-extrabold tracking-tight text-[#1C1814] mb-2">
              Create your workspace
            </h1>
            <p className="text-[#6A6470] text-sm leading-relaxed">
              Your workspace is where you manage all your social platforms, posts, and analytics. You can create more later.
            </p>
          </div>

          <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6A6470] mb-2">
                Workspace Name
              </label>
              <input
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. My Brand Studio"
                maxLength={48}
                disabled={loading}
                className="w-full bg-[#FAF7F2] border border-[#1C1814]/30 rounded-xl px-4 py-3 text-[#1C1814] text-sm placeholder:text-[#1C1814] focus:outline-none focus:border-[#7DD3C7]/50 focus:ring-1 focus:ring-[#7DD3C7]/20 transition-all disabled:opacity-50"
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
              className="w-full py-3 rounded-xl bg-[#7DD3C7] text-[#131313] font-bold text-sm tracking-wide hover:bg-[#e0a8ff] disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_0_24px_rgba(125,211,199,0.3)]"
            >
              {loading ? 'Creating…' : 'Create Workspace'}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-[#1C1814] mt-6 font-mono">
          You can add more workspaces anytime from Settings.
        </p>
      </div>
    </div>
  );
}
