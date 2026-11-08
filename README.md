# 🎬 VideoVault — Luxury Offline Video & Notes Vault for Android

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Android%20%7C%20Web-22c55e?style=for-the-badge&logo=android" alt="Platform Android" />
  <img src="https://img.shields.io/badge/Style-Apple%20Liquid%20Glass-fef08a?style=for-the-badge&logo=apple" alt="Apple Liquid Glass" />
  <img src="https://img.shields.io/badge/Stack-Vanilla%20JS%20%2B%20Vite-yellow?style=for-the-badge&logo=javascript" alt="Vanilla JS" />
  <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Database-Dexie.js%20v2%20(IndexedDB)-059669?style=for-the-badge" alt="Dexie.js" />
  <img src="https://img.shields.io/badge/Bridge-Capacitor%206%2F7-1192d3?style=for-the-badge&logo=capacitor" alt="Capacitor" />
  <img src="https://img.shields.io/badge/Status-100%25%20Offline-success?style=for-the-badge" alt="Offline Status" />
</p>

---

## 🌟 Tentang VideoVault

**VideoVault** adalah aplikasi kurasi video personal dan catatan pribadi mandiri (*standalone APK*) bertema **Apple Liquid Glass & Dark Luxury (Obsidian-Mocha-Army Emerald)** yang dirancang khusus untuk kenyamanan mobile satu tangan (*mobile-first ergonomic*). 

Aplikasi ini berjalan **100% offline tanpa server backend eksternal**, tanpa registrasi akun, dan tanpa pelacakan data. Seluruh koleksi video, bookmark, kategori, serta catatan teks pribadi Anda tersimpan permanen di memori lokal smartphone menggunakan **IndexedDB (Dexie.js v2)**.

---

## ✨ Fitur Unggulan

### 💎 1. Desain Apple "Liquid Glass" 1:1 & Palet Mewah
- **Palet Stealth Mewah**: Paduan latar belakang terdalam **Deep Obsidian Onyx** (`#070709`), panel permukaan **Warm Dark Espresso/Mocha** (`#161311`), aksen kontras mencolok **Tactical Military / Army Emerald Green** (`#22c55e` / `#4ade80`), dan sentuhan **Champagne Gold**.
- **Liquid Glassmorphism 1:1**: Efek kaca cair multi-layer ultra-soft (`backdrop-blur-28px`), rim highlight specular 1px putih tipis di tepi kartu, serta inner ambient lighting layaknya antarmuka visionOS / iOS modern.
- **Header Action Protection**: Tombol aksi utama `+`, Sort, dan Pengaturan ditempatkan elegan di **Header Navbar atas**, menjamin 100% bebas dari risiko terpotong batas bawah layar atau navigation gesture bar HP.
- **Ikon Vektor Apple Minimalis**: Tab navigasi utama beralih dari emote menjadi ikon vektor SVG elegan standar antarmuka Apple untuk tampilan yang lebih profesional dan mewah.
- **Bebas Glitch & Mobile Smooth**: Transisi modal dipercepat dengan akselerasi GPU hardware 3D tanpa sentakan keyboard virtual otomatis pada layar smartphone.

### ⚡ 2. Import Massal Instan 1-Klik (*1-Click Instant Batch Import*)
- **Import Tanpa Menunggu**: Tempel puluhan tautan sekaligus dari aplikasi catatan (seperti Google Keep) dan tekan **"⚡ Import Semua Sekaligus"**. Seluruh video dan catatan teks seketika tersimpan dalam hitungan milidetik tanpa perlu konfirmasi manual satu per satu.
- **Background Metadata Enrichment**: Setelah tautan tersimpan instan, sistem secara cerdas memperkaya thumbnail dan judul asli di latar belakang tanpa mengunci atau menghambat navigasi antarmuka pengguna.
- **Opsi Review Satu-Satu**: Tetap tersedia opsi wizard interaktif bagi pengguna yang ingin meninjau atau memodifikasi kategori link per item.

### ⚙️ 3. Cadangkan & Pulihkan Data (*JSON Backup & Restore*)
- **Menu Pengaturan & Cadangan (Options Modal)**: Tombol roda gigi di header membuka pusat kendali data lokal Anda.
- **Ekspor Cadangan JSON**: Simpan seluruh koleksi video dan catatan ke file cadangan `.json` di penyimpanan smartphone hanya dengan satu ketukan.
- **Pulihkan Seketika**: Pulihkan data kapan saja dari file cadangan `.json` saat memperbarui aplikasi atau beralih perangkat tanpa kehilangan data.

