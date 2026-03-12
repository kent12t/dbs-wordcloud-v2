interface BrandBackgroundProps {
  className?: string;
}

export function BrandBackground({ className = "" }: BrandBackgroundProps) {
  return (
    <>
      <div
        className={[
          "pointer-events-none absolute inset-0",
          "bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]",
          "bg-[size:50px_50px]",
          className
        ].join(" ")}
      />
      <div className="pointer-events-none absolute -bottom-24 -right-8 select-none text-[360px] font-black leading-none text-white/12">
        ✦
      </div>
      <div className="pointer-events-none absolute -left-24 bottom-12 hidden select-none text-[320px] font-black leading-none text-white/10 lg:block">
        ✦
      </div>
    </>
  );
}
