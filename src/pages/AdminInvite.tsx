import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminInvite() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/dashboard', { replace: true }), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-[#141414] border border-[#1C1814]/15 rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)] p-10">
          <div className="w-16 h-16 rounded-2xl bg-[#7DD3C7]/10 border border-[#7DD3C7]/20 flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-[#7DD3C7]" style={{ fontSize: 32, fontVariationSettings: "'FILL' 1" }}>shield</span>
          </div>
          <h1 className="font-headline text-2xl font-extrabold text-[#1C1814] tracking-tight mb-2">
            Tu acceso de admin está activo
          </h1>
          <p className="text-[#6A6470] text-sm mb-6">
            Inicia sesión en tu cuenta para ver el panel de administrador. Serás redirigido al dashboard en un momento.
          </p>
          <button
            onClick={() => navigate('/dashboard', { replace: true })}
            className="px-8 py-3 rounded-xl bg-[#7DD3C7] text-[#131313] font-bold text-sm hover:bg-[#e0a8ff] active:scale-95 transition-all"
          >
            Ir al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