### 📄 4. Kustomisasi Ukuran Halaman (*Dynamic Pagination*)
- **Navigasi Halaman Ergonomis**: Pengguna dapat memilih jumlah video per halaman (**10, 15, 20, 30, 40, 50, atau 100 item**) sesuai kenyamanan.
- **Penyimpanan Preferensi Lokal**: Pilihan ukuran halaman tersimpan otomatis di memori lokal (`localStorage`).
- **Kontrol Halaman Ringkas**: Bilah navigasi *Prev* dan *Next* yang responsif membuat penelusuran koleksi video panjang menjadi cepat dan ringan.

### 🪐 5. Animasi 3D Realistic Cinematic Vault Intro
- **Realistic 3D Perspective**: Begitu aplikasi dibuka, pengguna disambut oleh intro 3D emblem vault holografik yang berputar dengan depth perspective (`perspective: 1200px`), sapuan cahaya metallic sheen, dan gelombang shockwave Army Emerald.
- **Seamless Dissolve & Tap-to-Skip**: Bertransisi halus zoom-in ke dashboard utama dalam 1.8 detik, atau cukup ketuk layar kapan saja untuk masuk seketika.

### 📝 6. Fitur "Vault Notes" (Catatan Pribadi In-App ala Google Keep)
- **Modul Catatan Terintegrasi**: Tersedia navigasi segmented switch `[ Video ]` dan `[ Catatan ]` di bagian atas aplikasi dengan ikon vektor Apple.
- **Penyimpanan Catatan 100% Offline**: Tulis, baca, cari, edit, dan kelola catatan bebas langsung di dalam aplikasi layaknya Google Keep pribadi Anda.
- **Auto-Capture saat Import Massal**: Saat mengimpor teks catatan yang berisi campuran link dan kalimat teks, seluruh kalimat non-link otomatis diekstrak dan disimpan sebagai catatan baru di tab Catatan!

### 🧹 7. Smart Notes & Glued Links Parser
- **Pemisahan Link Menempel**: Menangani teks berantakan dari catatan (seperti `.https://...https://...` tanpa spasi) secara otomatis dan akurat.
- **Pembersih Teks Menempel di URL**: Memotong teks judul yang nempel langsung di ujung slash URL dan memilahnya menjadi tautan bersih serta catatan teks pendamping.

### 🌐 8. Kategori Otomatis Berdasarkan Domain Web (*Auto-Domain Category*)
- **Deteksi Cerdas**: Aplikasi otomatis mengenali domain URL dan langsung menjadikannya kategori default tanpa perlu diketik manual.
- **1-Tap Save di Wizard**: Kategori domain otomatis terisi dan tersorot di wizard batch; pengguna cukup 1 ketukan untuk konfirmasi simpan seketika.

### 🎥 9. Pemutar Video Terintegrasi Multi-Platform
- **Universal Embedded Player**: Mendukung pemutaran iframe resmi untuk berbagai platform video terkemuka di dalam aplikasi.
- **HTML5 Direct Player**: Pemutar video bawaan untuk file `.mp4`, `.webm`, `.mov`, dan streaming langsung.
- **External Web Launcher**: Tautan fallback otomatis membuka browser eksternal dalam 1 ketukan untuk URL website umum.

---

## 🛠️ Arsitektur & Tech Stack

```mermaid
graph TD
    A["📱 User Interface (Apple Liquid Glass / Tailwind CSS v4)"] -->|Event Listeners & State| B["⚡ Vanilla JS Engine (ES Modules)"]
    B -->|Offline Storage API (v2)| C["💾 Dexie.js (videos + notes)"]
    B -->|CapacitorHttp CORS Bypass| D["🌐 Metadata Scraper & Smart Notes Parser"]
    B -->|Capacitor Bridge| E["🤖 Native Android Shell (Capacitor 6/7)"]
    E -->|Cloud Compilation| F["☁️ GitHub Actions CI/CD (JDK 21)"]
```

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Frontend Core** | Vanilla JavaScript (ESM) | Ringan, bebas *overhead*, pemeliharaan mudah |
| **Styling & Theme** | Tailwind CSS v4 + Liquid Glass | Deep Obsidian, Mocha & Army Emerald Theme |
| **Database Lokal** | Dexie.js v2 (IndexedDB) | Store `videos` & Store `notes` 100% offline |
| **Hybrid Bridge & HTTP** | Capacitor Android + CapacitorHttp | Bridge native Android & HTTP bypass CORS |
| **Cloud CI/CD** | GitHub Actions (JDK 21) | Otomatisasi kompilasi `.apk` di cloud |

---

## 📂 Struktur Direktori Proyek

