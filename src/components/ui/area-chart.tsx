// @ts-nocheck
import { localPoint } from "@visx/event";
import { curveMonotoneX } from "@visx/curve";
import { GridColumns, GridRows } from "@visx/grid";
import { ParentSize } from "@visx/responsive";
import { scaleLinear, scaleTime, type scaleBand } from "@visx/scale";
import { AreaClosed, LinePath } from "@visx/shape";
import { bisector } from "d3-array";
import {
  AnimatePresence, motion, useMotionTemplate, useSpring,
} from "motion/react";
import {
  Children, createContext, isValidElement, useCallback, useContext,
  useEffect, useId, useLayoutEffect, useMemo, useRef, useState,
  type Dispatch, type ReactElement, type ReactNode, type RefObject, type SetStateAction,
} from "react";
import useMeasure from "react-use-measure";
import { createPortal } from "react-dom";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
type CurveFactory = any;
type ScaleLinearType<Output> = ReturnType<typeof scaleLinear<Output>>;
type ScaleTimeType<Output> = ReturnType<typeof scaleTime<Output>>;
type ScaleBandType<D extends { toString(): string }> = ReturnType<typeof scaleBand<D>>;

export const chartCssVars = {
  background: "var(--chart-background)", foreground: "var(--chart-foreground)",
  foregroundMuted: "var(--chart-foreground-muted)", label: "var(--chart-label)",
  linePrimary: "var(--chart-line-primary)", lineSecondary: "var(--chart-line-secondary)",
  crosshair: "var(--chart-crosshair)", grid: "var(--chart-grid)",
  indicatorColor: "var(--chart-indicator-color)", indicatorSecondaryColor: "var(--chart-indicator-secondary-color)",
  markerBackground: "var(--chart-marker-background)", markerBorder: "var(--chart-marker-border)",
  markerForeground: "var(--chart-marker-foreground)", badgeBackground: "var(--chart-marker-badge-background)",
  badgeForeground: "var(--chart-marker-badge-foreground)", segmentBackground: "var(--chart-segment-background)",
  segmentLine: "var(--chart-segment-line)",
};

export interface Margin { top: number; right: number; bottom: number; left: number; }
export interface TooltipData { point: Record<string, unknown>; index: number; x: number; yPositions: Record<string, number>; xPositions?: Record<string, number>; }
export interface LineConfig { dataKey: string; stroke: string; strokeWidth: number; }
export interface ChartSelection { startX: number; endX: number; startIndex: number; endIndex: number; active: boolean; }
export interface TooltipRow { color: string; label: string; value: string | number; }

export interface ChartContextValue {
  data: Record<string, unknown>[]; xScale: ScaleTimeType<number>; yScale: ScaleLinearType<number>;
  width: number; height: number; innerWidth: number; innerHeight: number; margin: Margin; columnWidth: number;
  tooltipData: TooltipData | null; setTooltipData: Dispatch<SetStateAction<TooltipData | null>>;
  containerRef: RefObject<HTMLDivElement | null>; lines: LineConfig[]; isLoaded: boolean; animationDuration: number;
  xAccessor: (d: Record<string, unknown>) => Date; dateLabels: string[];
  selection?: ChartSelection | null; clearSelection?: () => void;
  barScale?: ScaleBandType<string>; bandWidth?: number; hoveredBarIndex?: number | null;
  setHoveredBarIndex?: (index: number | null) => void; barXAccessor?: (d: Record<string, unknown>) => string;
  orientation?: "vertical" | "horizontal"; stacked?: boolean;
}

const ChartContext = createContext<ChartContextValue | null>(null);
function ChartProvider({ children, value }: { children: ReactNode; value: ChartContextValue }) {
  return <ChartContext.Provider value={value}>{children}</ChartContext.Provider>;
}
export function useChart(): ChartContextValue {
  const ctx = useContext(ChartContext);
  if (!ctx) throw new Error("useChart must be used within a ChartProvider.");
  return ctx;
}

type ScaleTime = ReturnType<typeof scaleTime<number>>;
type ScaleLinear = ReturnType<typeof scaleLinear<number>>;

