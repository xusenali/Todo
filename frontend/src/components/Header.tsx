import type { AuthUser } from "../lib/api";
import { formatDateHuman } from "../lib/date";

interface Props {
  dateKey: string;
  done: number;
  total: number;
  user: AuthUser | null;
  onLogout: () => void;
}

export function Header({ dateKey, done, total, user, onLogout }: Props) {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <header className="flex flex-col gap-3 px-4 pt-6 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-terminator text-lg text-white neon-text text-red-400">Kunlik reja</h1>
          <p className="text-sm text-neutral-400 capitalize">{formatDateHuman(dateKey)}</p>
        </div>
        {user && (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-full bg-neutral-800/80 px-3 py-1.5 text-sm text-neutral-200 ring-1 ring-red-500/20 hover:ring-red-400/50"
          >
            {user.photoUrl && (
              <img src={user.photoUrl} alt="" className="h-6 w-6 rounded-full" />
            )}
            <span>{user.firstName}</span>
          </button>
        )}
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-sm text-neutral-400">
          <span>Bugungi progress</span>
          <span>
            {done}/{total}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
          <div
            className="neon-glow-cyan h-full rounded-full transition-all"
            style={{
              width: `${percent}%`,
              background: "linear-gradient(90deg, var(--neon-red-deep), var(--neon-red))",
            }}
          />
        </div>
      </div>
    </header>
  );
}
