export default function BrandHeader() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          aria-hidden
          className="h-8 w-8 rounded-2xl"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #172145 0%, #26305A 55%, #FF6600 140%)",
          }}
        />
        <p className="text-sm font-semibold tracking-tight text-night-ink">
          Termômetro Anti-Commodity
        </p>
      </div>
      <span className="pill">Consultor 10K</span>
    </header>
  );
}
