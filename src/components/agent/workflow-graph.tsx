// Read-only workflow visualization for the Agent Studio.
// Nodes are positioned on a 3-column grid by row index.
// Edges are drawn as cubic bezier curves in an SVG overlay underneath.
// The whole canvas pans (drag empty space) and zooms (corner controls).

"use client";

import { useMemo, useState } from "react";
import { animate, motion, useMotionValue } from "motion/react";
import {
  Flag,
  MessageCircle,
  HelpCircle,
  Wrench,
  CreditCard,
  CheckCircle2,
  PhoneOff,
  Calendar,
  DollarSign,
  Search,
  ArrowRightLeft,
  GraduationCap,
  UserCheck,
  Headphones,
  Mic,
  BookOpen,
  ShoppingBag,
  Stethoscope,
  Ticket,
  Phone,
  Plus,
  Minus,
  Maximize2,
  type LucideIcon,
} from "lucide-react";
import type {
  WorkflowEdge,
  WorkflowIcon,
  WorkflowNode,
} from "@/lib/agent-templates";
import { cn } from "@/lib/utils";

const ICONS: Record<WorkflowIcon, LucideIcon> = {
  flag: Flag,
  message: MessageCircle,
  help: HelpCircle,
  wrench: Wrench,
  card: CreditCard,
  check: CheckCircle2,
  hangup: PhoneOff,
  calendar: Calendar,
  dollar: DollarSign,
  search: Search,
  transfer: ArrowRightLeft,
  graduate: GraduationCap,
  userCheck: UserCheck,
  headphones: Headphones,
  mic: Mic,
  menu: BookOpen,
  shopping: ShoppingBag,
  stethoscope: Stethoscope,
  ticket: Ticket,
  phone: Phone,
};

// =============================================================
// Coordinate helpers
// =============================================================

const VB_WIDTH = 900;
const COL_X = [220, 450, 680];
const ROW_HEIGHT = 130;
const TOP_PAD = 50;
const NODE_HALF_WIDTH = 105;
const NODE_HALF_HEIGHT = 38;

const MIN_SCALE = 0.5;
const MAX_SCALE = 1.75;
const ZOOM_STEP = 1.2;

type NodeCenter = { x: number; y: number };

function nodeCenter(node: WorkflowNode): NodeCenter {
  return { x: COL_X[node.col], y: TOP_PAD + node.row * ROW_HEIGHT };
}

