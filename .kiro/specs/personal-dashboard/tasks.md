# Implementation Plan: Personal Dashboard

## Overview

Implementasi dilakukan secara incremental — mulai dari fondasi (HTML structure + StorageModule), lalu tiap widget satu per satu, diakhiri dengan wiring dan theming. Semua kode ditulis dalam tiga file: `index.html`, `css/style.css`, dan `js/app.js`. Testing menggunakan fast-check via CDN di `test/index.html`.

## Tasks

- [x] 1. Buat struktur HTML dan file dasar
  - Buat `index.html` dengan layout grid empat widget: Greeting, Timer, Todo, Quick Links
  - Tambahkan elemen untuk theme toggle di header
  - Link ke `css/style.css` dan `js/app.js`
  - Buat `css/style.css` dengan CSS variables untuk light/dark theme (`data-theme` attribute)
  - Buat `js/app.js` dengan skeleton module pattern dan `DOMContentLoaded` entry point
  - _Requirements: 9.3_

- [x] 2. Implementasi StorageModule
  - [x] 2.1 Tulis `StorageModule` di `js/app.js`
    - Implementasi `get(key, fallback)` dengan try/catch untuk JSON.parse
    - Implementasi `set(key, value)` dengan try/catch untuk localStorage.setItem
    - Definisikan `KEYS`: `NAME`, `DURATION`, `TASKS`, `LINKS`, `THEME`
    - _Requirements: 8.1, 8.2_

  - [ ]* 2.2 Tulis property test untuk StorageModule
    - Buat `test/index.html` dengan fast-check via CDN
    - **Property 5: Name storage round-trip**
    - **Validates: Requirements 2.3**

- [x] 3. Implementasi ThemeModule
  - [x] 3.1 Tulis `ThemeModule` di `js/app.js`
    - Implementasi `apply(theme)` — set `data-theme` pada `<html>`
    - Implementasi `init()` — baca storage, fallback ke `prefers-color-scheme`, fallback ke light
    - Implementasi `toggle()` — ganti tema, simpan ke storage
    - Hubungkan ke tombol toggle di HTML
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 3.2 Tulis property test untuk ThemeModule
    - **Property 20: Theme storage round-trip**
    - **Validates: Requirements 7.3**

- [x] 4. Implementasi GreetingModule
  - [x] 4.1 Tulis pure functions `getGreeting(hour)`, `formatTime(date)`, `formatDate(date)`
    - `getGreeting`: 5–11 → "Good morning", 12–17 → "Good afternoon", 18–21 → "Good evening", 22–4 → "Good night"
    - `formatTime`: Date → "HH:MM" (zero-padded)
    - `formatDate`: Date → "Day, DD Month YYYY"
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [ ]* 4.2 Tulis property tests untuk pure functions Greeting
    - **Property 1: Greeting time format** — Validates: Requirements 1.1
    - **Property 2: Greeting date format** — Validates: Requirements 1.2
    - **Property 3: Greeting message by hour** — Validates: Requirements 1.3, 1.4, 1.5, 1.6

  - [x] 4.3 Tulis `GreetingModule.init(savedName)` dan `setName(name)`
    - `init`: render greeting + waktu + tanggal, mulai interval 1 menit
    - `setName`: validasi (trim whitespace), simpan ke storage, re-render
    - Jika nama kosong setelah trim, hapus dari storage dan render tanpa suffix
    - Hubungkan input nama dan tombol submit ke `setName`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ]* 4.4 Tulis property test untuk GreetingModule.setName
    - **Property 4: Name in greeting** — Validates: Requirements 2.2

- [x] 5. Implementasi TimerModule
  - [x] 5.1 Tulis pure function `TimerModule.formatTime(seconds)` dan `setDuration(minutes)`
    - `formatTime`: seconds → "MM:SS" (zero-padded, range 0–7200)
    - `setDuration`: validasi range [1–120], update display, simpan ke storage; tolak jika di luar range
    - _Requirements: 3.1, 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 5.2 Tulis property tests untuk TimerModule
    - **Property 6: Timer display format** — Validates: Requirements 3.1
    - **Property 9: Valid duration updates display and persists** — Validates: Requirements 4.2, 4.3
    - **Property 10: Invalid duration is rejected** — Validates: Requirements 4.5

  - [x] 5.3 Tulis `TimerModule.init`, `start`, `stop`, `reset`, `tick`, `notify`
    - `init(savedDuration)`: render dengan durasi tersimpan (fallback 25 menit)
    - `start`: mulai setInterval → tick setiap detik, update kontrol UI
    - `stop`: clearInterval, update kontrol UI
    - `reset`: clearInterval, kembalikan ke durasi terkonfigurasi, update kontrol UI
    - `tick`: kurangi 1 detik, update display; jika 0 → stop + notify
    - `notify`: tampilkan alert atau visual indicator saat 00:00
    - Hubungkan tombol start/stop/reset dan input durasi ke handler
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.6_

  - [ ]* 5.4 Tulis property tests untuk timer state invariant dan reset
    - **Property 7: Timer reset restores configured duration** — Validates: Requirements 3.4
    - **Property 8: Timer control state invariant** — Validates: Requirements 3.6, 3.7, 4.6

