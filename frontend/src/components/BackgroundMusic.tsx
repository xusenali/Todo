import { useEffect, useRef, useState } from "react";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    function tryPlay() {
      audio?.play().catch(() => {
        // Brauzer avtoijro siyosati bloklagan bo'lsa, birinchi foydalanuvchi
        // harakatida (bosish/tegish/tugma) qayta urinamiz.
        const resume = () => {
          audio?.play().catch(() => {});
          window.removeEventListener("pointerdown", resume);
          window.removeEventListener("keydown", resume);
        };
        window.addEventListener("pointerdown", resume, { once: true });
        window.addEventListener("keydown", resume, { once: true });
      });
    }

    tryPlay();

    function handleVisibility() {
      if (!audio) return;
      if (document.visibilityState === "visible") {
        audio.currentTime = 0;
        tryPlay();
      } else {
        audio.pause();
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  }

  return (
    <>
      <audio ref={audioRef} src="/discipline.mp3" loop preload="auto" />
      <button
        onClick={toggleMute}
        aria-label={muted ? "Musiqani yoqish" : "Musiqani o'chirish"}
        className="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 text-slate-300 ring-1 ring-cyan-500/30 backdrop-blur neon-glow-cyan"
      >
        {muted ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path d="M11 5 6 9H3v6h3l5 4V5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M17 9l5 6M22 9l-5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path d="M11 5 6 9H3v6h3l5 4V5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </>
  );
}