function edgePath(a: NodeCenter, b: NodeCenter): string {
  const startX = a.x;
  const startY = a.y + NODE_HALF_HEIGHT;
  const endX = b.x;
  const endY = b.y - NODE_HALF_HEIGHT;
  const midY = (startY + endY) / 2;
  return `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
}

function edgeMidpoint(a: NodeCenter, b: NodeCenter): NodeCenter {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + NODE_HALF_HEIGHT + b.y - NODE_HALF_HEIGHT) / 2,
  };
}

// =============================================================
// Main graph (pannable + zoomable wrapper)
// =============================================================

export function WorkflowGraph({
  nodes,
  edges,
}: {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const maxRow = nodes.reduce((m, n) => Math.max(m, n.row), 0);
  const vbHeight = TOP_PAD + maxRow * ROW_HEIGHT + 60;

  const nodeMap = useMemo(() => {
    const m = new Map<string, WorkflowNode>();
    nodes.forEach((n) => m.set(n.id, n));
    return m;
  }, [nodes]);

  const zoomIn  = () => setScale((s) => Math.min(MAX_SCALE, +(s * ZOOM_STEP).toFixed(2)));
  const zoomOut = () => setScale((s) => Math.max(MIN_SCALE, +(s / ZOOM_STEP).toFixed(2)));
  const fitToView = () => {
    animate(x, 0, { duration: 0.3, ease: [0.2, 0.65, 0.3, 0.9] });
    animate(y, 0, { duration: 0.3, ease: [0.2, 0.65, 0.3, 0.9] });
    setScale(1);
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-3xl select-none">
      {/* Static dotted background — does not pan, gives a fixed-window feel */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60 pointer-events-none"
        aria-hidden="true"
      />

      {/* Draggable layer holds the SVG. Anything in here pans + scales. */}
      <motion.div
        className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
        drag
        dragMomentum={false}
        dragElastic={0}
        style={{ x, y, scale }}
      >
        <svg
          viewBox={`0 0 ${VB_WIDTH} ${vbHeight}`}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMin meet"
          className="block pointer-events-auto"
        >
          {/* Edges */}
          <g>
            {edges.map((edge, i) => {
              const from = nodeMap.get(edge.from);
              const to = nodeMap.get(edge.to);
              if (!from || !to) return null;
              const a = nodeCenter(from);
              const b = nodeCenter(to);
              const path = edgePath(a, b);
              const mid = edgeMidpoint(a, b);

              const isActiveEdge =
                hoveredId && (edge.from === hoveredId || edge.to === hoveredId);

              return (
                <g key={i}>
                  <motion.path
                    d={path}
                    stroke={isActiveEdge ? "#0a0a0a" : "#d4d4d4"}
                    strokeWidth={isActiveEdge ? 1.5 : 1.2}
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                  />
                  {edge.label && (
                    <EdgeLabel
                      x={mid.x}
                      y={mid.y}
                      text={edge.label}
                      delay={i * 0.05 + 0.3}
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* Nodes */}
          <g>
            {nodes.map((node, i) => {
              const c = nodeCenter(node);
              return (
                <WorkflowNodeCard
                  key={node.id}
                  node={node}
                  centerX={c.x}
                  centerY={c.y}
                  index={i}
                  onHoverStart={() => setHoveredId(node.id)}
                  onHoverEnd={() => setHoveredId(null)}
                />
              );
            })}
          </g>
        </svg>
      </motion.div>

      {/* Zoom controls (bottom right) */}
      <CanvasControls
        scale={scale}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFit={fitToView}
      />

      {/* Subtle pan hint (top left), fades after first interaction */}
      <PanHint />
    </div>
  );
}

// =============================================================
// Pan hint — small text in the corner
// =============================================================

function PanHint() {
  return (
    <div className="pointer-events-none absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 text-[10px] font-medium text-neutral-500">
      <span className="size-1 rounded-full bg-neutral-400" />
      Drag empty space to pan
    </div>
  );
}

// =============================================================
// Zoom controls
// =============================================================

function CanvasControls({
  scale,
  onZoomIn,
  onZoomOut,
  onFit,
}: {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
}) {
  return (
    <div className="absolute bottom-3 right-3 flex items-center gap-0.5 rounded-full bg-white border border-neutral-200 shadow-sm p-1">
      <button
        onClick={onZoomOut}
        aria-label="Zoom out"
        className="size-7 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
        disabled={scale <= MIN_SCALE + 0.001}
      >
        <Minus className="size-3.5" />
      </button>
      <div className="px-2 text-[11px] font-mono text-neutral-700 tabular-nums w-12 text-center">
        {Math.round(scale * 100)}%
      </div>
      <button
        onClick={onZoomIn}
        aria-label="Zoom in"
        className="size-7 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
        disabled={scale >= MAX_SCALE - 0.001}
      >
        <Plus className="size-3.5" />
      </button>
      <span className="mx-1 w-px h-4 bg-neutral-200" />
      <button
        onClick={onFit}
        aria-label="Fit to view"
        className="h-7 px-2 rounded-full hover:bg-neutral-100 flex items-center gap-1 text-neutral-700 transition-colors text-[11px] font-medium"
      >
        <Maximize2 className="size-3" />
        Fit
      </button>
    </div>
  );
}

// =============================================================
// Edge label
// =============================================================

function EdgeLabel({
  x,
  y,
  text,
  delay,
}: {
  x: number;
  y: number;
  text: string;
  delay: number;
}) {
  const display = text.length > 40 ? text.slice(0, 39) + "..." : text;
  const width = Math.min(280, display.length * 6.4 + 20);
  return (
    <motion.g
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <rect
        x={x - width / 2}
        y={y - 11}
        width={width}
        height={22}
        rx={11}
        fill="#0a0a0a"
      />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fontSize={10.5}
        fontFamily="var(--font-geist-sans), system-ui"
        fill="white"
        fontWeight={500}
      >
        {display}
      </text>
    </motion.g>
  );
}

// =============================================================
// Workflow node (rendered as foreignObject so we can use HTML / Tailwind)
// =============================================================

function WorkflowNodeCard({
  node,
  centerX,
  centerY,
  index,
  onHoverStart,
  onHoverEnd,
}: {
  node: WorkflowNode;
  centerX: number;
  centerY: number;
  index: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const Icon = ICONS[node.icon];
  const isMarker = node.kind === "start" || node.kind === "end";
  const width = isMarker ? 100 : NODE_HALF_WIDTH * 2;
  const height = isMarker ? 36 : NODE_HALF_HEIGHT * 2;
  const x = centerX - width / 2;
  const y = centerY - height / 2;

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      style={{ overflow: "visible" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 + index * 0.04 }}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        className={cn(
          "rounded-xl bg-white border shadow-sm transition-all duration-200",
          isMarker
            ? "border-neutral-200 px-3 py-1.5 flex items-center gap-1.5 justify-center cursor-default"
            : "border-neutral-200 px-3 py-2.5 hover:shadow-md hover:border-neutral-300 cursor-default"
        )}
        style={{ width, height }}
      >
        {isMarker ? (
          <>
            <Icon className="size-3.5 text-neutral-600" />
            <span className="text-[12px] font-semibold tracking-tight">
              {node.title}
            </span>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-0.5">
              <Icon className="size-3.5 text-neutral-700 shrink-0" />
              <span className="text-[12.5px] font-semibold tracking-tight truncate">
                {node.title}
              </span>
            </div>
            {node.description && (
              <p className="text-[10.5px] text-neutral-500 leading-tight line-clamp-2">
                {node.description}
              </p>
            )}
            {node.extras !== undefined && (
              <div className="absolute -bottom-2 left-3 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white border border-neutral-200 text-[9px] font-mono text-neutral-600">
                <span className="size-1 rounded-full bg-neutral-400" />
                +{node.extras}
              </div>
            )}
          </>
        )}
      </motion.div>
    </foreignObject>
  );
}
