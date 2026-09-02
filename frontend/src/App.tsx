import { useCallback, useEffect, useMemo, useState } from "react";
import { AddTaskForm } from "./components/AddTaskForm";
import { Header } from "./components/Header";
import { TaskList } from "./components/TaskList";
import { GoogleLoginButton } from "./components/GoogleLoginButton";
import {
  clearSession,
  createTask,
  deleteTask,
  fetchTasks,
  getStoredUser,
  getToken,
  loginWithGoogle,
  toggleTask,
  type AuthUser,
  type Task,
} from "./lib/api";
import { getTodayKey } from "./lib/date";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [dateKey, setDateKey] = useState(() => getTodayKey());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthed = Boolean(user && getToken());

  const loadTasks = useCallback(async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTasks(date);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthed) loadTasks(dateKey);
  }, [isAuthed, dateKey, loadTasks]);

  // Sahifa ochiq turgan holda yarim tundan o'tib ketsa, sanani yangilash.
  useEffect(() => {
    const interval = setInterval(() => {
      const current = getTodayKey();
      setDateKey((prev) => (prev === current ? prev : current));
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  async function handleGoogleAuth(credential: string) {
    try {
      setError(null);
      const result = await loginWithGoogle(credential);
      setUser(result.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kirishda xatolik");
    }
  }

  function handleLogout() {
    clearSession();
    setUser(null);
    setTasks([]);
  }

  async function handleAdd(title: string, time?: string) {
    try {
      const task = await createTask(title, time);
      setTasks((prev) => [...prev, task]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Vazifa qo'shilmadi");
    }
  }

  async function handleToggle(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    try {
      await toggleTask(id, dateKey);
    } catch (err) {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
      setError(err instanceof Error ? err.message : "Holatni o'zgartirib bo'lmadi");
    }
  }

  async function handleDelete(id: string) {
    const prevTasks = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTask(id);
    } catch (err) {
      setTasks(prevTasks);
      setError(err instanceof Error ? err.message : "O'chirib bo'lmadi");
    }
  }

  const progress = useMemo(() => {
    const done = tasks.filter((t) => t.done).length;
    return { done, total: tasks.length };
  }, [tasks]);

  if (!isAuthed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 px-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Kunlik reja</h1>
          <p className="mt-2 text-slate-400">Davom etish uchun kiring</p>
        </div>
        {GOOGLE_CLIENT_ID ? (
          <GoogleLoginButton clientId={GOOGLE_CLIENT_ID} onCredential={handleGoogleAuth} />
        ) : (
          <p className="text-sm text-red-400">VITE_GOOGLE_CLIENT_ID sozlanmagan</p>
        )}
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      <Header dateKey={dateKey} done={progress.done} total={progress.total} user={user} onLogout={handleLogout} />

      {error && (
        <p className="mx-4 mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
      )}

      <main className="px-4">
        {loading ? (
          <p className="py-10 text-center text-slate-500">Yuklanmoqda...</p>
        ) : (
          <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-950/95 backdrop-blur">
        <AddTaskForm onAdd={handleAdd} />
      </div>
    </div>
  );
}
