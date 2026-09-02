# Texnik topshiriq (TZ): "Kunlik reja" ilovasi

## 1. Umumiy g'oya

Foydalanuvchi o'zi bajarmoqchi bo'lgan ishlarni bir marta ro'yxat qilib kiritadi (masalan: "Sport", "Kitob o'qish", "Suv ichish"). Bu ro'yxat **doimiy** — har kuni qayta yozilmaydi. Har bir vazifa oldida checkbox bor. Foydalanuvchi bugun checkbox bosadi — bajarilgan bo'ladi. Ertaga sahifa ochilganda **xuddi shu vazifalar ro'yxati** turadi, lekin checkboxlar **bo'sh (belgilanmagan)** holatda bo'ladi. Ya'ni: **vazifalar ro'yxati statik/doimiy, checkbox holati kunga bog'liq (dinamik)**.

Bu — odatiy "habit tracker" mantiqi.

---

## 2. Funksional talablar

### 2.1 Vazifalar ro'yxati (Task List) — doimiy ma'lumot
- Foydalanuvchi yangi vazifa qo'shishi mumkin (matn, ixtiyoriy vaqt maydoni).
- Vazifani o'chirish mumkin.
- Vazifani tahrirlash mumkin (ixtiyoriy, v2 uchun).
- Vazifalar tartibini o'zgartirish — drag&drop (ixtiyoriy, v2).
- Bu ro'yxat **bir marta saqlanadi** va har kuni qayta ishlatiladi.

### 2.2 Kunlik bajarish holati (Daily Completion State) — kunga bog'liq ma'lumot
- Har bir kalendar kuni uchun **alohida** "bajarilgan/bajarilmagan" holat saqlanadi.
- Checkbox bosilganda — faqat **shu kunning** yozuvi o'zgaradi, vazifaning o'zi o'zgarmaydi.
- Yangi kun boshlanganda (localtime bo'yicha 00:00 dan keyin), barcha checkboxlar avtomatik bo'sh ko'rinadi — chunki yangi kun uchun hali yozuv yo'q.
- Eski kunlarning tarixi (masalan streak, statistika) saqlanib qolishi mumkin — buni keyinchalik "Tarix" bo'limida ko'rsatish mumkin (v2).

### 2.3 Progress
- Sahifa tepasida "bugun nechta vazifa bajarilgani" ko'rsatiladi (masalan 3/7).
- Progress bar.

---

## 3. Ma'lumotlar modeli (Data Model)

```ts
// Doimiy: vazifalar ro'yxati
interface Task {
  id: string;        // unikal id, masalan uuid
  title: string;      // "Sport qilish"
  time?: string;       // "07:00" — ixtiyoriy, tartiblash uchun
  createdAt: string;   // ISO sana
  order: number;       // tartib raqami
}

// Kunga bog'liq: bajarilganlik holati
// Kalit: "YYYY-MM-DD" formatidagi sana
interface DailyLog {
  [taskId: string]: boolean; // true = bajarilgan
}

// Saqlash strukturasi (masalan localStorage / DB):
// tasks: Task[]
// logs: { [date: string]: DailyLog }
```

**Muhim mantiq:** `logs["2026-09-01"]["task_123"] = true` bo'lishi mumkin, lekin `logs["2026-09-02"]` obyekti hali mavjud bo'lmaydi — shuning uchun ertangi kun checkboxlari avtomatik bo'sh chiqadi. Eski kunlarni o'chirish shart emas, ular tarix sifatida saqlanaveradi (agar kerak bo'lmasa, faqat oxirgi N kunni saqlab, eskilarini tozalash mumkin).

---

## 4. Sana bilan ishlash mantiq (juda muhim joyi)

```js
function getTodayKey() {
  const d = new Date();
  // Faqat local sana, vaqt emas — YYYY-MM-DD
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
```

⚠️ **Diqqat:** `toISOString()` ishlatilsa UTC bo'yicha hisoblanadi — foydalanuvchi vaqt zonasiga bog'liq kechroq/ertaroq kun almashishi mumkin. Shuning uchun local Date komponentlaridan (`getFullYear`, `getMonth`, `getDate`) foydalanish tavsiya etiladi, `toISOString()` emas.

Sahifa ochiq turgan holda tunda 00:00 o'tib ketsa (ilova yopilmagan bo'lsa), `getTodayKey()` ni interval bilan (masalan har daqiqada) qayta tekshirib, sana o'zgarganda checkbox holatlarini qayta render qilish kerak.

---

## 5. UI komponentlar (React tuzilmasi)

```
<App>
 ├── <Header />               // sana, progress bar
 ├── <TaskList>
 │     └── <TaskItem />       // checkbox + nom + vaqt + o'chirish tugmasi
 ├── <AddTaskForm />          // yangi vazifa qo'shish
 └── <EmptyState />           // ro'yxat bo'sh bo'lganda
```

### State (React holatida, misol)
```js
const [tasks, setTasks] = useState([]);        // doimiy ro'yxat
const [todayLog, setTodayLog] = useState({});  // faqat bugungi kun logi
const todayKey = getTodayKey();
```

### Asosiy funksiyalar
- `addTask(title, time)` → `tasks` massiviga qo'shadi, saqlaydi.
- `deleteTask(id)` → `tasks` dan o'chiradi, barcha loglardagi shu id ni ham tozalash mumkin (ixtiyoriy).
- `toggleDone(id)` → `logs[todayKey][id]` ni true/false qiladi.
- `getProgress()` → `{done, total}` qaytaradi.

---

## 6. Saqlash (Storage) variantlari

| Variant | Qachon mos | Eslatma |
|---|---|---|
| `localStorage` | Oddiy, faqat shu qurilmada ishlaydi | Eng tez yo'l, backend kerak emas |
| Claude Artifact `window.storage` | Claude.ai ichida demo uchun | localStorage ishlamaydi, shu API kerak |
| Firebase / Supabase | Bir nechta qurilmada sinxron kerak bo'lsa | Auth + DB kerak bo'ladi |
| IndexedDB | Offline-first, katta hajm | PWA uchun yaxshi |

Frontend dasturchi sifatida eng oddiy yo'l — **localStorage** (agar faqat bitta qurilmada ishlatilsa) yoki **Supabase** (agar login qilib bir nechta qurilmadan kirmoqchi bo'lsangiz).

