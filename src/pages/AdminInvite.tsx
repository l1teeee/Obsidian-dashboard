import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminInvite() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/dashboard', { replace: true }), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-[#FFFFFF] border border-border rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.12)] p-10">
          <div className="w-16 h-16 rounded-2xl bg-[#111827]/10 border border-[#111827]/20 flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-[#111827]" style={{ fontSize: 32, fontVariationSettings: "'FILL' 1" }}>shield</span>
          </div>
          <h1 className="font-headline text-2xl font-extrabold text-[#0F172A] tracking-tight mb-2">
            Tu acceso de admin está activo
          </h1>
          <p className="text-[#64748B] text-sm mb-6">
            Inicia sesión en tu cuenta para ver el panel de administrador. Serás redirigido al dashboard en un momento.
          </p>
          <button
            onClick={() => navigate('/dashboard', { replace: true })}
            className="px-8 py-3 rounded-xl bg-[#111827] text-white font-bold text-sm hover:bg-[#0B1220] active:scale-95 transition-all"
          >
            Ir al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
