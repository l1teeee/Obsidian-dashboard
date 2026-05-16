import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';

const IconArrow = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

export interface WorkspaceFeature {
  icon: ReactNode;
  title: string;
  body: string;
  route?: string | null;
  linkLabel?: string;
}

export function WorkspaceFeatureGrid({ features }: { features: WorkspaceFeature[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden">
      {features.map(f => (
        <div
          key={f.title}
          data-f="card"
          className="group bg-[#F6F2EA] p-8 flex flex-col gap-3 transition-colors duration-200 ease-out hover:bg-[#C8553A]"
        >
          <div className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-[#EFE9DC] text-[#15140F] mb-2 transition-colors duration-200 ease-out group-hover:bg-white/15 group-hover:text-white">
            {f.icon}
          </div>
          <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-[#15140F] transition-colors duration-200 ease-out group-hover:text-white">
            {f.title}
          </h3>
          <p className="text-[14px] leading-[1.6] text-[#6B655B] transition-colors duration-200 ease-out group-hover:text-[#F6F2EA]">
            {f.body}
          </p>
          {f.route && (
            <Link
              to={f.route}
              onClick={e => e.stopPropagation()}
              className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium tracking-wide text-[#A39B8B] transition-[color,opacity,transform] duration-150 ease-out group-hover:text-white/50 hover:text-white/80! active:scale-[0.96] active:opacity-70 w-fit"
            >
              {f.linkLabel ?? 'Learn more'}
              <IconArrow className="w-2.5 h-2.5" />
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
