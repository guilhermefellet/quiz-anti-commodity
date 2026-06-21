type Props = {
  current: number;
  total: number;
};

export default function ProgressBar({ current, total }: Props) {
  const safeTotal = Math.max(total, 1);
  const percent = Math.min(100, Math.round((current / safeTotal) * 100));
  return (
    <div className="mb-6">
      <div className="mb-3 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-kicker text-night-mute">
          {`Diagnóstico ${current} / ${total}`}
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-night-line">
        <div
          className="h-full rounded-full bg-brand-accent transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
