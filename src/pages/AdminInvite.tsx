import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminInvite() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/dashboard', { replace: true }), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F6F2EA] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-[#FBF8F2] border border-border rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.12)] p-10">
          <div className="w-16 h-16 rounded-2xl bg-[#C8553A]/10 border border-[#C8553A]/20 flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-[#C8553A]" style={{ fontSize: 32, fontVariationSettings: "'FILL' 1" }}>shield</span>
          </div>
          <h1 className="font-headline text-2xl font-extrabold text-[#15140F] tracking-tight mb-2">
            Tu acceso de admin está activo
          </h1>
          <p className="text-[#6B655B] text-sm mb-6">
            Inicia sesión en tu cuenta para ver el panel de administrador. Serás redirigido al dashboard en un momento.
          </p>
          <button
            onClick={() => navigate('/dashboard', { replace: true })}
            className="px-8 py-3 rounded-xl bg-[#C8553A] text-white font-bold text-sm hover:bg-[#A53F28] active:scale-95 transition-all"
          >
            Ir al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
