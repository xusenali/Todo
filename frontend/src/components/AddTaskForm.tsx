import { useState } from "react";
import type { FormEvent } from "react";

interface Props {
  onAdd: (title: string, time?: string) => void;
}

export function AddTaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, time || undefined);
    setTitle("");
    setTime("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 px-4 py-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Yangi vazifa..."
        className="min-w-0 flex-1 rounded-xl bg-slate-800 px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-28 rounded-xl bg-slate-800 px-2 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        type="submit"
        disabled={!title.trim()}
        className="rounded-xl bg-green-500 px-4 py-2.5 font-medium text-slate-900 disabled:opacity-40"
      >
        Qo'shish
      </button>
    </form>
  );
}