- [ ] 6. Checkpoint — Pastikan semua test lulus
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implementasi TodoModule
  - [x] 7.1 Tulis `TodoModule.addTask(title)`, `toggleTask(id)`, `editTask(id, newTitle)`, `deleteTask(id)`
    - `addTask`: validasi non-empty (trim), buat task `{id, title, completed: false}`, simpan
    - `toggleTask`: flip `completed`, simpan
    - `editTask`: validasi non-empty (trim), update title, simpan; batalkan jika kosong
    - `deleteTask`: filter array, simpan
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.7, 5.8, 5.9, 5.10_

  - [ ]* 7.2 Tulis property tests untuk TodoModule
    - **Property 11: Task addition** — Validates: Requirements 5.2
    - **Property 12: Task completion toggle round-trip** — Validates: Requirements 5.4, 5.5
    - **Property 13: Task edit** — Validates: Requirements 5.7
    - **Property 14: Task deletion** — Validates: Requirements 5.9
    - **Property 15: Task list storage round-trip** — Validates: Requirements 5.10

  - [x] 7.3 Tulis `TodoModule.init(savedTasks)` dan `render()`
    - `init`: load tasks dari storage (fallback ke `[]`), panggil `render()`
    - `render`: re-render seluruh list ke DOM, termasuk tombol toggle/edit/delete per task
    - Tampilkan strikethrough untuk task completed
    - Tampilkan inline validation message jika input kosong
    - Hubungkan form submit ke `addTask`
    - _Requirements: 5.1, 5.3, 5.6, 5.8_

- [x] 8. Implementasi LinksModule
  - [x] 8.1 Tulis `LinksModule.isValidUrl(url)`, `addLink(label, url)`, `deleteLink(id)`
    - `isValidUrl`: gunakan `new URL(input)` dalam try/catch → return boolean
    - `addLink`: validasi label non-empty dan URL valid, buat link `{id, label, url}`, simpan
    - `deleteLink`: filter array, simpan
    - _Requirements: 6.2, 6.3, 6.4, 6.5_

  - [ ]* 8.2 Tulis property tests untuk LinksModule
    - **Property 16: Link addition** — Validates: Requirements 6.2
    - **Property 17: Invalid link is rejected** — Validates: Requirements 6.3
    - **Property 18: Link deletion** — Validates: Requirements 6.4
    - **Property 19: Link list storage round-trip** — Validates: Requirements 6.5

  - [x] 8.3 Tulis `LinksModule.init(savedLinks)` dan `render()`
    - `init`: load links dari storage (fallback ke `[]`), panggil `render()`
    - `render`: render tiap link sebagai `<a target="_blank">` dengan tombol delete
    - Tampilkan inline validation message jika input tidak valid
    - Hubungkan form submit ke `addLink`
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 9. Wiring semua modul di `DOMContentLoaded`
  - [x] 9.1 Hubungkan semua modul di entry point `app.js`
    - Load semua data dari `StorageModule` sekali di awal
    - Panggil `ThemeModule.init()`, `GreetingModule.init(name)`, `TimerModule.init(duration)`, `TodoModule.init(tasks)`, `LinksModule.init(links)`
    - _Requirements: 8.1, 8.2_

  - [ ]* 9.2 Tulis property test untuk full state restoration
    - **Property 21: Full state restoration on load** — Validates: Requirements 8.1

- [x] 10. Styling CSS lengkap
  - Implementasi CSS variables untuk light/dark theme (`--bg`, `--text`, `--accent`, dll.)
  - Styling grid layout responsif untuk empat widget
  - Styling tiap widget: Greeting, Timer, Todo, Quick Links
  - Styling state visual: task completed (strikethrough), timer running (disabled inputs)
  - _Requirements: 7.1, 7.2, 9.1_

- [ ] 11. Final checkpoint — Pastikan semua test lulus
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks bertanda `*` bersifat opsional dan bisa dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirements spesifik untuk traceability
- Property tests menggunakan fast-check via CDN di `test/index.html`
- Semua property test dikonfigurasi minimum 100 iterasi (`numRuns: 100`)
- Tidak ada build step — semua file bisa dibuka langsung di browser