function useChartInteraction({ xScale, yScale, data, lines, margin, xAccessor, bisectDate, canInteract }: {
  xScale: ScaleTime; yScale: ScaleLinear; data: Record<string, unknown>[]; lines: LineConfig[];
  margin: Margin; xAccessor: (d: Record<string, unknown>) => Date;
  bisectDate: (data: Record<string, unknown>[], date: Date, lo: number) => number; canInteract: boolean;
}) {
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [selection, setSelection] = useState<ChartSelection | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const resolveTooltipFromX = useCallback((px: number): TooltipData | null => {
    const x0 = xScale.invert(px); const idx = bisectDate(data, x0, 1);
    const d0 = data[idx - 1]; const d1 = data[idx]; if (!d0) return null;
    let d = d0; let fi = idx - 1;
    if (d1 && x0.getTime() - xAccessor(d0).getTime() > xAccessor(d1).getTime() - x0.getTime()) { d = d1; fi = idx; }
    const yp: Record<string, number> = {};
    for (const l of lines) { const v = d[l.dataKey]; if (typeof v === "number") yp[l.dataKey] = yScale(v) ?? 0; }
    return { point: d, index: fi, x: xScale(xAccessor(d)) ?? 0, yPositions: yp };
  }, [xScale, yScale, data, lines, xAccessor, bisectDate]);
  const resolveIdx = useCallback((px: number): number => {
    const x0 = xScale.invert(px); const idx = bisectDate(data, x0, 1); const d0 = data[idx-1]; const d1 = data[idx];
    if (!d0) return 0; if (d1 && x0.getTime()-xAccessor(d0).getTime() > xAccessor(d1).getTime()-x0.getTime()) return idx;
    return idx - 1;
  }, [xScale, data, xAccessor, bisectDate]);
  const getChartX = useCallback((e: React.MouseEvent<SVGGElement>|React.TouchEvent<SVGGElement>, ti=0): number|null => {
    let p: {x:number;y:number}|null = null;
    if ("touches" in e) { const t = e.touches[ti]; if (!t) return null; const svg = e.currentTarget.ownerSVGElement; if (!svg) return null; p = localPoint(svg, t as unknown as MouseEvent); }
    else { p = localPoint(e); } if (!p) return null; return p.x - margin.left;
  }, [margin.left]);
  const handleMouseMove = useCallback((e: React.MouseEvent<SVGGElement>) => {
    const cx = getChartX(e); if (cx === null) return;
    if (isDraggingRef.current) { setSelection({ startX: Math.min(dragStartXRef.current,cx), endX: Math.max(dragStartXRef.current,cx), startIndex: resolveIdx(Math.min(dragStartXRef.current,cx)), endIndex: resolveIdx(Math.max(dragStartXRef.current,cx)), active: true }); return; }
    const t = resolveTooltipFromX(cx); if (t) setTooltipData(t);
  }, [getChartX, resolveTooltipFromX, resolveIdx]);
  const handleMouseLeave = useCallback(() => { setTooltipData(null); if (isDraggingRef.current) isDraggingRef.current = false; setSelection(null); }, []);
  const handleMouseDown = useCallback((e: React.MouseEvent<SVGGElement>) => { const cx = getChartX(e); if (cx===null) return; isDraggingRef.current=true; dragStartXRef.current=cx; setTooltipData(null); setSelection(null); }, [getChartX]);
  const handleMouseUp = useCallback(() => { if (isDraggingRef.current) isDraggingRef.current=false; setSelection(null); }, []);
  const handleTouchStart = useCallback((e: React.TouchEvent<SVGGElement>) => {
    if (e.touches.length===1) { e.preventDefault(); const cx=getChartX(e,0); if (cx!==null) { const t=resolveTooltipFromX(cx); if (t) setTooltipData(t); } }
    else if (e.touches.length===2) { e.preventDefault(); setTooltipData(null); const x0=getChartX(e,0),x1=getChartX(e,1); if (x0!==null&&x1!==null) setSelection({startX:Math.min(x0,x1),endX:Math.max(x0,x1),startIndex:resolveIdx(Math.min(x0,x1)),endIndex:resolveIdx(Math.max(x0,x1)),active:true}); }
  }, [getChartX, resolveTooltipFromX, resolveIdx]);
  const handleTouchMove = useCallback((e: React.TouchEvent<SVGGElement>) => {
    if (e.touches.length===1) { e.preventDefault(); const cx=getChartX(e,0); if (cx!==null) { const t=resolveTooltipFromX(cx); if (t) setTooltipData(t); } }
    else if (e.touches.length===2) { e.preventDefault(); const x0=getChartX(e,0),x1=getChartX(e,1); if (x0!==null&&x1!==null) setSelection({startX:Math.min(x0,x1),endX:Math.max(x0,x1),startIndex:resolveIdx(Math.min(x0,x1)),endIndex:resolveIdx(Math.max(x0,x1)),active:true}); }
  }, [getChartX, resolveTooltipFromX, resolveIdx]);
  const handleTouchEnd = useCallback(() => { setTooltipData(null); setSelection(null); }, []);
  const clearSelection = useCallback(() => setSelection(null), []);
  return { tooltipData, setTooltipData, selection, clearSelection,
    interactionHandlers: canInteract ? { onMouseMove:handleMouseMove,onMouseLeave:handleMouseLeave,onMouseDown:handleMouseDown,onMouseUp:handleMouseUp,onTouchStart:handleTouchStart,onTouchMove:handleTouchMove,onTouchEnd:handleTouchEnd } : {},
    interactionStyle: { cursor: canInteract ? "crosshair" : "default", touchAction: "none" } };
}

