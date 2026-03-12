const dbsLogoMark = new URL(
  "../../assets/DBS-Bank-Logo-1.svg",
  import.meta.url
).href;
const dbsLogoTagline = new URL("../../assets/dbs-tagline.png", import.meta.url)
  .href;

interface DBSLogoProps {
  compact?: boolean;
  showTagline?: boolean;
  className?: string;
}

export function DBSLogo({
  compact = false,
  showTagline = false,
  className = ""
}: DBSLogoProps) {
  if (showTagline) {
    return (
      <img
        src={dbsLogoTagline}
        alt="DBS — Live more, Bank less"
        className={["h-auto w-[182px]", className].join(" ")}
      />
    );
  }

  return (
    <img
      src={dbsLogoMark}
      alt="DBS logo"
      className={[
        "h-auto object-contain",
        compact ? "w-10" : "w-[52px]",
        className
      ].join(" ")}
    />
  );
}
