import type { ResultProfile } from "@/lib/quiz-data";

type Props = {
  score: number;
  tone: ResultProfile["tone"];
  min?: number;
  max?: number;
};

const TONE_HEX: Record<ResultProfile["tone"], string> = {
  danger: "#EF5A5A",
  warn: "#FF6600",
  info: "#5B9DFF",
  good: "#39D08E",
};

const TICKS = [7, 12, 18, 24, 28];

export default function Thermometer({
  score,
  tone,
  min = 7,
  max = 28,
}: Props) {
  const clamped = Math.min(Math.max(score, min), max);
  const ratio = (clamped - min) / (max - min);

  const trackTop = 24;
  const trackBottom = 268;
  const trackHeight = trackBottom - trackTop;
  const markerY = trackBottom - ratio * trackHeight;

  const color = TONE_HEX[tone];

  return (
    <div className="flex w-full justify-center">
      <svg
        viewBox="0 0 220 300"
        width="220"
        height="300"
        role="img"
        aria-label={`Termômetro indicando ${score} de ${max} pontos`}
        className="drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
      >
        <defs>
          <linearGradient id="thermo-track" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#39D08E" />
            <stop offset="33%" stopColor="#5B9DFF" />
            <stop offset="66%" stopColor="#FF6600" />
            <stop offset="100%" stopColor="#EF5A5A" />
          </linearGradient>
          <radialGradient id="thermo-marker" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="60%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <filter id="thermo-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          x="100"
          y={trackTop}
          width="20"
          height={trackHeight}
          rx="10"
          fill="#0A1024"
          stroke="#26305A"
          strokeWidth="1"
        />

        <rect
          x="103"
          y={trackTop + 3}
          width="14"
          height={trackHeight - 6}
          rx="7"
          fill="url(#thermo-track)"
          opacity="0.85"
        />

        {TICKS.map((tick) => {
          const tickRatio = (tick - min) / (max - min);
          const y = trackBottom - tickRatio * trackHeight;
          return (
            <g key={tick}>
              <line
                x1="128"
                y1={y}
                x2="138"
                y2={y}
                stroke="#7A8499"
                strokeWidth="1"
              />
              <text
                x="146"
                y={y + 4}
                fontFamily="var(--font-sans), sans-serif"
                fontSize="11"
                fill="#C6CCDC"
                fontWeight="500"
              >
                {tick}
              </text>
            </g>
          );
        })}

        <circle
          cx="110"
          cy={markerY}
          r="28"
          fill="url(#thermo-marker)"
        />

        <line
          x1="60"
          y1={markerY}
          x2="92"
          y2={markerY}
          stroke={color}
          strokeWidth="2"
        />

        <circle
          cx="110"
          cy={markerY}
          r="10"
          fill={color}
          stroke="#F5F1E8"
          strokeWidth="2.5"
          filter="url(#thermo-glow)"
        />

        <text
          x="55"
          y={markerY - 8}
          textAnchor="end"
          fontFamily="var(--font-serif), serif"
          fontSize="32"
          fontWeight="700"
          fill="#F5F1E8"
        >
          {clamped}
        </text>
        <text
          x="55"
          y={markerY + 12}
          textAnchor="end"
          fontFamily="var(--font-sans), sans-serif"
          fontSize="11"
          fill="#7A8499"
          letterSpacing="2"
        >
          DE {max}
        </text>
      </svg>
    </div>
  );
}
