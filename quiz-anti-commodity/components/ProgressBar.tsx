type Props = {
  current: number;
  total: number;
};

export default function ProgressBar({ current, total }: Props) {
  const safeTotal = Math.max(total, 1);
  const percent = Math.min(100, Math.round((current / safeTotal) * 100));
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-brand-mute">
        <span>{`Pergunta ${current} de ${total}`}</span>
        <span>{`${percent}%`}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-brand-soft">
        <div
          className="h-full rounded-full bg-brand-accent transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
