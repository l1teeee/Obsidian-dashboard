import Modal from './Modal';

const CAPABILITIES = [
  { icon: 'monitoring',           label: 'Platform Overview',  desc: 'Estadísticas en tiempo real, gráficas y rankings de workspaces.' },
  { icon: 'group',                label: 'User Management',    desc: 'Busca, activa y desactiva cuentas de cualquier usuario.' },
  { icon: 'workspaces',           label: 'Workspace Control',  desc: 'Inspecciona y gestiona el estado de los workspaces.' },
  { icon: 'article',              label: 'Post Moderation',    desc: 'Revisa, activa o desactiva posts de todos los usuarios.' },
  { icon: 'admin_panel_settings', label: 'Admin Management',   desc: 'Añade o elimina administradores de la plataforma.' },
];

const STORAGE_KEY = (userId: string) => `admin_welcomed_${userId}`;

export function shouldShowAdminWelcome(userId: string): boolean {
  return !localStorage.getItem(STORAGE_KEY(userId));
}

export function markAdminWelcomeSeen(userId: string): void {
  localStorage.setItem(STORAGE_KEY(userId), '1');
}

interface Props {
  userId: string;
  onClose: () => void;
}

export default function AdminWelcomeModal({ userId, onClose }: Props) {
  const handleClose = () => {
    markAdminWelcomeSeen(userId);
    onClose();
  };

  return (
    <Modal open={true} onClose={handleClose} maxWidth="max-w-md">
      <div className="p-8">

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#d394ff]/10 border border-[#d394ff]/20 flex items-center justify-center mb-6">
          <span
            className="material-symbols-outlined text-[#d394ff]"
            style={{ fontSize: 28, fontVariationSettings: "'FILL' 1" }}
          >
            shield
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-headline font-extrabold tracking-tight text-white mb-1">
          Ahora eres administrador
        </h2>
        <p className="text-sm text-[#988d9c] mb-6">
          Tu acceso de administrador en Vielinks está activo. Aquí tienes lo que puedes hacer:
        </p>

        {/* Capabilities */}
        <div className="space-y-2.5 mb-7">
          {CAPABILITIES.map(cap => (
            <div key={cap.label} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#d394ff]/10 border border-[#d394ff]/15 flex items-center justify-center shrink-0 mt-0.5">
                <span
                  className="material-symbols-outlined text-[#d394ff]"
                  style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}
                >
                  {cap.icon}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight font-headline">{cap.label}</p>
                <p className="text-xs text-[#988d9c] mt-0.5 leading-relaxed">{cap.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tip */}
        <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-[#d394ff]/5 border border-[#d394ff]/10 mb-6">
          <span className="material-symbols-outlined text-[#d394ff] shrink-0 mt-0.5" style={{ fontSize: 14 }}>info</span>
          <p className="text-xs text-[#988d9c] leading-relaxed">
            Puedes acceder al panel de admin desde la sección <strong className="text-[#d394ff]">Admin</strong> en el sidebar izquierdo.
          </p>
        </div>

        <button
          onClick={handleClose}
          className="w-full py-3.5 rounded-xl bg-[#d394ff] text-[#131313] font-bold text-sm hover:bg-[#e0a8ff] active:scale-[0.98] transition-all"
        >
          Entendido
        </button>

      </div>
    </Modal>
  );
}
