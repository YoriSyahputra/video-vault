# VideoVault — Panduan Proyek & Aturan Agent Antigravity

Dokumen ini adalah instruksi kerja dan sumber kebenaran (*ground truth*) untuk pengembang dan Agent Google Antigravity dalam mengembangkan aplikasi **VideoVault**.

---

## 1. Ringkasan Proyek & Tech Stack

VideoVault adalah aplikasi Android mandiri (*standalone APK*) bertema dark-mode premium yang berjalan **100% offline** tanpa ketergantungan server luar.

- **Frontend Core**: Vanilla JavaScript (ES Modules) + HTML5 + CSS3.
- **Build Tool**: Vite.
- **Styling**: Tailwind CSS (Build-time offline via `@tailwindcss/vite`, tanpa CDN runtime).
- **Database Lokal**: Dexie.js (IndexedDB wrapper, penyimpanan permanen di memori perangkat).
- **Mobile Hybrid Bridge**: Capacitor 6/7 (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`).
- **HTTP / Metadata Scraper**: `@capacitor/core` (`CapacitorHttp` untuk bypass CORS).
- **Package ID Android**: `com.videovault.app`
- **Nama Aplikasi**: Video Vault

---

## 2. Batasan Environment & Perangkat (Krusial)

Laptop pengembang memiliki spesifikasi terbatas (**Intel Celeron, RAM 4 GB**). Semua agen dan pengguna **WAJIB** mematuhi aturan berikut:

1. **Dilarang Kompilasi Gradle Lokal**:
   - JANGAN PERNAH menjalankan `./gradlew assembleDebug` atau build Android Studio di laptop lokal karena akan menyebabkan *Out of Memory (OOM)* atau freeze total.
2. **Kompilasi Didelegasikan ke Cloud**:
   - Seluruh proses pembuatan file `.apk` dilakukan melalui GitHub Actions CI/CD (`.github/workflows/build-apl.yml`).
3. **Environment Java Cloud**:
   - GitHub Actions menggunakan **JDK 21 Temurin** (wajib untuk kompatibilitas Gradle / Android SDK terbaru).
4. **Editor**:
   - LazyVim / Neovim di terminal Linux & Antigravity Agent.

---

## 3. Struktur Direktori Proyek

```text
video-vault/
├── .agents/                    # Konfigurasi / rules Antigravity tambahan (opsional)
├── .github/
│   └── workflows/
│       └── build-apl.yml       # Script CI/CD build APK cloud (JDK 21)
├── android/                    # Platform project Android Capacitor
│   └── app/src/main/
│       ├── AndroidManifest.xml # Izin & config native Android
│       └── res/                # Launcher icon & strings nama app
├── public/                     # Asset statis
├── src/
│   ├── main.js                 # Logika Dexie.js, event handler, pagination & UI
│   └── style.css               # Import Tailwind CSS build-time & tema custom
├── index.html                  # Shell UI, modal CRUD, bottom sheet & preview player
├── capacitor.config.json       # Konfigurasi Capacitor & CapacitorHttp
├── vite.config.js              # Vite bundler + Tailwind plugin
├── package.json
├── README.md                   # Dokumentasi resmi proyek (wajib selalu dimutakhirkan)
└── AGENTS.md                   # Dokumen instruksi agent ini
```

---

## 4. Alur Kerja Pengujian & Build APK

### A. Pengujian Cepat di Browser Lokal
Untuk melihat perubahan UI secara real-time:
```bash
npm run dev
```
Buka `http://localhost:5173` di browser.

### B. Sinkronisasi Web ke Folder Android
Jalankan setiap kali selesai mengedit kode sebelum push git:
```bash
npm run build
npx cap sync android
```

### C. Trigger Cloud Build APK
Push perubahan ke branch `main`:
```bash
git add .
git commit -m "feat: deskripsi perubahan"
git push origin main
```
GitHub Actions akan otomatis mengompilasi APK dalam kurun waktu 1,5 – 2 menit.

---

## 5. Alur Instalasi Langsung ke HP via Wireless ADB (Tanpa Kabel)

Pastikan laptop dan HP terhubung ke jaringan Wi-Fi yang sama.

### Step 1: Pasangkan Perangkat (Pairing) — Cukup Sekali
1. Di HP: Buka **Pengaturan** > **Opsi Pengembang** > Aktifkan **Debugging Nirkabel**.
2. Ketuk menu **Debugging Nirkabel** > pilih **Pasangkan perangkat dengan kode pemasangan**.
3. Di terminal laptop, jalankan perintah sesuai IP, port, dan 6 digit pairing code yang muncul di pop-up HP:
```bash
adb pair <IP_HP>:<PORT_PAIRING>
# Contoh: adb pair 192.168.1.25:38475
# Masukkan 6 digit pairing code saat diminta
```

### Step 2: Hubungkan (Connect)
Lihat alamat IP & Port utama pada halaman Debugging Nirkabel:
```bash
adb connect <IP_HP>:<PORT_KONEKSI>
# Contoh: adb connect 192.168.1.25:41235
```
Verifikasi koneksi:
```bash
adb devices
# Harus menampilkan: 192.168.1.25:41235    device
```

### Step 3: Unduh APK dari GitHub Actions via Terminal
Unduh artifact APK terbaru secara otomatis menggunakan GitHub CLI (`gh`):
```bash
# Unduh artifact run terbaru ke folder ./build-out
gh run download -n video-vault-debug-apk -D ./build-out
```

### Step 4: Pasang (Flash) APK Langsung ke HP
```bash
# Install / perbarui aplikasi tanpa menghapus data IndexedDB (-r)
adb install -r ./build-out/app-debug.apk

# (Opsional) Langsung jalankan aplikasi di layar HP secara otomatis
adb shell monkey -p com.videovault.app -c android.intent.category.LAUNCHER 1
```

---

## 6. Format Skema Database Dexie.js (`VideoVaultDB`)

Jika menambahkan fitur baru, jaga kompatibilitas skema database di `src/main.js`:

```javascript
const db = new Dexie("VideoVaultDB");
db.version(1).stores({
  videos: "++id, title, url, category, createdAt"
});
```

- `id`: Auto-increment integer (Primary Key).
- `title`: Judul video (string).
- `url`: Link video atau target (string).
- `thumbnail`: URL gambar cover/thumbnail (string, opsional).
- `category`: Kategori pengelompokan (string).
- `createdAt`: ISO 8601 string tanggal penambahan.

---

## 7. Instruksi Khusus untuk Antigravity AI Agent

Ketika diminta melakukan modifikasi pada proyek ini:
1. **Pertahankan Single-Page Simplicity**: Jangan memecah logika JavaScript ke dalam framework berat (React/Vue/Angular) kecuali diminta secara eksplisit. Tetap gunakan Vanilla JS + Vite.
2. **Jangan Rusak Capacitor Sync**: Pastikan output build tetap berada di direktori `dist/` sesuai definisi `webDir` pada `capacitor.config.json`.
3. **Optimasi Mobile Safe-Area**: Setiap elemen navigasi, floating action button (FAB), dan bottom sheet harus menghormati CSS env safe-area (`env(safe-area-inset-bottom)` dan `env(safe-area-inset-top)`).
4. **Offline Resilience**: Seluruh asset ikon, style, dan dependensi tidak boleh mengandalkan CDN publik saat runtime.
5. **Otomatisasi Git Commit & Push**: Setiap kali ada perubahan baru atau penyelesaian fitur yang telah divalidasi (`npm run build` dan `npx cap sync android`), Agent **WAJIB** secara otomatis melakukan `git add .`, `git commit -m "<deskripsi perubahan>"`, dan `git push origin main`.
6. **Pemutakhiran Dokumentasi `README.md`**: Setiap kali ada penambahan fitur, perubahan UI/UX, arsitektur, atau alur kerja baru, Agent **WAJIB** memperbarui file `README.md` agar dokumentasi proyek selalu mencerminkan kondisi aplikasi terkini dengan tampilan yang menarik, informatif, dan profesional.
