interface Props {
  size?: number;
  className?: string;
}

export function NeonOrb({ size = 168, className = "" }: Props) {
  return (
    <div
      className={`neon-orb-scene neon-orb-float ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
        <div
          className="neon-orb-ring absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, var(--neon-red-bright), var(--neon-red-deep), #14040a, var(--neon-red-bright))",
            WebkitMaskImage:
              "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
            maskImage:
              "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
            filter: "drop-shadow(0 0 10px rgba(255,36,64,0.8))",
          }}
        />
        <div
          className="neon-orb-ring-alt absolute inset-[14%] rounded-full"
          style={{
            background:
              "conic-gradient(from 90deg, var(--neon-red-deep), var(--neon-red-bright), #14040a, var(--neon-red-deep))",
            WebkitMaskImage:
              "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
            maskImage:
              "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
            filter: "drop-shadow(0 0 10px rgba(110,11,24,0.85))",
          }}
        />
        <div
          className="neon-orb-core absolute inset-[36%] rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 30%, #ffffff, var(--neon-red) 45%, var(--neon-red-deep) 85%)",
            boxShadow: "0 0 24px 6px rgba(255,36,64,0.6), 0 0 50px 12px rgba(110,11,24,0.4)",
          }}
        />
      </div>
    </div>
  );
}
