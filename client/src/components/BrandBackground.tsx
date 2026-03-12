const dbsStar = new URL("../../assets/dbs-star.png", import.meta.url).href;

interface BrandBackgroundProps {
  className?: string;
  variant?: "mobile" | "tv";
}

export function BrandBackground({
  className = "",
  variant = "mobile"
}: BrandBackgroundProps) {
  return (
    <>
      <div
        className={[
          "pointer-events-none absolute inset-0",
          "bg-[linear-gradient(rgba(202,54,49,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(202,54,49,0.12)_1px,transparent_1px)]",
          "bg-[size:50px_50px]",
          className
        ].join(" ")}
      />

      <img
        src={dbsStar}
        alt=""
        aria-hidden="true"
        className={[
          "pointer-events-none absolute select-none opacity-15",
          variant === "tv"
            ? "-bottom-20 -left-24 w-[520px]"
            : "-bottom-24 right-[-84px] w-[333px]"
        ].join(" ")}
      />
    </>
  );
}