---

## 7. PWA (telefon ilovasi kabi ishlashi uchun)

Buni "ilova"ga o'xshatish uchun:
1. `manifest.json` qo'shish (name, icons, `display: standalone`, `theme_color`).
2. Service Worker qo'shish (offline ishlashi uchun, `vite-plugin-pwa` yoki `next-pwa` qulay).
3. HTTPS orqali hosting qilish (Vercel, Netlify — bepul).
4. Foydalanuvchi telefonda "Add to Home Screen" qilsa, ikonka bilan, to'liq ekranda ochiladi — App Store shart emas.

---

## 8. Chegara holatlar (Edge cases)

- Ro'yxat bo'sh bo'lsa — "Hali vazifa yo'q" xabari.
- Vazifa nomi bo'sh yuborilsa — submit bloklanadi.
- Bir xil nomli vazifa ikki marta qo'shilishi mumkinmi? — ruxsat berish tavsiya etiladi (masalan ikkita xil vaqtda bir xil ish).
- Foydalanuvchi vazifani o'chirsa, lekin avvalgi kunlarda shu vazifa bo'yicha statistikasi bo'lsa — statistikada "o'chirilgan vazifa" deb saqlab qolish mumkin (ixtiyoriy).
- Vaqt mintaqasi o'zgarsa (sayohat) — sana hisoblash muammosi bo'lishi mumkin, lekin bu v1 uchun kritik emas.

---

## 9. Texnologiya tavsiyasi (frontchi sifatida sizga)

- **React + Vite** — tez boshlash uchun.
- **Zustand** yoki oddiy `useState` + `useEffect` — state uchun (Redux shart emas, loyiha kichik).
- **Tailwind CSS** — tezkor styling.
- **localStorage** yoki **Supabase** — saqlash.
- **vite-plugin-pwa** — telefon ilovasi tajribasi uchun.

---

## 10. V2 uchun g'oyalar (keyinroq)

- Streak hisoblash (necha kun ketma-ket bajarilgan).
- Haftalik/oylik statistik grafik.
- Eslatma (notification) — vaqt kelganda.
- Vazifalarni kategoriyalarga bo'lish.
- Dark mode.
