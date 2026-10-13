# PRD: Waraja (Agent Pelatih Wawancara Kerja Berbasis STAR)

## 1. ROLE & CONTEXT (Layer 1)

- Peran Bob : senior frontend engineer.
- Produk : Agent chat berbasis aturan yang berperan sebagai pewawancara, menilai jawaban dengan metode STAR, dan memberi saran perbaikan dalam Bahasa Indonesia.
- Batasan teknologi (WAJIB): HTML, CSS, JavaScript ES6 + vanilla. Tanpa framework, library, CDN, backend, atau API call. Semua jalan di browser.
- Output : tiga file terpisah: `index.html`, `style.css`, `script.js`.

## 2. MASALAH & PENGGUNA

- Masalah : lulusan baru jarang latihan wawancara dan tidak tahu kelemahan jawabannya (terlalu singkat, tanpa contoh nyata, tanpa hasil terukur).
- Pengguna : mahasiswa tingkat akhir dan lulusan baru yang melamar kerja atau magang.

## 3. TASK & REQUIREMENTS (Layer 2)

1. Layar awal: pilih posisi (Web Developer) dan kategori (perilaku / teknis / HR).
2. UI chat dengan gelembung pesan. Agent bertanya satu pertanyaan per giliran dari bank 10 pertanyaan. Setiap pertanyaan punya daftar `relevantKeywords` (v2).
3. Penilaian berbasis aturan, skor 0-100 per jawaban:
   - Situation/Task : kata kunci konteks ("waktu itu", "project", "tugas saya").
   - Action : kata kerja aktif dan kata ganti "saya".
   - Result : angka atau kata hasil ("meningkat", "berhasil", "selesai").
   - Relevansi (v2) : jumlah `relevantKeywords` pertanyaan yang muncul di jawaban, bobot 20% dari skor.
   - Panjang : minimal 30 kata.
   - Kata pengisi : "pokoknya", "hmm", "gitu deh" mengurangi skor.
   - Anti pengulangan (v2) : rasio kata unik terhadap total kata. Jika di bawah 0,5, beri penalti dan tampilkan pesan "Jawaban banyak mengulang kata/kalimat".
4. Umpan balik setelah tiap jawaban (v2) : kartu menetap di bawah jawaban, tidak pernah hilang otomatis, dengan tombol lipat/buka (default terbuka). Isi: skor, rincian per aspek (Situation, Task, Action, Result, relevansi, panjang), hal yang sudah baik, hal yang kurang, satu tips perbaikan konkret.
5. Ringkasan akhir (v2) : skor total, daftar skor per jawaban, grafik batang CSS per aspek STAR, tombol "Coba lagi".
6. Riwayat sesi di `localStorage`.
7. Input kosong atau terlalu pendek: tampilkan pesan ramah, jangan dinilai.

## 4. CONSTRAINTS & OUTPUT (Layer 3)

- Tema gelap. Warna utama #4F8EF7, aksen #FFB347, skor hijau/kuning/merah.
- Gelembung chat dan kartu : Rounded corner, soft shadow, hover effect, smooth transition, serta ikon sederhana bila diperlukan.
- CSS custom properties, Flexbox/Grid, responsif utamakan mobile.
- WCAG AA, HTML semantik, bisa dipakai dengan keyboard (Enter untuk kirim).
- Setiap aturan penilaian dalam fungsi terpisah, kode berkomentar, nol error console.

## 5. KRITERIA SELESAI

- Jawaban bagus (ada konteks, aksi, hasil terukur) mendapat skor tinggi.
- Jawaban asal ("ya gitu deh") mendapat skor rendah beserta saran.
- Kalimat yang sama untuk pertanyaan berbeda menghasilkan skor berbeda.
- Kalimat yang diulang-ulang mendapat penalti.
- Kartu umpan balik tetap terlihat di chat.
- Berjalan hanya dengan membuka `index.html`.

## 6. RIWAYAT REVISI

- (V1) Versi awal. Masalah : kartu skor cepat hilang, skor sama untuk kalimat yang sama (tidak sadar pertanyaan, tidak mendeteksi pengulangan), UI kecil dan terpusat.
- (V2) Versi 2 revisi Layer 2 : kartu umpan balik menetap, komponen relevansi, penalti pengulangan, rincian skor per aspek.