```text
video-vault/
├── .github/
│   └── workflows/
│       └── build-apl.yml       # Skrip CI/CD kompilasi APK di cloud (JDK 21)
├── android/                    # Proyek native Android (Capacitor)
│   └── app/src/main/
│       ├── AndroidManifest.xml # Izin native & orientasi Android
│       └── res/                # Ikon launcher & branding aplikasi
├── public/                     # Aset statis & logo
├── src/
│   ├── main.js                 # Logika Dexie v2, scraper, notes, wizard & UI
│   └── style.css               # Apple Liquid Glass, 3D intro & micro-animations
├── index.html                  # Shell antarmuka, 3D intro, notes modal & player
├── capacitor.config.json       # Konfigurasi appId & plugin CapacitorHttp
├── vite.config.js              # Konfigurasi bundler Vite + Tailwind
├── package.json                # Dependensi proyek
├── AGENTS.md                   # Dokumen ground-truth instruksi AI Agent
└── README.md                   # Dokumentasi resmi proyek ini
```

---

## 🚀 Panduan Pengembangan Lokal

### 1. Prasyarat
- **Node.js** v20+ atau versi LTS terbaru.
- **npm** atau **pnpm**.
- **Android Debug Bridge (`adb`)** untuk flashing via Wi-Fi (opsional).

### 2. Instalasi Dependensi
```bash
git clone https://github.com/YoriSyahputra/video-vault.git
cd video-vault
npm install
```

### 3. Menjalankan Server Pengembangan (Live Preview)
```bash
npm run dev
```
Buka browser di `http://localhost:5173` untuk melihat perubahan UI secara real-time.

### 4. Build & Sinkronisasi Android
Setiap kali selesai melakukan pengeditan antarmuka web:
```bash
npm run build
npx cap sync android
```

> [!IMPORTANT]
> **Batasan Perangkat:** Jangan pernah menjalankan kompilasi Gradle lokal (`./gradlew assembleDebug`) jika laptop memiliki keterbatasan spesifikasi. Seluruh kompilasi `.apk` ditangani otomatis oleh cloud CI/CD.

---

## 📦 Alur Rilis APK Cloud & Instalasi Nirkabel (Wireless ADB)

Aplikasi ini menggunakan alur otomatisasi modern tanpa perlu mencolokkan kabel data ke laptop.

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer
    participant Git as GitHub (main branch)
    participant CI as GitHub Actions (JDK 21)
    participant Phone as Smartphone Android

    Dev->>Git: git push origin main
    Git->>CI: Trigger build-apl.yml
    CI-->>CI: Compile APK (~1.5 menit)
    CI-->>Dev: Artifact video-vault-debug-apk siap diunduh
    Dev->>Phone: adb connect <IP_HP>:<PORT>
    Dev->>Phone: adb install -r ./build-out/app-debug.apk
    Dev->>Phone: Launch VideoVault!
```

### Langkah Instalasi ke HP Tanpa Kabel:

1. **Pairing Nirkabel (Hanya Sekali):**
   - Di HP: Buka **Pengaturan** > **Opsi Pengembang** > **Debugging Nirkabel** > **Pasangkan perangkat dengan kode**.
   - Di Terminal:
     ```bash
     adb pair <IP_HP>:<PORT_PAIRING>
     # Masukkan 6 digit kode pairing yang tampil di layar HP
     ```

2. **Koneksi:**
   ```bash
   adb connect <IP_HP>:<PORT_KONEKSI>
   adb devices
   ```

3. **Unduh APK Otomatis via GitHub CLI (`gh`):**
   ```bash
   gh run download -n video-vault-debug-apk -D ./build-out
   ```

4. **Flash APK Langsung ke HP:**
   ```bash
   adb install -r ./build-out/app-debug.apk
   adb shell monkey -p com.videovault.app -c android.intent.category.LAUNCHER 1
   ```

---

## 🗄️ Format Skema Database Dexie.js v2 (`VideoVaultDB`)

Skema IndexedDB dikelola secara terstruktur melalui Dexie.js versi 2:

```javascript
const db = new Dexie("VideoVaultDB");
db.version(1).stores({
  videos: "++id, title, url, category, createdAt"
});
db.version(2).stores({
  videos: "++id, title, url, category, createdAt",
  notes: "++id, title, content, createdAt, updatedAt"
});
```

### Store `videos`:
- `id`: Auto-increment integer (Primary Key).
- `title`: Judul video / deskripsi.
- `url`: Tautan video.
- `thumbnail`: URL cover thumbnail video.
- `category`: Label kategori (otomatis dari domain web atau kustom).
- `createdAt`: ISO 8601 timestamp pembuatan.

### Store `notes`:
- `id`: Auto-increment integer (Primary Key).
- `title`: Judul catatan pribadi.
- `content`: Teks isi catatan lengkap.
- `createdAt`: ISO 8601 timestamp pembuatan.
- `updatedAt`: ISO 8601 timestamp terakhir disunting.

---

## 📄 Lisensi & Kontribusi

Dilisensikan di bawah [MIT License](LICENSE). Dibuat dengan dedikasi untuk estetika Apple Liquid Glass, performa tanpa lag, dan privasi penuh di perangkat Android Anda.
