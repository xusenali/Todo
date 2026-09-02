import { useCallback, useEffect, useMemo, useState } from "react";
import { AddTaskForm } from "./components/AddTaskForm";
import { BackgroundMusic } from "./components/BackgroundMusic";
import { BloodDrip } from "./components/BloodDrip";
import { Dashboard } from "./components/Dashboard";
import { GoogleLoginButton } from "./components/GoogleLoginButton";
import { Header } from "./components/Header";
import { MonthGrid } from "./components/MonthGrid";
import { NeonOrb } from "./components/NeonOrb";
import { TabBar, type TabKey } from "./components/TabBar";
import { TaskList } from "./components/TaskList";
import {
  clearSession,
  createTask,
  deleteTask,
  fetchTasksMonth,
  getStoredUser,
  getToken,
  loginWithGoogle,
  toggleTask,
  type AuthUser,
  type MonthTask,
} from "./lib/api";
import { getMonthKey, getTodayKey, shiftMonth } from "./lib/date";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [todayKey, setTodayKey] = useState(() => getTodayKey());
  const [currentMonthKey, setCurrentMonthKey] = useState(() => getMonthKey());
  const [monthTasks, setMonthTasks] = useState<MonthTask[]>([]);
  const [viewMonth, setViewMonth] = useState(currentMonthKey);
  const [viewMonthTasks, setViewMonthTasks] = useState<MonthTask[]>([]);
  const [tab, setTab] = useState<TabKey>("today");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthed = Boolean(user && getToken());

  const loadCurrentMonth = useCallback(async (month: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTasksMonth(month);
      setMonthTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthed) loadCurrentMonth(currentMonthKey);
  }, [isAuthed, currentMonthKey, loadCurrentMonth]);

  // Ko'rilayotgan oy joriy oy bilan bir xil bo'lsa, alohida so'rov yubormay shu ma'lumotdan foydalanamiz.
  useEffect(() => {
    if (!isAuthed) return;
    if (viewMonth === currentMonthKey) {
      setViewMonthTasks(monthTasks);
      return;
    }
    let cancelled = false;
    fetchTasksMonth(viewMonth)
      .then((data) => {
        if (!cancelled) setViewMonthTasks(data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Xatolik yuz berdi"));
    return () => {
      cancelled = true;
    };
  }, [isAuthed, viewMonth, currentMonthKey, monthTasks]);

  // Sahifa ochiq turgan holda yarim tundan o'tib ketsa, sana/oyni yangilash.
  useEffect(() => {
    const interval = setInterval(() => {
      const nowKey = getTodayKey();
      const nowMonth = getMonthKey();
      setTodayKey((prev) => (prev === nowKey ? prev : nowKey));
      setCurrentMonthKey((prev) => (prev === nowMonth ? prev : nowMonth));
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
    setMonthTasks([]);
  }

  async function handleAdd(title: string, time?: string) {
    try {
      const task = await createTask(title, time);
      setMonthTasks((prev) => [...prev, { ...task, completions: {} }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Vazifa qo'shilmadi");
    }
  }

  async function handleToggleToday(id: string) {
    setMonthTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completions: { ...t.completions, [todayKey]: !t.completions[todayKey] } }
          : t
      )
    );
    try {
      await toggleTask(id, todayKey);
    } catch (err) {
      setMonthTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, completions: { ...t.completions, [todayKey]: !t.completions[todayKey] } }
            : t
        )
      );
      setError(err instanceof Error ? err.message : "Holatni o'zgartirib bo'lmadi");
    }
  }

  async function handleDelete(id: string) {
    const prev = monthTasks;
    setMonthTasks((p) => p.filter((t) => t.id !== id));
    try {
      await deleteTask(id);
    } catch (err) {
      setMonthTasks(prev);
      setError(err instanceof Error ? err.message : "O'chirib bo'lmadi");
    }
  }

  const todayTasks = useMemo(
    () =>
      monthTasks.map((t) => ({
        id: t.id,
        title: t.title,
        time: t.time,
        order: t.order,
        createdAt: t.createdAt,
        done: t.completions[todayKey] === true,
      })),
    [monthTasks, todayKey]
  );

  const progress = useMemo(() => {
    const done = todayTasks.filter((t) => t.done).length;
    return { done, total: todayTasks.length };
  }, [todayTasks]);

  if (!isAuthed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <BackgroundMusic />
        <NeonOrb />
        <div className="relative">
          <BloodDrip className="absolute left-1/2 top-full h-16 w-24 -translate-x-1/2" count={3} />
          <h1 className="text-3xl font-semibold text-white neon-text text-red-400">Kunlik reja</h1>
          <p className="mt-2 text-slate-400">Davom etish uchun kiring</p>
        </div>
        {GOOGLE_CLIENT_ID ? (
          <div className="rounded-2xl bg-slate-900/60 p-3 neon-border backdrop-blur">
            <GoogleLoginButton clientId={GOOGLE_CLIENT_ID} onCredential={handleGoogleAuth} />
          </div>
        ) : (
          <p className="text-sm text-red-400">VITE_GOOGLE_CLIENT_ID sozlanmagan</p>
        )}
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <BackgroundMusic />
      <Header dateKey={todayKey} done={progress.done} total={progress.total} user={user} onLogout={handleLogout} />
      <TabBar active={tab} onChange={setTab} />

      {error && (
        <p className="mx-4 mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
      )}

      <main className="px-4">
        {loading ? (
          <p className="py-10 text-center text-slate-500">Yuklanmoqda...</p>
        ) : tab === "today" ? (
          <TaskList tasks={todayTasks} onToggle={handleToggleToday} onDelete={handleDelete} />
        ) : tab === "grid" ? (
          <MonthGrid
            monthKey={viewMonth}
            tasks={viewMonthTasks}
            onNavigate={(delta) => setViewMonth((m) => shiftMonth(m, delta))}
            onToggleToday={handleToggleToday}
          />
        ) : (
          <Dashboard monthKey={currentMonthKey} tasks={monthTasks} />
        )}
      </main>

      {tab === "today" && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-red-500/20 bg-slate-950/90 backdrop-blur">
          <AddTaskForm onAdd={handleAdd} />
        </div>
      )}
    </div>
  );
}
