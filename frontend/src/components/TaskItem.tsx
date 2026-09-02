import type { Task } from "../lib/api";

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
    <li className="flex items-center gap-3 rounded-xl bg-slate-800/60 px-4 py-3">
      <button
        onClick={() => onToggle(task.id)}
        aria-label={task.done ? "Bajarilmagan deb belgilash" : "Bajarilgan deb belgilash"}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          task.done ? "border-green-500 bg-green-500" : "border-slate-500"
        }`}
      >
        {task.done && (
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-900" fill="none">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p className={`truncate text-base ${task.done ? "text-slate-500 line-through" : "text-white"}`}>
          {task.title}
        </p>
        {task.time && <p className="text-xs text-slate-400">{task.time}</p>}
      </div>

      <button
        onClick={() => onDelete(task.id)}
        aria-label="Vazifani o'chirish"
        className="shrink-0 rounded-full p-2 text-slate-500 hover:text-red-400"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </li>
  );
}
