# Kunlik reja

Har kungi vazifalarni kuzatish uchun habit-tracker ilova. TZ: [kunlik-reja-TZ.md](kunlik-reja-TZ.md)

- **frontend/** — React + Vite + Tailwind, PWA (telefon menyusiga/bosh ekranga qo'shiladi)
- **backend/** — Node.js + Express + Prisma + PostgreSQL, Google Login orqali autentifikatsiya

## Ishga tushirish

### 1. Ma'lumotlar bazasi (onlayn Postgres)

Local kompyuterda saqlanmaydi — bepul onlayn Postgres kerak, masalan [Neon](https://neon.tech) yoki [Supabase](https://supabase.com):

1. Neon'da bepul akkaunt oching, yangi loyiha yarating.
2. "Connection string" (`postgresql://...`) ni nusxalang.
3. `backend/.env` dagi `DATABASE_URL` ga shu qatorni qo'ying.

(Local sinash uchun `docker compose up -d` bilan ham Postgres ko'tarish mumkin, lekin production uchun onlayn baza tavsiya etiladi.)

### 2. Backend

```
cd backend
cp .env.example .env   # DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID ni to'ldiring
npm install
npm run prisma:migrate   # DB jadvallarini yaratadi
npm run dev               # http://localhost:4000
```

### 3. Frontend

```
cd frontend
cp .env.example .env   # VITE_API_URL, VITE_GOOGLE_CLIENT_ID ni to'ldiring
npm install
npm run dev               # http://localhost:5173
```

## Google Login sozlash

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) da OAuth 2.0 Client ID (Web application) yarating.
2. "Authorized JavaScript origins" ga frontend domenini qo'shing (masalan `http://localhost:5173` va production domeningiz).
3. Client ID ni `backend/.env` (`GOOGLE_CLIENT_ID`) va `frontend/.env` (`VITE_GOOGLE_CLIENT_ID`) ga qo'ying.

## Deploy (joriy holat)

- **Frontend** — Vercel: https://todo-7eq8.vercel.app (GitHub `main` branchiga push qilinganda avtomatik qayta deploy bo'ladi)
- **Backend** — Render.com (bepul tarif, karta talab qilmaydi): https://kunlik-reja-backend.onrender.com — GitHub repo ulangan, `rootDir: backend`, environment variable'lar (`DATABASE_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `CORS_ORIGIN`) Render dashboardida sozlangan
- **Ma'lumotlar bazasi** — Neon Postgres (bepul tarif)

⚠️ Render'ning bepul tarifi 15 daqiqa foydalanilmasa servisni "uxlatadi" — keyingi so'rovda birinchi javob ~30-50 soniya sekinroq keladi, keyin normal tezlikda ishlaydi. Bu ma'lumot yo'qolishiga olib kelmaydi, faqat vaqtinchalik sekinlik.

Backend manzili o'zgarsa, Vercel loyihasidagi `VITE_API_URL` environment variable'ni yangilab, qayta deploy qilish kerak.

## Telefon menyusiga qo'shish (PWA)

Production hostingga (HTTPS bilan) joylashtirilgach, telefon brauzerida ilovani ochib "Bosh ekranga qo'shish" (Add to Home Screen) qilinsa, ikonka bilan alohida ilova sifatida ochiladi.
