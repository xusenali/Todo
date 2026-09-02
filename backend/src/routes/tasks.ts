import { Router } from "express";
import { prisma } from "../prisma.js";
import type { AuthedRequest } from "../middleware/auth.js";

export const tasksRouter = Router();

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseDate(raw: unknown): string | null {
  if (typeof raw !== "string" || !DATE_RE.test(raw)) return null;
  return raw;
}

// GET /api/tasks?date=YYYY-MM-DD  -> vazifalar ro'yxati + shu kunga oid bajarilganlik holati
tasksRouter.get("/", async (req: AuthedRequest, res) => {
  const date = parseDate(req.query.date);
  if (!date) return res.status(400).json({ error: "date=YYYY-MM-DD kerak" });

  const tasks = await prisma.task.findMany({
    where: { userId: req.userId },
    orderBy: { order: "asc" },
    include: { completions: { where: { date } } },
  });

  const result = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    time: t.time,
    order: t.order,
    createdAt: t.createdAt,
    done: t.completions[0]?.done ?? false,
  }));

  res.json(result);
});

const MONTH_RE = /^\d{4}-\d{2}$/;

// GET /api/tasks/month?month=YYYY-MM -> vazifalar + shu oyning har kuni uchun bajarilganlik xaritasi
tasksRouter.get("/month", async (req: AuthedRequest, res) => {
  const month = req.query.month;
  if (typeof month !== "string" || !MONTH_RE.test(month)) {
    return res.status(400).json({ error: "month=YYYY-MM kerak" });
  }

  const [year, mon] = month.split("-").map(Number);
  const daysInMonth = new Date(year, mon, 0).getDate();
  const monthStart = `${month}-01`;
  const monthEnd = `${month}-${String(daysInMonth).padStart(2, "0")}`;

  const tasks = await prisma.task.findMany({
    where: { userId: req.userId },
    orderBy: { order: "asc" },
    include: { completions: { where: { date: { gte: monthStart, lte: monthEnd } } } },
  });

  const result = tasks.map((t) => {
    const completions: Record<string, boolean> = {};
    for (const c of t.completions) completions[c.date] = c.done;
    return {
      id: t.id,
      title: t.title,
      time: t.time,
      order: t.order,
      createdAt: t.createdAt,
      completions,
    };
  });

  res.json(result);
});

// POST /api/tasks  { title, time? }
tasksRouter.post("/", async (req: AuthedRequest, res) => {
  const { title, time } = req.body as { title?: string; time?: string };
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "title bo'sh bo'lishi mumkin emas" });
  }

  const last = await prisma.task.findFirst({
    where: { userId: req.userId },
    orderBy: { order: "desc" },
  });

  const task = await prisma.task.create({
    data: {
      userId: req.userId as number,
      title: title.trim(),
      time: time || null,
      order: (last?.order ?? -1) + 1,
    },
  });

  res.status(201).json({ ...task, done: false });
});

// PATCH /api/tasks/:id  { title?, time? }
tasksRouter.patch("/:id", async (req: AuthedRequest, res) => {
  const { id } = req.params;
  const { title, time } = req.body as { title?: string; time?: string };

  const existing = await prisma.task.findFirst({ where: { id, userId: req.userId } });
  if (!existing) return res.status(404).json({ error: "Vazifa topilmadi" });

  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title: title.trim() } : {}),
      ...(time !== undefined ? { time: time || null } : {}),
    },
  });

  res.json(task);
});

// DELETE /api/tasks/:id
tasksRouter.delete("/:id", async (req: AuthedRequest, res) => {
  const { id } = req.params;

  const existing = await prisma.task.findFirst({ where: { id, userId: req.userId } });
  if (!existing) return res.status(404).json({ error: "Vazifa topilmadi" });

  await prisma.task.delete({ where: { id } });
  res.status(204).send();
});

// POST /api/tasks/:id/toggle  { date: "YYYY-MM-DD" }
tasksRouter.post("/:id/toggle", async (req: AuthedRequest, res) => {
  const { id } = req.params;
  const date = parseDate((req.body as { date?: string }).date);
  if (!date) return res.status(400).json({ error: "date=YYYY-MM-DD kerak" });

  const task = await prisma.task.findFirst({ where: { id, userId: req.userId } });
  if (!task) return res.status(404).json({ error: "Vazifa topilmadi" });

  const existing = await prisma.dailyCompletion.findUnique({
    where: { taskId_date: { taskId: id, date } },
  });

  let done: boolean;
  if (existing) {
    done = !existing.done;
    await prisma.dailyCompletion.update({
      where: { taskId_date: { taskId: id, date } },
      data: { done },
    });
  } else {
    done = true;
    await prisma.dailyCompletion.create({ data: { taskId: id, date, done } });
  }

  res.json({ id, date, done });
});