const TICKER_ITEM_HEIGHT = 24;
function DateTicker({ currentIndex, labels, visible }: { currentIndex: number; labels: string[]; visible: boolean }) {
  const parsedLabels = useMemo(() => labels.map(l => { const p = l.split(" "); return { month: p[0]||"", day: p[1]||"", full: l }; }), [labels]);
  const monthIndices = useMemo(() => { const u: string[] = []; const i: number[] = []; parsedLabels.forEach((l,idx) => { if (u.length===0||u.at(-1)!==l.month) { u.push(l.month); i.push(idx); } }); return { u, i }; }, [parsedLabels]);
  const currentMonthIndex = useMemo(() => { if (currentIndex<0||currentIndex>=parsedLabels.length) return 0; return monthIndices.u.indexOf(parsedLabels[currentIndex]?.month||""); }, [currentIndex, parsedLabels, monthIndices]);
  const prevMonthIndexRef = useRef(-1);
  const dayY = useSpring(0, { stiffness: 400, damping: 35 });
  const monthY = useSpring(0, { stiffness: 400, damping: 35 });
  useEffect(() => { dayY.set(-currentIndex * TICKER_ITEM_HEIGHT); }, [currentIndex, dayY]);
  useEffect(() => { if (currentMonthIndex >= 0) { const first = prevMonthIndexRef.current === -1; const changed = prevMonthIndexRef.current !== currentMonthIndex; if (first || changed) { monthY.set(-currentMonthIndex * TICKER_ITEM_HEIGHT); prevMonthIndexRef.current = currentMonthIndex; } } }, [currentMonthIndex, monthY]);
  if (!visible || labels.length === 0) return null;
  return (
    <motion.div className="overflow-hidden rounded-full bg-zinc-900 px-4 py-1 text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900" layout transition={{ layout: { type: "spring", stiffness: 400, damping: 35 } }}>
      <div className="relative h-6 overflow-hidden">
        <div className="flex items-center justify-center gap-1">
          <div className="relative h-6 overflow-hidden">
            <motion.div className="flex flex-col" style={{ y: monthY }}>
              {monthIndices.u.map(m => (<div className="flex h-6 shrink-0 items-center justify-center" key={m}><span className="whitespace-nowrap font-medium text-sm">{m}</span></div>))}
            </motion.div>
          </div>
          <div className="relative h-6 overflow-hidden">
            <motion.div className="flex flex-col" style={{ y: dayY }}>
              {parsedLabels.map((l, i) => (<div className="flex h-6 shrink-0 items-center justify-center" key={l.day + '-' + i}><span className="whitespace-nowrap font-medium text-sm">{l.day}</span></div>))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
DateTicker.displayName = "DateTicker";

function TooltipDot({ x, y, visible, color, size = 5, strokeColor = chartCssVars.background, strokeWidth = 2 }: { x: number; y: number; visible: boolean; color: string; size?: number; strokeColor?: string; strokeWidth?: number }) {
  const sc = { stiffness: 300, damping: 30 };
  const ax = useSpring(x, sc); const ay = useSpring(y, sc);
  useEffect(() => { ax.set(x); ay.set(y); }, [x, y, ax, ay]);
  if (!visible) return null;
  return <motion.circle cx={ax} cy={ay} fill={color} r={size} stroke={strokeColor} strokeWidth={strokeWidth} />;
}
TooltipDot.displayName = "TooltipDot";

type IndicatorWidth = number | "line" | "thin" | "medium" | "thick";
function resolveWidth(w: IndicatorWidth): number {
  if (typeof w === "number") return w;
  switch (w) { case "line": return 1; case "thin": return 2; case "medium": return 4; case "thick": return 8; default: return 1; }
}
function TooltipIndicator({ x, height, visible, width = "line", span, columnWidth, colorEdge = chartCssVars.crosshair, colorMid = chartCssVars.crosshair, fadeEdges = true, gradientId = "tooltip-indicator-gradient" }: { x: number; height: number; visible: boolean; width?: IndicatorWidth; span?: number; columnWidth?: number; colorEdge?: string; colorMid?: string; fadeEdges?: boolean; gradientId?: string }) {
  const pw = span !== undefined && columnWidth !== undefined ? span * columnWidth : resolveWidth(width);
  const sc = { stiffness: 300, damping: 30 };
  const ax = useSpring(x - pw / 2, sc);
  useEffect(() => { ax.set(x - pw / 2); }, [x, ax, pw]);
  if (!visible) return null;
  const eo = fadeEdges ? 0 : 1;
  return (<g><defs><linearGradient id={gradientId} x1="0%" x2="0%" y1="0%" y2="100%">
    <stop offset="0%" style={{ stopColor: colorEdge, stopOpacity: eo }} />
    <stop offset="10%" style={{ stopColor: colorEdge, stopOpacity: 1 }} />
    <stop offset="50%" style={{ stopColor: colorMid, stopOpacity: 1 }} />
    <stop offset="90%" style={{ stopColor: colorEdge, stopOpacity: 1 }} />
    <stop offset="100%" style={{ stopColor: colorEdge, stopOpacity: eo }} />
  </linearGradient></defs>
    <motion.rect fill={'url(#' + gradientId + ')'} height={height} width={pw} x={ax} y={0} />
  </g>);
}
TooltipIndicator.displayName = "TooltipIndicator";

function TooltipContent({ title, rows, children }: { title?: string; rows: TooltipRow[]; children?: ReactNode }) {
  const [mr, bounds] = useMeasure({ debounce: 0, scroll: false });
  const [ch, setCh] = useState<number | null>(null);
  const ccsr = useRef<boolean | null>(null);
  const fr = useRef<number | null>(null);
  const hc = !!children; const mk = hc ? "has-marker" : "no-marker";
  const iws = ccsr.current !== null && ccsr.current !== hc;
  useEffect(() => {
    if (bounds.height <= 0) return;
    if (fr.current) { cancelAnimationFrame(fr.current); fr.current = null; }
    if (iws) { fr.current = requestAnimationFrame(() => { fr.current = requestAnimationFrame(() => { setCh(bounds.height); ccsr.current = hc; }); }); }
    else { setCh(bounds.height); ccsr.current = hc; }
    return () => { if (fr.current) cancelAnimationFrame(fr.current); };
  }, [bounds.height, hc, iws]);
  const sa = ch !== null;
  return (<motion.div animate={ch !== null ? { height: ch } : undefined} className="overflow-hidden" initial={false} transition={sa ? { type: "spring", stiffness: 500, damping: 35, mass: 0.8 } : { duration: 0 }}>
    <div className="px-3 py-2.5" ref={mr}>
      {title && (<div className="mb-2 font-medium text-chart-tooltip-foreground text-xs">{title}</div>)}
      <div className="space-y-1.5">
        {rows.map(r => (<div className="flex items-center justify-between gap-4" key={r.label + '-' + r.color}>
          <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: r.color }} /><span className="text-chart-tooltip-muted text-sm">{r.label}</span></div>
          <span className="font-medium text-chart-tooltip-foreground text-sm tabular-nums">{typeof r.value === "number" ? r.value.toLocaleString() : r.value}</span>
        </div>))}
      </div>
      <AnimatePresence mode="wait">{children && (<motion.div animate={{ opacity: 1, filter: "blur(0px)" }} className="mt-2" exit={{ opacity: 0, filter: "blur(4px)" }} initial={{ opacity: 0, filter: "blur(4px)" }} key={mk} transition={{ duration: 0.2, ease: "easeOut" }}>{children}</motion.div>)}</AnimatePresence>
    </div>
  </motion.div>);
}
TooltipContent.displayName = "TooltipContent";

function TooltipBox({ x, y, visible, containerRef, containerWidth, containerHeight, offset = 16, className = "", children, left: lo, top: to, flipped: fo }: {
  x: number; y: number; visible: boolean; containerRef: RefObject<HTMLDivElement | null>; containerWidth: number; containerHeight: number; offset?: number; className?: string; children: ReactNode; left?: number | ReturnType<typeof useSpring>; top?: number | ReturnType<typeof useSpring>; flipped?: boolean;
}) {
  const tr = useRef<HTMLDivElement>(null);
  const [tw, setTw] = useState(180); const [th, setTh] = useState(80);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useLayoutEffect(() => { if (tr.current) { const w = tr.current.offsetWidth; const h = tr.current.offsetHeight; if (w > 0 && w !== tw) setTw(w); if (h > 0 && h !== th) setTh(h); } }, [tw, th]);
  const sf = x + tw + offset > containerWidth;
  const tx = sf ? x - offset - tw : x + offset;
  const ty = Math.max(offset, Math.min(y - th / 2, containerHeight - th - offset));
  const pfr = useRef(sf); const [fk, setFk] = useState(0);
  useEffect(() => { if (pfr.current !== sf) { setFk(k => k + 1); pfr.current = sf; } }, [sf]);
  const sc = { stiffness: 100, damping: 20 };
  const al = useSpring(tx, sc); const at = useSpring(ty, sc);
  useEffect(() => { al.set(tx); }, [tx, al]);
  useEffect(() => { at.set(ty); }, [ty, at]);
  const fl = lo ?? al; const ft = to ?? at; const isf = fo ?? sf; const to2 = isf ? "right top" : "left top";
  const container = containerRef.current;
  if (!(mounted && container)) return null;
  if (!visible) return null;
  return createPortal(
    <motion.div animate={{ opacity: 1 }} className={cn("pointer-events-none absolute z-50", className)} exit={{ opacity: 0 }} initial={{ opacity: 0 }} ref={tr} style={{ left: fl, top: ft }} transition={{ duration: 0.1 }}>
      <motion.div animate={{ scale: 1, opacity: 1, x: 0 }} className="min-w-[140px] overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-lg backdrop-blur-md" initial={{ scale: 0.85, opacity: 0, x: isf ? 20 : -20 }} key={fk} style={{ transformOrigin: to2 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
        {children}
      </motion.div>
    </motion.div>,
    container
  );
}
TooltipBox.displayName = "TooltipBox";

export interface ChartTooltipProps {
  showDatePill?: boolean; showCrosshair?: boolean; showDots?: boolean;
  content?: (props: { point: Record<string, unknown>; index: number; }) => ReactNode;
  rows?: (point: Record<string, unknown>) => TooltipRow[]; children?: ReactNode; className?: string;
}

export function ChartTooltip({ showDatePill = true, showCrosshair = true, showDots = true, content, rows: rr, children, className = "" }: ChartTooltipProps) {
  const { tooltipData, width, height, innerHeight, margin, columnWidth, lines, xAccessor, dateLabels, containerRef, orientation, barXAccessor } = useChart();
  const isH = orientation === "horizontal";
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const visible = tooltipData !== null;
  const x = tooltipData?.x ?? 0; const xM = x + margin.left;
  const fl = lines[0]?.dataKey; const fY = fl ? (tooltipData?.yPositions[fl] ?? 0) : 0;
  const yM = fY + margin.top;
  const sc = { stiffness: 300, damping: 30 };
  const ax = useSpring(xM, sc);
  useEffect(() => { ax.set(xM); }, [xM, ax]);
  const tRows = useMemo(() => {
    if (!tooltipData) return [];
    if (rr) return rr(tooltipData.point);
    return lines.map(l => ({ color: l.stroke, label: l.dataKey, value: (tooltipData.point[l.dataKey] as number) ?? 0 }));
  }, [tooltipData, lines, rr]);
  const title = useMemo(() => {
    if (!tooltipData) return undefined;
    if (barXAccessor) return barXAccessor(tooltipData.point);
    return xAccessor(tooltipData.point).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }, [tooltipData, barXAccessor, xAccessor]);
  const container = containerRef.current;
  if (!(mounted && container)) return null;
  const tc = (<>{
    showCrosshair && (<svg aria-hidden="true" className="pointer-events-none absolute inset-0" height="100%" width="100%"><g transform={'translate(' + margin.left + ',' + margin.top + ')'}><TooltipIndicator colorEdge={chartCssVars.crosshair} colorMid={chartCssVars.crosshair} columnWidth={columnWidth} fadeEdges height={innerHeight} visible={visible} width="line" x={x} /></g></svg>)}
    {showDots && visible && !isH && (<svg aria-hidden="true" className="pointer-events-none absolute inset-0" height="100%" width="100%"><g transform={'translate(' + margin.left + ',' + margin.top + ')'}>{lines.map(l => (<TooltipDot color={l.stroke} key={l.dataKey} strokeColor={chartCssVars.background} visible={visible} x={tooltipData?.xPositions?.[l.dataKey] ?? x} y={tooltipData?.yPositions[l.dataKey] ?? 0} />))}</g></svg>)}
    <TooltipBox className={className} containerHeight={height} containerRef={containerRef} containerWidth={width} top={isH ? undefined : margin.top} visible={visible} x={xM} y={isH ? yM : margin.top}>
      {content ? content({ point: tooltipData?.point ?? {}, index: tooltipData?.index ?? 0 }) : (<TooltipContent rows={tRows} title={title}>{children}</TooltipContent>)}
    </TooltipBox>
    {showDatePill && dateLabels.length > 0 && visible && !isH && (<motion.div className="pointer-events-none absolute z-50" style={{ left: ax, transform: "translateX(-50%)", bottom: 4 }}><DateTicker currentIndex={tooltipData?.index ?? 0} labels={dateLabels} visible={visible} /></motion.div>)}
  </>);
  return createPortal(tc, container);
}
ChartTooltip.displayName = "ChartTooltip";

export interface GridProps { horizontal?: boolean; vertical?: boolean; numTicksRows?: number; numTicksColumns?: number; rowTickValues?: number[]; stroke?: string; strokeOpacity?: number; strokeWidth?: number; strokeDasharray?: string; fadeHorizontal?: boolean; fadeVertical?: boolean; }

export function Grid({ horizontal = true, vertical = false, numTicksRows = 5, numTicksColumns = 10, rowTickValues, stroke = chartCssVars.grid, strokeOpacity = 1, strokeWidth = 1, strokeDasharray = "4,4", fadeHorizontal = true, fadeVertical = false }: GridProps) {
  const { xScale, yScale, innerWidth, innerHeight, orientation, barScale } = useChart();
  const isHBC = orientation === "horizontal" && barScale;
  const cScale = isHBC ? yScale : xScale;
  const uid = useId();
  const hM = 'grid-rows-fade-' + uid; const hG = hM + '-gradient';
  const vM = 'grid-cols-fade-' + uid; const vG = vM + '-gradient';
  return (<g className="chart-grid">
    {horizontal && fadeHorizontal && (<defs><linearGradient id={hG} x1="0%" x2="100%" y1="0%" y2="0%">
      <stop offset="0%" style={{ stopColor: "white", stopOpacity: 0 }} /><stop offset="10%" style={{ stopColor: "white", stopOpacity: 1 }} /><stop offset="90%" style={{ stopColor: "white", stopOpacity: 1 }} /><stop offset="100%" style={{ stopColor: "white", stopOpacity: 0 }} />
    </linearGradient><mask id={hM}><rect fill={'url(#' + hG + ')'} height={innerHeight} width={innerWidth} x="0" y="0" /></mask></defs>)}
    {vertical && fadeVertical && (<defs><linearGradient id={vG} x1="0%" x2="0%" y1="0%" y2="100%">
      <stop offset="0%" style={{ stopColor: "white", stopOpacity: 0 }} /><stop offset="10%" style={{ stopColor: "white", stopOpacity: 1 }} /><stop offset="90%" style={{ stopColor: "white", stopOpacity: 1 }} /><stop offset="100%" style={{ stopColor: "white", stopOpacity: 0 }} />
    </linearGradient><mask id={vM}><rect fill={'url(#' + vG + ')'} height={innerHeight} width={innerWidth} x="0" y="0" /></mask></defs>)}
    {horizontal && (<g mask={fadeHorizontal ? 'url(#' + hM + ')' : undefined}><GridRows numTicks={rowTickValues ? undefined : numTicksRows} scale={yScale} stroke={stroke} strokeDasharray={strokeDasharray} strokeOpacity={strokeOpacity} strokeWidth={strokeWidth} tickValues={rowTickValues} width={innerWidth} /></g>)}
    {vertical && cScale && typeof cScale === "function" && (<g mask={fadeVertical ? 'url(#' + vM + ')' : undefined}><GridColumns height={innerHeight} numTicks={numTicksColumns} scale={cScale} stroke={stroke} strokeDasharray={strokeDasharray} strokeOpacity={strokeOpacity} strokeWidth={strokeWidth} /></g>)}
  </g>);
}
Grid.displayName = "Grid";

export interface XAxisProps { numTicks?: number; tickerHalfWidth?: number; }
function XAxisLabel({ label, x, crosshairX, isHovering, tickerHalfWidth }: { label: string; x: number; crosshairX: number | null; isHovering: boolean; tickerHalfWidth: number }) {
  const fb = 20; const fr2 = tickerHalfWidth + fb;
  let opacity = 1;
  if (isHovering && crosshairX !== null) { const d = Math.abs(x - crosshairX); if (d < tickerHalfWidth) opacity = 0; else if (d < fr2) opacity = (d - tickerHalfWidth) / fb; }
  return (<div className="absolute" style={{ left: x, bottom: 12, width: 0, display: "flex", justifyContent: "center" }}>
    <motion.span animate={{ opacity }} className={cn("whitespace-nowrap text-chart-label text-xs")} initial={{ opacity: 1 }} transition={{ duration: 0.4, ease: "easeInOut" }}>{label}</motion.span>
  </div>);
}
export function XAxis({ numTicks = 5, tickerHalfWidth = 50 }: XAxisProps) {
  const { xScale, margin, tooltipData, containerRef } = useChart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const labels = useMemo(() => {
    const d = xScale.domain(); const s = d[0]; const e = d[1]; if (!(s && e)) return [];
    const st = s.getTime(); const et = e.getTime(); const tr = et - st;
    const tc = Math.max(2, numTicks); const dates: Date[] = [];
    for (let i = 0; i < tc; i++) { const t = i / (tc - 1); dates.push(new Date(st + t * tr)); }
    return dates.map(d => ({ date: d, x: (xScale(d) ?? 0) + margin.left, label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) }));
  }, [xScale, margin.left, numTicks]);
  const isH = tooltipData !== null; const cX = tooltipData ? tooltipData.x + margin.left : null;
  const container = containerRef.current;
  if (!(mounted && container)) return null;
  return createPortal(<div className="pointer-events-none absolute inset-0">{labels.map(it => (<XAxisLabel crosshairX={cX} isHovering={isH} key={it.label + '-' + it.x} label={it.label} tickerHalfWidth={tickerHalfWidth} x={it.x} />))}</div>, container);
}
XAxis.displayName = "XAxis";

export interface YAxisProps { numTicks?: number; formatValue?: (value: number) => string; }
export function YAxis({ numTicks = 5, formatValue }: YAxisProps) {
  const { yScale, margin, containerRef } = useChart();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  useEffect(() => { setContainer(containerRef.current); }, [containerRef]);
  const ticks = useMemo(() => {
    const d = yScale.domain() as [number, number]; const min = d[0]; const max = d[1]; const step = (max - min) / (numTicks - 1);
    return Array.from({ length: numTicks }, (_, i) => { const v = min + step * i; return { value: v, y: (yScale(v) ?? 0) + margin.top, label: formatValue ? formatValue(v) : v >= 1000 ? (v / 1000).toFixed(v % 1000 === 0 ? 0 : 1) + 'k' : v.toLocaleString() }; });
  }, [yScale, margin.top, numTicks, formatValue]);
  if (!container) return null;
  return createPortal(<div className="pointer-events-none absolute inset-0">{ticks.map(t => (<div key={t.value} className="absolute" style={{ left: 0, top: t.y, width: margin.left - 8, display: "flex", justifyContent: "flex-end", transform: "translateY(-50%)" }}><span className="whitespace-nowrap text-chart-label text-xs tabular-nums">{t.label}</span></div>))}</div>, container);
}
YAxis.displayName = "YAxis";

export interface AreaProps { dataKey: string; fill?: string; fillOpacity?: number; stroke?: string; strokeWidth?: number; curve?: CurveFactory; animate?: boolean; showLine?: boolean; showHighlight?: boolean; gradientToOpacity?: number; fadeEdges?: boolean; }

export function Area({ dataKey, fill = chartCssVars.linePrimary, fillOpacity = 0.4, stroke, strokeWidth = 2, curve = curveMonotoneX, animate = true, showLine = true, showHighlight = true, gradientToOpacity = 0, fadeEdges = false }: AreaProps) {
  const { data, xScale, yScale, innerHeight, innerWidth, tooltipData, selection, isLoaded, animationDuration, xAccessor } = useChart();
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [clipWidth, setClipWidth] = useState(0);
  const uid = useId();
  const gId = 'area-gradient-' + dataKey + '-' + Math.random().toString(36).slice(2, 9);
  const sgId = 'area-stroke-gradient-' + dataKey + '-' + Math.random().toString(36).slice(2, 9);
  const emId = 'area-edge-mask-' + dataKey + '-' + uid; const egId = emId + '-gradient';
  const rs = stroke || fill;
  useEffect(() => { if (pathRef.current && animate) { const len = pathRef.current.getTotalLength(); if (len > 0) { setPathLength(len); if (!isLoaded) requestAnimationFrame(() => setClipWidth(innerWidth)); } } }, [animate, innerWidth, isLoaded]);
  const fLaX = useCallback((tx: number): number => {
    const p = pathRef.current; if (!p || pathLength === 0) return 0; let lo = 0; let hi = pathLength; const tol = 0.5;
    while (hi - lo > tol) { const mid = (lo + hi) / 2; const pt = p.getPointAtLength(mid); if (pt.x < tx) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  }, [pathLength]);
  const sb = useMemo(() => {
    if (!pathRef.current || pathLength === 0) return { startLength: 0, segmentLength: 0, isActive: false };
    if (selection?.active) { const sl = fLaX(selection.startX); const el = fLaX(selection.endX); return { startLength: sl, segmentLength: el - sl, isActive: true }; }
    if (!tooltipData) return { startLength: 0, segmentLength: 0, isActive: false };
    const idx = tooltipData.index; const si = Math.max(0, idx - 1); const ei = Math.min(data.length - 1, idx + 1);
    const sp = data[si]; const ep = data[ei]; if (!(sp && ep)) return { startLength: 0, segmentLength: 0, isActive: false };
    const sx = xScale(xAccessor(sp)) ?? 0; const ex = xScale(xAccessor(ep)) ?? 0;
    const sl = fLaX(sx); const el = fLaX(ex); return { startLength: sl, segmentLength: el - sl, isActive: true };
  }, [tooltipData, selection, data, xScale, pathLength, xAccessor, fLaX]);
  const sc = { stiffness: 180, damping: 28 };
  const os = useSpring(0, sc); const sls = useSpring(0, sc);
  const ad = useMotionTemplate`${sls} ${pathLength}`;
  useEffect(() => { os.set(-sb.startLength); sls.set(sb.segmentLength); }, [sb.startLength, sb.segmentLength, os, sls]);
  const getY = useCallback((d: Record<string, unknown>) => { const v = d[dataKey]; return typeof v === "number" ? (yScale(v) ?? 0) : 0; }, [dataKey, yScale]);
  const isH = tooltipData !== null || selection?.active === true;
  const easing = "cubic-bezier(0.85, 0, 0.15, 1)";
  return (<><defs>
    <linearGradient id={gId} x1="0%" x2="0%" y1="0%" y2="100%"><stop offset="0%" style={{ stopColor: fill, stopOpacity: fillOpacity }} /><stop offset="100%" style={{ stopColor: fill, stopOpacity: gradientToOpacity }} /></linearGradient>
    <linearGradient id={sgId} x1="0%" x2="100%" y1="0%" y2="0%"><stop offset="0%" style={{ stopColor: rs, stopOpacity: 0 }} /><stop offset="15%" style={{ stopColor: rs, stopOpacity: 1 }} /><stop offset="85%" style={{ stopColor: rs, stopOpacity: 1 }} /><stop offset="100%" style={{ stopColor: rs, stopOpacity: 0 }} /></linearGradient>
    {fadeEdges && (<><linearGradient id={egId} x1="0%" x2="100%" y1="0%" y2="0%"><stop offset="0%" style={{ stopColor: "white", stopOpacity: 0 }} /><stop offset="20%" style={{ stopColor: "white", stopOpacity: 1 }} /><stop offset="80%" style={{ stopColor: "white", stopOpacity: 1 }} /><stop offset="100%" style={{ stopColor: "white", stopOpacity: 0 }} /></linearGradient><mask id={emId}><rect fill={'url(#' + egId + ')'} height={innerHeight} width={innerWidth} x="0" y="0" /></mask></>)}
  </defs>
    {animate && (<defs><clipPath id={'grow-clip-area-' + dataKey}><rect height={innerHeight + 20} style={{ transition: !isLoaded && clipWidth > 0 ? 'width ' + animationDuration + 'ms ' + easing : "none" }} width={isLoaded ? innerWidth : clipWidth} x={0} y={0} /></clipPath></defs>)}
    <g clipPath={animate ? 'url(#grow-clip-area-' + dataKey + ')' : undefined}>
      <motion.g animate={{ opacity: isH && showHighlight ? 0.6 : 1 }} initial={{ opacity: 1 }} transition={{ duration: 0.4, ease: "easeInOut" }}>
        <g mask={fadeEdges ? 'url(#' + emId + ')' : undefined}><AreaClosed curve={curve} data={data} fill={'url(#' + gId + ')'} x={(d) => xScale(xAccessor(d)) ?? 0} y={getY} yScale={yScale} /></g>
        {showLine && (<LinePath curve={curve} data={data} innerRef={pathRef} stroke={'url(#' + sgId + ')'} strokeLinecap="round" strokeWidth={strokeWidth} x={(d) => xScale(xAccessor(d)) ?? 0} y={getY} />)}
      </motion.g>
    </g>
    {showHighlight && showLine && isH && isLoaded && pathRef.current && (<motion.path animate={{ opacity: 1 }} d={pathRef.current.getAttribute("d") || ""} exit={{ opacity: 0 }} fill="none" initial={{ opacity: 0 }} stroke={rs} strokeLinecap="round" strokeWidth={strokeWidth} style={{ strokeDasharray: ad, strokeDashoffset: os }} transition={{ duration: 0.4, ease: "easeInOut" }} />)}
  </>);
}
Area.displayName = "Area";

export function SegmentBackground() {
  const { selection, innerHeight } = useChart();
  if (!selection?.active) return null;
  const x = Math.min(selection.startX, selection.endX); const w = Math.abs(selection.endX - selection.startX);
  return (<motion.rect animate={{ opacity: 0.15 }} fill={chartCssVars.linePrimary} height={innerHeight} initial={{ opacity: 0 }} rx={4} transition={{ duration: 0.2 }} width={w} x={x} y={0} />);
}
SegmentBackground.displayName = "SegmentBackground";

export function SegmentLineFrom() {
  const { selection, innerHeight } = useChart();
  if (!selection?.active) return null;
  const x = Math.min(selection.startX, selection.endX);
  return (<motion.line animate={{ opacity: 1 }} initial={{ opacity: 0 }} stroke={chartCssVars.linePrimary} strokeDasharray="4,3" strokeWidth={1.5} transition={{ duration: 0.2 }} x1={x} x2={x} y1={0} y2={innerHeight} />);
}
SegmentLineFrom.displayName = "SegmentLineFrom";

export function SegmentLineTo() {
  const { selection, innerHeight } = useChart();
  if (!selection?.active) return null;
  const x = Math.max(selection.startX, selection.endX);
  return (<motion.line animate={{ opacity: 1 }} initial={{ opacity: 0 }} stroke={chartCssVars.linePrimary} strokeDasharray="4,3" strokeWidth={1.5} transition={{ duration: 0.2 }} x1={x} x2={x} y1={0} y2={innerHeight} />);
}
SegmentLineTo.displayName = "SegmentLineTo";

export interface PatternLinesProps { id: string; width?: number; height?: number; stroke?: string; strokeWidth?: number; orientation?: ("diagonal" | "horizontal" | "vertical")[]; }
export function PatternLines({ id, width = 6, height = 6, stroke = "var(--chart-line-primary)", strokeWidth = 1, orientation = ["diagonal"] }: PatternLinesProps) {
  const paths: string[] = [];
  for (const o of orientation) {
    if (o === "diagonal") { paths.push('M0,' + height + 'l' + width + ',' + -height); paths.push('M' + -width/4 + ',' + height/4 + 'l' + width/2 + ',' + -height/2); paths.push('M' + (3*width)/4 + ',' + height+height/4 + 'l' + width/2 + ',' + -height/2); }
    else if (o === "horizontal") paths.push('M0,' + height/2 + 'l' + width + ',0');
    else if (o === "vertical") paths.push('M' + width/2 + ',0l0,' + height);
  }
  return (<defs><pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse"><path d={paths.join(" ")} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="square" /></pattern></defs>);
}
PatternLines.displayName = "PatternLines";

export interface PatternAreaProps { dataKey: string; fill?: string; curve?: CurveFactory; }
export function PatternArea({ dataKey, fill = "url(#area-pattern)", curve = curveMonotoneX }: PatternAreaProps) {
  const { data, xScale, yScale, xAccessor } = useChart();
  const getY = useCallback((d: Record<string, unknown>) => { const v = d[dataKey]; return typeof v === "number" ? (yScale(v) ?? 0) : 0; }, [dataKey, yScale]);
  return (<AreaClosed curve={curve} data={data} fill={fill} x={(d) => xScale(xAccessor(d)) ?? 0} y={getY} yScale={yScale} />);
}
PatternArea.displayName = "PatternArea";

function isPostOverlayComponent(child: ReactElement): boolean {
  const ct = child.type as { displayName?: string; name?: string; __isChartMarkers?: boolean };
  if (ct.__isChartMarkers) return true;
  const cn2 = typeof child.type === "function" ? (ct.displayName || ct.name || "") : "";
  return cn2 === "ChartMarkers" || cn2 === "MarkerGroup";
}

function extractAreaConfigs(children: ReactNode): LineConfig[] {
  const configs: LineConfig[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const ct = child.type as { displayName?: string; name?: string };
    const cn2 = typeof child.type === "function" ? (ct.displayName || ct.name || "") : "";
    const props = child.props as AreaProps | undefined;
    const isA = cn2 === "Area" || child.type === Area || (props && typeof props.dataKey === "string" && props.dataKey.length > 0);
    if (isA && props?.dataKey) configs.push({ dataKey: props.dataKey, stroke: props.stroke || props.fill || "var(--chart-line-primary)", strokeWidth: props.strokeWidth || 2 });
  });
  return configs;
}

export interface AreaChartProps { data: Record<string, unknown>[]; xDataKey?: string; margin?: Partial<Margin>; animationDuration?: number; aspectRatio?: string; className?: string; children: ReactNode; }
const DEFAULT_MARGIN: Margin = { top: 40, right: 40, bottom: 40, left: 40 };
interface ChartInnerProps { width: number; height: number; data: Record<string, unknown>[]; xDataKey: string; margin: Margin; animationDuration: number; children: ReactNode; containerRef: RefObject<HTMLDivElement | null>; }

function ChartInner({ width, height, data, xDataKey, margin, animationDuration, children, containerRef }: ChartInnerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const lines = useMemo(() => extractAreaConfigs(children), [children]);
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const xAccessor = useCallback((d: Record<string, unknown>): Date => { const v = d[xDataKey]; return v instanceof Date ? v : new Date(v as string | number); }, [xDataKey]);
  const bisectDate = useMemo(() => bisector<Record<string, unknown>, Date>((d) => xAccessor(d)).left, [xAccessor]);
  const xScale = useMemo(() => { const dates = data.map(d => xAccessor(d)); return scaleTime({ range: [0, innerWidth], domain: [Math.min(...dates.map(d => d.getTime())), Math.max(...dates.map(d => d.getTime()))] }); }, [innerWidth, data, xAccessor]);
  const columnWidth = useMemo(() => data.length < 2 ? 0 : innerWidth / (data.length - 1), [innerWidth, data.length]);
  const yScale = useMemo(() => {
    let mv = 0; for (const l of lines) for (const d of data) { const v = d[l.dataKey]; if (typeof v === "number" && v > mv) mv = v; }
    if (mv === 0) mv = 100;
    return scaleLinear({ range: [innerHeight, 0], domain: [0, mv * 1.1], nice: true });
  }, [innerHeight, data, lines]);
  const dateLabels = useMemo(() => data.map(d => xAccessor(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })), [data, xAccessor]);
  useEffect(() => { const t = setTimeout(() => setIsLoaded(true), animationDuration); return () => clearTimeout(t); }, [animationDuration]);
  const canInteract = isLoaded;
  const { tooltipData, setTooltipData, selection, clearSelection, interactionHandlers, interactionStyle } = useChartInteraction({ xScale, yScale, data, lines, margin, xAccessor, bisectDate, canInteract });
  if (width < 10 || height < 10) return null;
  const pre: ReactElement[] = []; const post: ReactElement[] = [];
  Children.forEach(children, (child) => { if (!isValidElement(child)) return; if (isPostOverlayComponent(child)) post.push(child); else pre.push(child); });
  const cv: ChartContextValue = { data, xScale, yScale, width, height, innerWidth, innerHeight, margin, columnWidth, tooltipData, setTooltipData, containerRef, lines, isLoaded, animationDuration, xAccessor, dateLabels, selection, clearSelection };
  return (<ChartProvider value={cv}><svg aria-hidden="true" height={height} width={width}>
    <defs><clipPath id="chart-area-grow-clip"><rect height={innerHeight + 20} style={{ transition: isLoaded ? "none" : 'width ' + animationDuration + 'ms cubic-bezier(0.85, 0, 0.15, 1)' }} width={isLoaded ? innerWidth : 0} x={0} y={0} /></clipPath></defs>
    <rect fill="transparent" height={height} width={width} x={0} y={0} />
    <g {...interactionHandlers} style={interactionStyle} transform={'translate(' + margin.left + ',' + margin.top + ')'}>
      <rect fill="transparent" height={innerHeight} width={innerWidth} x={0} y={0} />
      {pre}{post}
    </g>
  </svg></ChartProvider>);
}

export function AreaChart({ data, xDataKey = "date", margin: marginProp, animationDuration = 1100, aspectRatio = "2 / 1", className = "", children }: AreaChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const margin = { ...DEFAULT_MARGIN, ...marginProp };
  return (<div className={cn("relative w-full", className)} ref={containerRef} style={{ aspectRatio, touchAction: "none" }}>
    <ParentSize debounceTime={10}>{({ width, height }) => (<ChartInner animationDuration={animationDuration} containerRef={containerRef} data={data} height={height} margin={margin} width={width} xDataKey={xDataKey}>{children}</ChartInner>)}</ParentSize>
  </div>);
}

export default AreaChart;
