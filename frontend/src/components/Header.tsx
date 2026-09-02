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
          <h1 className="text-xl font-semibold text-white">Kunlik reja</h1>
          <p className="text-sm text-slate-400 capitalize">{formatDateHuman(dateKey)}</p>
        </div>
        {user && (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1.5 text-sm text-slate-200"
          >
            {user.photoUrl && (
              <img src={user.photoUrl} alt="" className="h-6 w-6 rounded-full" />
            )}
            <span>{user.firstName}</span>
          </button>
        )}
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-sm text-slate-400">
          <span>Bugungi progress</span>
          <span>
            {done}/{total}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </header>
  );
}
