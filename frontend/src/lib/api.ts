const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export interface Task {
  id: string;
  title: string;
  time: string | null;
  order: number;
  createdAt: string;
  done: boolean;
}

export interface AuthUser {
  id: number;
  firstName: string;
  lastName?: string | null;
  username?: string | null;
  photoUrl?: string | null;
}

const TOKEN_KEY = "kunlik-reja-token";
const USER_KEY = "kunlik-reja-user";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `So'rov xato: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function loginWithGoogle(
  credential: string
): Promise<{ token: string; user: AuthUser }> {
  const result = await request<{ token: string; user: AuthUser }>("/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  });
  localStorage.setItem(TOKEN_KEY, result.token);
  localStorage.setItem(USER_KEY, JSON.stringify(result.user));
  return result;
}

export function fetchTasks(date: string): Promise<Task[]> {
  return request<Task[]>(`/tasks?date=${date}`);
}

export function createTask(title: string, time?: string): Promise<Task> {
  return request<Task>("/tasks", { method: "POST", body: JSON.stringify({ title, time }) });
}

export function deleteTask(id: string): Promise<void> {
  return request<void>(`/tasks/${id}`, { method: "DELETE" });
}

export function toggleTask(id: string, date: string): Promise<{ id: string; date: string; done: boolean }> {
  return request(`/tasks/${id}/toggle`, { method: "POST", body: JSON.stringify({ date }) });
}
