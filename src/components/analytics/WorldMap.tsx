import { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

/* Audience share by ISO numeric country code */
const AUDIENCE: Record<string, { pct: number; name: string }> = {
  '840': { pct: 35, name: 'United States'  },
  '484': { pct: 12, name: 'Mexico'         },
  '826': { pct:  8, name: 'United Kingdom' },
  '124': { pct:  7, name: 'Canada'         },
  '076': { pct:  6, name: 'Brazil'         },
  '036': { pct:  5, name: 'Australia'      },
  '276': { pct:  4, name: 'Germany'        },
  '250': { pct:  3, name: 'France'         },
  '392': { pct:  3, name: 'Japan'          },
  '724': { pct:  2, name: 'Spain'          },
  '356': { pct:  2, name: 'India'          },
  '528': { pct:  1, name: 'Netherlands'    },
};

function pctToColor(pct: number): string {
  if (pct >= 25) return '#d394ff';
  if (pct >= 10) return '#b066e8';
  if (pct >=  5) return '#7c3aad';
  if (pct >=  2) return '#4a2070';
  if (pct >=  1) return '#2e1548';
  return '#1e1822';
}

interface Tooltip { name: string; pct: number; x: number; y: number }

export default function WorldMap() {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const topCountries = Object.values(AUDIENCE)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);

  return (
    <div data-chart className="glass-card rounded-3xl border border-[#4c4450]/5 p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-headline font-bold tracking-tight text-white">Audience Geography</h3>
          <p className="text-sm text-[#988d9c]">Reach distribution by country</p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-2 mt-1">
          <div className="flex gap-1">
            {['#1e1822', '#2e1548', '#4a2070', '#7c3aad', '#b066e8', '#d394ff'].map(c => (
              <div key={c} className="w-4 h-2 rounded-sm" style={{ background: c }} />
            ))}
          </div>
          <div className="flex justify-between text-[9px] font-mono text-[#4c4450]">
            <span>Low</span>
            <span className="ml-1">High</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative rounded-2xl overflow-hidden" style={{ background: '#0e0e0e' }}>
        <ComposableMap
          projectionConfig={{ scale: 147, center: [0, 10] }}
          style={{ width: '100%', height: 'auto' }}
        >
          <ZoomableGroup zoom={1} minZoom={1} maxZoom={1}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const id   = geo.id as string;
                  const data = AUDIENCE[id];
                  const fill = data ? pctToColor(data.pct) : '#1a1820';
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke="#0e0e0e"
                      strokeWidth={0.5}
                      style={{
                        default:  { outline: 'none', transition: 'fill 0.15s' },
                        hover:    { outline: 'none', fill: data ? '#e3b5ff' : '#2a2830', cursor: data ? 'pointer' : 'default' },
                        pressed:  { outline: 'none' },
                      }}
                      onMouseEnter={e => {
                        if (!data) return;
                        setTooltip({ name: data.name, pct: data.pct, x: e.clientX, y: e.clientY });
                      }}
                      onMouseMove={e => {
                        if (!data) return;
                        setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null);
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="fixed z-50 pointer-events-none bg-[#1c1b1b] border border-[#4c4450]/20 rounded-xl px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
            style={{ left: tooltip.x + 12, top: tooltip.y - 40 }}
          >
            <p className="text-xs font-bold text-white">{tooltip.name}</p>
            <p className="text-[10px] text-[#d394ff] font-mono">{tooltip.pct}% of audience</p>
          </div>
        )}
      </div>

      {/* Top countries */}
      <div className="mt-5 grid grid-cols-5 gap-3">
        {topCountries.map(({ name, pct }) => (
          <div key={name} className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-[#988d9c] truncate font-medium">{name.split(' ')[0]}</span>
              <span className="text-[9px] font-mono text-[#d394ff]">{pct}%</span>
            </div>
            <div className="h-1 rounded-full bg-[#2a2a2a]">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, background: pctToColor(pct) }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
