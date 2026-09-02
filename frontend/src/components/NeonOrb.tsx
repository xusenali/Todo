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
              "conic-gradient(from 0deg, var(--neon-cyan), var(--neon-violet), var(--neon-pink), var(--neon-cyan))",
            WebkitMaskImage:
              "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
            maskImage:
              "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
            filter: "drop-shadow(0 0 10px rgba(34,211,238,0.8))",
          }}
        />
        <div
          className="neon-orb-ring-alt absolute inset-[14%] rounded-full"
          style={{
            background:
              "conic-gradient(from 90deg, var(--neon-pink), var(--neon-cyan), var(--neon-violet), var(--neon-pink))",
            WebkitMaskImage:
              "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
            maskImage:
              "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
            filter: "drop-shadow(0 0 10px rgba(244,114,224,0.8))",
          }}
        />
        <div
          className="neon-orb-core absolute inset-[36%] rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 30%, #ffffff, var(--neon-cyan) 45%, var(--neon-violet) 85%)",
            boxShadow: "0 0 24px 6px rgba(34,211,238,0.65), 0 0 50px 12px rgba(168,85,247,0.35)",
          }}
        />
      </div>
    </div>
  );
}
