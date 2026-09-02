interface Props {
  className?: string;
  count?: number;
}

// Juda nozik, kam sonli tomchi aksenti — bezak sifatida, ko'zga tashlanib
// ketmasligi uchun oz miqdorda va past intensivlikda ishlatiladi.
export function BloodDrip({ className = "", count = 3 }: Props) {
  const drops = Array.from({ length: count }, (_, i) => i);

  return (
    <div className={`drip-track pointer-events-none ${className}`} aria-hidden="true">
      {drops.map((i) => (
        <span
          key={i}
          className="drip"
          style={{
            left: `${(i / Math.max(count - 1, 1)) * 90 + 4}%`,
            animationDelay: `${i * 1.1}s`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}
