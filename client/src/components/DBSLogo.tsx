interface DBSLogoProps {
  compact?: boolean;
  showTagline?: boolean;
}

export function DBSLogo({ compact = false, showTagline = false }: DBSLogoProps) {
  return (
    <div className="inline-flex overflow-hidden border border-dbs-border/70">
      <div className="flex items-center gap-2 bg-[#1E1E1E] px-3 py-2">
        <div className="grid h-7 w-7 place-items-center rounded-sm bg-dbs-red text-sm text-white">
          ✦
        </div>
        <span className="font-serif text-4xl leading-none text-[#F4F4F4]">DBS</span>
      </div>
      {showTagline ? (
        <div className="bg-dbs-red px-3 py-2">
          <p className="text-sm font-medium leading-tight text-white">
            Live more,
            <br />
            Bank less
          </p>
        </div>
      ) : null}
      {!showTagline && !compact ? (
        <div className="bg-transparent px-3 py-2">
          <p className="text-xs uppercase tracking-[0.16em] text-dbs-muted">
            Live Poll
          </p>
          <p className="font-display text-sm text-dbs-text">
            DBS Global Financial Markets Event 2026
          </p>
        </div>
      ) : null}
    </div>
  );
}
