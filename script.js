/**
 * WARAJA – script.js
 * Agent Pelatih Wawancara STAR — Vanilla JS ES6+, tanpa library
 *
 * Struktur:
 *   1. Bank Pertanyaan
 *   2. Fungsi Penilaian STAR (masing-masing terpisah)
 *   2b. Fungsi Relevansi & Anti-Pengulangan (v2)
 *   3. Fungsi Umpan Balik
 *   4. State & Navigasi Layar
 *   5. Logika Chat
 *   6. Ringkasan & Grafik
 *   7. Riwayat (localStorage)
 *   8. Inisialisasi
 */

'use strict';

/* ============================================================
   1. BANK PERTANYAAN
   ============================================================ */

/**
 * Setiap item pertanyaan kini berupa objek:
 *   { text: string, relevantKeywords: string[] }
 * relevantKeywords digunakan untuk menghitung komponen relevansi (v2).
 * @type {Object.<string, Array<{text: string, relevantKeywords: string[]}>>}
 */
const QUESTION_BANK = {
  perilaku: [
    {
      // P1: kerja sama tim
      text: 'Ceritakan pengalaman Anda saat harus bekerja sama dalam tim yang sulit. Apa yang Anda lakukan dan bagaimana hasilnya?',
      relevantKeywords: ['tim', 'kerja sama', 'kolabora', 'anggota', 'konflik', 'diskusi', 'komunika', 'bersama', 'kelompok', 'rekan', 'sinergi', 'kerjasama', 'koordina', 'berbaur', 'solusi bersama']
    },
    {
      // P2: deadline ketat
      text: 'Berikan contoh saat Anda menghadapi deadline yang sangat ketat. Bagaimana Anda mengatasinya?',
      relevantKeywords: ['deadline', 'tenggat', 'waktu', 'terbatas', 'ketat', 'segera', 'mendesak', 'prioritas', 'jadwal', 'efisien', 'lembur', 'sprint', 'batas waktu', 'tertekan', 'cepat selesai']
    },
    {
      // P3: kesalahan & belajar
      text: 'Pernahkah Anda membuat kesalahan dalam pekerjaan atau kuliah? Ceritakan dan apa yang Anda pelajari?',
      relevantKeywords: ['kesalahan', 'salah', 'gagal', 'kegagalan', 'pelajaran', 'belajar', 'perbaik', 'evaluasi', 'koreksi', 'sadar', 'akui', 'tanggung jawab', 'introspek', 'memperbaiki', 'hikmah']
    },
    {
      // P4: memimpin tanpa jabatan
      text: 'Ceritakan situasi di mana Anda harus memimpin kelompok meskipun Anda bukan pemimpin resminya.',
      relevantKeywords: ['memimpin', 'pimpin', 'pemimpin', 'leadership', 'inisiatif', 'kelompok', 'arahan', 'koordina', 'tanggung jawab', 'keputusan', 'pelopor', 'mengambil alih', 'ketua', 'andil', 'mengarahkan']
    },
    {
      // P5: adaptasi perubahan
      text: 'Berikan contoh bagaimana Anda menyesuaikan diri dengan perubahan mendadak dalam proyek.',
      relevantKeywords: ['perubah', 'adaptasi', 'fleksibel', 'mendadak', 'menyesuai', 'pivot', 'tiba-tiba', 'situasi baru', 'berubah', 'kondisi', 'dinamis', 'penyesuaian', 'respons', 'kesiapan', 'tanggap']
    },
    {
      // P6: menerima kritik
      text: 'Ceritakan saat Anda menerima kritik dari dosen atau atasan. Bagaimana respons Anda?',
      relevantKeywords: ['kritik', 'masukan', 'feedback', 'saran', 'respons', 'menerima', 'perbaik', 'dosen', 'atasan', 'mentor', 'evaluasi', 'terbuka', 'lapang dada', 'catatan', 'koreksi']
    },
    {
      // P7: memotivasi rekan
      text: 'Pernahkah Anda memotivasi rekan yang tidak bersemangat? Apa yang Anda lakukan?',
      relevantKeywords: ['motivasi', 'semangat', 'rekan', 'mendukung', 'membantu', 'dorongan', 'inspira', 'positif', 'bersemangat', 'membangkitkan', 'menyemangati', 'menginspirasi', 'teman', 'kolega', 'dukungan']
    },
    {
      // P8: menyelesaikan konflik
      text: 'Ceritakan pengalaman Anda menyelesaikan konflik dengan anggota tim.',
      relevantKeywords: ['konflik', 'perselisihan', 'menyelesai', 'mediasi', 'damai', 'solusi', 'berbeda pendapat', 'kompromi', 'perdebatan', 'tengahi', 'rekonsiliasi', 'beda pandang', 'adu argumen', 'negosia', 'meredam']
    },
    {
      // P9: prioritaskan banyak tugas
      text: 'Berikan contoh saat Anda harus memprioritaskan beberapa tugas sekaligus.',
      relevantKeywords: ['prioritas', 'prioritaskan', 'tugas', 'tanggung jawab', 'bersamaan', 'sekaligus', 'deadline', 'jadwal', 'urutan', 'penting', 'mendesak', 'membagi waktu', 'mengatur', 'manajemen', 'multitasking']
    },
    {
      // P10: proyek membanggakan
      text: 'Ceritakan proyek yang paling membanggakan selama kuliah dan kontribusi konkret Anda.',
      relevantKeywords: ['proyek', 'kontribusi', 'bangga', 'berhasil', 'peran', 'dampak', 'pencapaian', 'kuliah', 'prestasi', 'karya', 'hasil nyata', 'andil', 'sumbangan', 'membangun', 'mengerjakan']
    }
  ],
  teknis: [
    {
      // T1: membangun fitur web
      text: 'Ceritakan pengalaman Anda membangun sebuah fitur web dari nol. Teknologi apa yang Anda gunakan dan bagaimana hasilnya?',
      relevantKeywords: ['fitur', 'web', 'teknologi', 'html', 'css', 'javascript', 'framework', 'implementasi', 'build', 'deploy', 'dari nol', 'membuat', 'mengembangkan', 'aplikasi', 'antarmuka']
    },
    {
      // T2: bug & debugging
      text: 'Berikan contoh saat Anda menemukan bug yang sulit. Bagaimana proses debugging Anda?',
      relevantKeywords: ['bug', 'debug', 'error', 'console', 'trace', 'fix', 'masalah', 'investigasi', 'log', 'testing', 'breakpoint', 'inspect', 'menemukan', 'penyebab', 'memperbaiki']
    },
    {
      // T3: optimasi performa
      text: 'Ceritakan pengalaman mengoptimalkan performa sebuah halaman web. Apa yang Anda lakukan dan seberapa besar peningkatannya?',
      relevantKeywords: ['performa', 'optimasi', 'optimalkan', 'loading', 'kecepatan', 'lighthouse', 'cache', 'compress', 'lazy', 'minify', 'score', 'peningkatan', 'lebih cepat', 'ringan', 'efisien']
    },
    {
      // T4: code review
      text: 'Pernahkah Anda melakukan code review atau review kode orang lain? Ceritakan prosesnya.',
      relevantKeywords: ['code review', 'review', 'kode', 'feedback', 'pull request', 'komentar', 'refactor', 'standar', 'kualitas', 'mereview', 'mengevaluasi', 'saran kode', 'merge', 'approval', 'catatan']
    },
    {
      // T5: belajar teknologi baru
      text: 'Ceritakan bagaimana Anda belajar teknologi baru yang dibutuhkan proyek dalam waktu singkat.',
      relevantKeywords: ['belajar', 'teknologi baru', 'dokumentasi', 'tutorial', 'praktek', 'cepat', 'adaptasi', 'framework', 'mempelajari', 'eksplorasi', 'mandiri', 'singkat', 'menguasai', 'mencoba', 'riset']
    },
    {
      // T6: responsive design
      text: 'Berikan contoh saat Anda menerapkan prinsip responsive design. Apa tantangan utamanya?',
      relevantKeywords: ['responsif', 'responsive', 'mobile', 'breakpoint', 'media query', 'flexbox', 'grid', 'tampilan', 'perangkat', 'layar', 'adaptif', 'ukuran layar', 'tablet', 'ponsel', 'menyesuaikan tampilan']
    },
    {
      // T7: version control / git
      text: 'Ceritakan pengalaman Anda bekerja dengan version control (Git) dalam tim.',
      relevantKeywords: ['git', 'version control', 'branch', 'commit', 'merge', 'pull request', 'conflict', 'repository', 'github', 'gitlab', 'checkout', 'rebase', 'push', 'clone', 'kolaborasi kode']
    },
    {
      // T8: aksesibilitas
      text: 'Bagaimana Anda memastikan aksesibilitas (a11y) pada proyek web Anda? Beri contoh konkret.',
      relevantKeywords: ['aksesibilitas', 'a11y', 'aria', 'semantik', 'semantic', 'alt', 'keyboard', 'screen reader', 'kontras', 'wcag', 'difabel', 'label', 'fokus', 'tabindex', 'role']
    },
    {
      // T9: dokumentasi teknis
      text: 'Ceritakan saat Anda harus menulis dokumentasi teknis. Siapa audiensnya dan bagaimana pendekatannya?',
      relevantKeywords: ['dokumentasi', 'readme', 'penjelasan', 'audiens', 'teknis', 'panduan', 'instruksi', 'jelas', 'terstruktur', 'menulis', 'wiki', 'deskripsi', 'petunjuk', 'referensi', 'spesifikasi']
    },
    {
      // T10: error handling
      text: 'Berikan contoh bagaimana Anda menangani error handling di aplikasi yang pernah Anda buat.',
      relevantKeywords: ['error', 'handling', 'try', 'catch', 'exception', 'validasi', 'pesan error', 'fallback', 'log', 'penanganan', 'throw', 'gagal', 'menangani', 'percobaan', 'keamanan']
    }
  ],
  hr: [
    {
      // H1: kekuatan terbesar
      text: 'Ceritakan satu kekuatan terbesar Anda dan bagaimana Anda menggunakannya dalam pekerjaan.',
      relevantKeywords: ['kekuatan', 'keunggulan', 'kemampuan', 'skill', 'manfaat', 'kontribusi', 'efektif', 'keahlian', 'kelebihan', 'kuat', 'andalan', 'potensi', 'kompetensi', 'mengandalkan', 'menonjol']
    },
    {
      // H2: rencana lima tahun
      text: 'Di mana Anda melihat diri Anda lima tahun ke depan? Langkah konkret apa yang sudah Anda ambil?',
      relevantKeywords: ['rencana', 'karier', 'tujuan', 'goal', 'langkah', 'ambisi', 'pengembangan', 'masa depan', 'target', 'lima tahun', 'visi', 'impian', 'cita-cita', 'berkembang', 'meningkat']
    },
    {
      // H3: alasan tertarik web developer
      text: 'Mengapa Anda tertarik dengan posisi Web Developer dan apa yang membuat Anda cocok untuk peran ini?',
      relevantKeywords: ['web developer', 'tertarik', 'passion', 'cocok', 'alasan', 'motivasi', 'pengalaman', 'relevan', 'skill', 'minat', 'sesuai', 'latar belakang', 'memenuhi syarat', 'ketertarikan', 'pilihan']
    },
    {
      // H4: pengalaman magang / kerja
      text: 'Ceritakan pengalaman magang atau kerja paruh waktu yang paling berkesan dan pelajaran yang Anda petik.',
      relevantKeywords: ['magang', 'internship', 'kerja', 'paruh waktu', 'pengalaman', 'pelajaran', 'berkesan', 'industri', 'praktik', 'nyata', 'profesional', 'lapangan', 'bekerja', 'perusahaan', 'lingkungan kerja']
    },
    {
      // H5: menyeimbangkan kuliah & kegiatan
      text: 'Bagaimana Anda menyeimbangkan kehidupan kuliah, proyek, dan kegiatan di luar akademik?',
      relevantKeywords: ['seimbang', 'menyeimbang', 'manajemen waktu', 'kuliah', 'proyek', 'kegiatan', 'prioritas', 'jadwal', 'organisasi', 'membagi', 'mengatur', 'efisien', 'disiplin', 'waktu luang', 'produktif']
    },
    {
      // H6: inisiatif di luar tanggung jawab
      text: 'Ceritakan saat Anda mengambil inisiatif di luar tanggung jawab utama Anda.',
      relevantKeywords: ['inisiatif', 'proaktif', 'di luar', 'tambahan', 'sukarela', 'ide', 'langkah', 'ekstra', 'tanpa diminta', 'mendahului', 'mengambil', 'kontribusi lebih', 'relawan', 'spontan', 'mandiri']
    },
    {
      // H7: motivasi memilih karier web
      text: 'Apa motivasi terbesar Anda memilih karier di bidang teknologi web?',
      relevantKeywords: ['motivasi', 'alasan', 'teknologi', 'web', 'passion', 'minat', 'karier', 'pilihan', 'tujuan', 'semangat', 'mendorong', 'tertarik', 'memilih', 'bidang', 'masa depan']
    },
    {
      // H8: mengelola banyak proyek paralel
      text: 'Ceritakan pengalaman Anda mengelola waktu saat mengerjakan beberapa proyek paralel.',
      relevantKeywords: ['waktu', 'paralel', 'beberapa proyek', 'prioritas', 'efisien', 'deadline', 'jadwal', 'multitasking', 'mengelola', 'mengatur', 'membagi', 'bersamaan', 'sekaligus', 'produktif', 'disiplin']
    },
    {
      // H9: definisi kerja keras
      text: 'Bagaimana Anda mendefinisikan "kerja keras" dan beri contoh nyata penerapannya.',
      relevantKeywords: ['kerja keras', 'dedikasi', 'usaha', 'contoh', 'nyata', 'disiplin', 'tekun', 'gigih', 'konsisten', 'bersungguh', 'ulet', 'pantang menyerah', 'rajin', 'serius', 'determinasi']
    },
    {
      // H10: hal tersembunyi di balik CV
      text: 'Ceritakan satu hal tentang diri Anda yang tidak terlihat dari CV tetapi relevan untuk posisi ini.',
      relevantKeywords: ['kepribadian', 'karakter', 'unik', 'tidak terlihat', 'soft skill', 'sifat', 'relevan', 'di balik', 'tersembunyi', 'nilai lebih', 'kebiasaan', 'sikap', 'hobi relevan', 'personal', 'kepribadian unik']
    }
  ]
};

/* ============================================================
   2. FUNGSI PENILAIAN STAR (masing-masing terpisah)
   ============================================================ */

/**
 * Cek komponen Situation / Task.
 * Mencari kata kunci konteks: "waktu itu", "project", "tugas saya", dll.
 * @param {string} text
 * @returns {number} skor 0-25
 */
function scoreSituation(text) {
  const patterns = [
    /waktu (itu|saya|kami|kita)/i,
    /\bproject\b/i,
    /\bproyek\b/i,
    /tugas (saya|kami|kita|itu)/i,
    /\bsituasi\b/i,
    /\bsaat (itu|saya|kami)\b/i,
    /\bketika\b/i,
    /\bpada saat\b/i,
    /\bdalam rangka\b/i,
    /\bsemester\b/i,
    /\bkuliah\b/i,
    /\bmagang\b/i,
    /\btim (saya|kami|kita)\b/i,
  ];
  const hits = patterns.filter(p => p.test(text)).length;
  // Skor proporsional: ≥3 kata kunci = nilai penuh
  return Math.min(25, Math.round((hits / 3) * 25));
}

/**
 * Cek komponen Action.
 * Mencari kata kerja aktif dan kata ganti "saya".
 * @param {string} text
 * @returns {number} skor 0-25
 */
function scoreAction(text) {
  const pronounPattern = /\bsaya\b/gi;
  const verbPatterns = [
    /\b(membuat|membangun|mengerjakan|menulis|mengembangkan|mendesain|menyelesaikan)\b/i,
    /\b(mempresentasikan|melakukan|mengimplementasikan|mengelola|memimpin)\b/i,
    /\b(berkomunikasi|berkoordinasi|mendiskusikan|memecahkan|mengatasi)\b/i,
    /\b(belajar|mempelajari|mencoba|menguji|menganalisis)\b/i,
    /\b(membantu|mendukung|bekerja sama|berkolaborasi)\b/i,
  ];
  const pronounCount = (text.match(pronounPattern) || []).length;
  const verbHits = verbPatterns.filter(p => p.test(text)).length;
  // Kombinasi: perlu min 1 kata ganti + min 1 kata kerja
  const pronounScore = pronounCount >= 2 ? 12 : (pronounCount === 1 ? 7 : 0);
  const verbScore   = Math.min(13, verbHits * 4);
  return Math.min(25, pronounScore + verbScore);
}

/**
 * Cek komponen Result.
 * Mencari angka, persentase, atau kata hasil.
 * @param {string} text
 * @returns {number} skor 0-25
 */
function scoreResult(text) {
  const numberPattern = /\d+/;                           // mengandung angka
  const percentPattern = /\d+\s*%/;                     // persentase
  const resultWords = [
    /\b(berhasil|sukses|tercapai|selesai)\b/i,
    /\b(meningkat|bertambah|naik|tumbuh)\b/i,
    /\b(menurun|berkurang|efisien|hemat)\b/i,
    /\b(nilai|skor|rating|poin)\b/i,
    /\b(diterima|disetujui|dipuji|mendapat)\b/i,
    /\b(lulus|lolos|menang|juara)\b/i,
    /\b(hasilnya|akhirnya|kesimpulannya)\b/i,
  ];
  let score = 0;
  if (percentPattern.test(text)) score += 15;        // persentase = bonus besar
  else if (numberPattern.test(text)) score += 10;    // angka tanpa %
  const wordHits = resultWords.filter(p => p.test(text)).length;
  score += Math.min(15, wordHits * 5);
  return Math.min(25, score);
}

/**
 * Cek panjang jawaban (minimal 30 kata).
 * @param {string} text
 * @returns {number} skor 0-15
 */
function scoreLength(text) {
  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount >= 60) return 15;
  if (wordCount >= 40) return 12;
  if (wordCount >= 30) return 8;
  if (wordCount >= 15) return 4;
  return 0;
}

/**
 * Penalti kata pengisi.
 * @param {string} text
 * @returns {number} poin penalti (negatif)
 */
function penaltyFillerWords(text) {
  const fillerPatterns = [
    /\bpokoknya\b/gi,
    /\bhmm+\b/gi,
    /\bgitu deh\b/gi,
    /\bgitu aja\b/gi,
    /\bya gitu\b/gi,
    /\bwhatever\b/gi,
    /\blah\b/gi,
    /\bkan\b/gi,
    /\bsih\b/gi,
    /\bdeh\b/gi,
    /\bgitu\b/gi,
    /\bsebenarnya\b/gi,
    /\bmungkin aja\b/gi,
  ];
  let totalHits = 0;
  fillerPatterns.forEach(p => {
    const hits = (text.match(p) || []).length;
    totalHits += hits;
  });
  // Penalti ringan: 3 poin per kata pengisi, maks 10
  return Math.min(10, totalHits * 3);
}

/* ============================================================
   2b. FUNGSI RELEVANSI & ANTI-PENGULANGAN (v2)
   ============================================================ */

/**
 * Menghitung skor relevansi jawaban terhadap pertanyaan.
 * Setiap keyword yang ditemukan dalam teks (case-insensitive) menambah skor.
 * Komponen ini mewakili 20% bobot dari skor akhir (20 poin dari skala 110).
 * @param {string} text
 * @param {string[]} keywords  — relevantKeywords dari objek pertanyaan
 * @returns {number} skor 0-20
 */
function scoreRelevance(text, keywords) {
  if (!keywords || keywords.length === 0) return 10; // netral jika tidak ada keywords
  const lower = text.toLowerCase();
  // Cocokkan dengan substring (kata dasar) — 'prioritas' juga cocok dengan 'prioritaskan'
  const hits  = keywords.filter(kw => lower.includes(kw.toLowerCase())).length;
  // ≥3 kecocokan = skor penuh (20).  Formula: min(20, hits/3 × 20)
  return Math.min(20, Math.round((hits / 3) * 20));
}

/**
 * Menghitung penalti pengulangan kata (anti-repetition).
 * Jika rasio kata_unik / total_kata < 0.5, kena penalti dan ditandai.
 * @param {string} text
 * @returns {{ penalty: number, ratio: number, flagged: boolean }}
 */
function penaltyRepetition(text) {
  const words = text.toLowerCase()
                    .replace(/[^a-zA-Z\u00C0-\u024F\s]/g, '') // hapus tanda baca
                    .split(/\s+/)
                    .filter(w => w.length > 1);               // abaikan kata 1 huruf
  if (words.length < 10) return { penalty: 0, ratio: 1, flagged: false }; // teks terlalu pendek, skip
  const unique  = new Set(words);
  const ratio   = unique.size / words.length;
  const flagged = ratio < 0.5;
  // Penalti proporsional: semakin rendah rasio, semakin besar penalti (maks 12)
  const penalty = flagged ? Math.round((0.5 - ratio) * 24) : 0;
  return { penalty: Math.min(12, penalty), ratio: Math.round(ratio * 100) / 100, flagged };
}

/**
 * Menghitung skor total dari sebuah jawaban.
 * Menerima objek pertanyaan agar bisa menghitung relevansi (v2).
 * @param {string} text
 * @param {string[]} [keywords=[]]  — relevantKeywords dari pertanyaan saat ini
 * @returns {{ total: number, situation: number, action: number, result: number,
 *             length: number, relevance: number, penaltyFiller: number,
 *             penaltyRep: number, repRatio: number, repFlagged: boolean }}
 */
function calculateScore(text, keywords = []) {
  const situation    = scoreSituation(text);
  const action       = scoreAction(text);
  const result       = scoreResult(text);
  const length       = scoreLength(text);
  const relevance    = scoreRelevance(text, keywords);
  const penaltyFiller = penaltyFillerWords(text);
  const rep          = penaltyRepetition(text);

  // Maks mentah = 25+25+25+15+20 = 110; dikurangi penalti, diskalakan ke 100
  const raw   = situation + action + result + length + relevance - penaltyFiller - rep.penalty;
  const total = Math.max(0, Math.min(100, Math.round((raw / 110) * 100)));

  return {
    total,
    situation,
    action,
    result,
    length,
    relevance,
    penaltyFiller,
    penaltyRep:    rep.penalty,
    repRatio:      rep.ratio,
    repFlagged:    rep.flagged,
    // alias untuk kompatibilitas mundur
    get penalty() { return this.penaltyFiller; },
  };
}

/* ============================================================
   3. FUNGSI UMPAN BALIK
   ============================================================ */

/**
 * Mengembalikan CSS class berdasarkan skor.
 * @param {number} score
 * @returns {string}
 */
function scoreClass(score) {
  if (score >= 70) return 'score-hi';
  if (score >= 40) return 'score-mid';
  return 'score-lo';
}

/**
 * Menghasilkan teks umpan balik lengkap dari hasil skor (v2: + relevansi & repetisi).
 * @param {Object} scores  — hasil calculateScore()
 * @param {string} answerText
 * @returns {{ good: string[], bad: string[], tip: string }}
 */
function generateFeedback(scores, answerText) {
  const good = [];
  const bad  = [];

  // Situation / Task
  if (scores.situation >= 18) {
    good.push('Konteks situasi atau tugas Anda disampaikan dengan jelas.');
  } else {
    bad.push('Konteks situasi/tugas masih kurang jelas (kapan, di mana, proyek apa?).');
  }

  // Action
  if (scores.action >= 18) {
    good.push('Tindakan konkret Anda terlihat dan menggunakan kata ganti "saya" dengan tepat.');
  } else {
    bad.push('Tindakan yang Anda ambil belum cukup spesifik. Gunakan lebih banyak kata kerja aktif dengan "saya…".');
  }

  // Result
  if (scores.result >= 18) {
    good.push('Hasil yang dicapai terukur dan konkret.');
  } else {
    bad.push('Hasil akhir kurang terukur. Tambahkan angka, persentase, atau kata hasil yang spesifik.');
  }

  // Length
  const wordCount = answerText.trim().split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount >= 30) {
    good.push(`Panjang jawaban (${wordCount} kata) sudah memadai.`);
  } else {
    bad.push(`Jawaban terlalu pendek (${wordCount} kata). Usahakan minimal 30–60 kata.`);
  }

  // Relevansi (v2)
  // Threshold "kurang menyentuh" hanya bila relevansi < 34% dari maks (< 7 dari 20)
  if (scores.relevance !== undefined) {
    if (scores.relevance >= 14) {
      good.push('Jawaban relevan dengan topik pertanyaan.');
    } else if (scores.relevance < 7) {
      // < 34% — benar-benar tidak menyentuh topik
      bad.push('Jawaban kurang menyentuh topik pertanyaan. Coba gunakan kata kunci yang lebih sesuai.');
    }
    // antara 7–13: tidak diberi pesan, dianggap cukup relevan
  }

  // Anti-pengulangan (v2)
  if (scores.repFlagged) {
    bad.push(`Jawaban banyak mengulang kata/kalimat (rasio kata unik: ${scores.repRatio}). Coba variasikan kosakata Anda.`);
  }

  // Filler penalty
  if (scores.penaltyFiller > 0) {
    bad.push(`Terdeteksi kata pengisi (−${scores.penaltyFiller} poin). Hindari "pokoknya", "gitu deh", dll.`);
  }

  // Pilih satu tips konkret berdasarkan kelemahan utama
  let tip = '';
  if (scores.repFlagged) {
    tip = '💡 Tips: Hindari mengulang kata yang sama. Gunakan sinonim atau kalimat dengan struktur berbeda.';
  } else if (scores.result < 15) {
    tip = '💡 Tips: Akhiri jawaban Anda dengan kalimat seperti "Hasilnya, nilai tim kami naik 20%" atau "Proyek selesai tepat waktu dan diterima klien."';
  } else if (scores.situation < 12) {
    tip = '💡 Tips: Mulai jawaban dengan frasa seperti "Waktu itu saya sedang mengerjakan proyek…" agar konteks lebih jelas.';
  } else if (scores.action < 15) {
    tip = '💡 Tips: Jelaskan langkah-langkah spesifik yang Anda ambil — "Saya mengerjakan bagian X, lalu saya mengoptimalkan Y."';
  } else if (wordCount < 30) {
    tip = '💡 Tips: Perluas jawaban Anda dengan detail tambahan tentang tantangan yang dihadapi dan solusi yang Anda pilih.';
  } else if (scores.relevance !== undefined && scores.relevance < 10) {
    tip = '💡 Tips: Pastikan jawaban Anda menyebutkan aspek-aspek yang ditanyakan secara langsung dalam pertanyaan.';
  } else {
    tip = '💡 Tips: Untuk skor lebih tinggi, tambahkan angka atau metrik konkret dalam bagian hasil jawaban Anda.';
  }

  return { good, bad, tip };
}

/**
 * Membuat HTML kartu umpan balik yang MENETAP di chat.
 * Kartu punya tombol lipat/buka (default terbuka) dan rincian skor per aspek.
 * @param {number} total
 * @param {Object} scores   — hasil calculateScore() lengkap
 * @param {{ good: string[], bad: string[], tip: string }} feedback
 * @param {number} qIndex   — nomor pertanyaan (untuk id unik)
 * @returns {string} HTML string
 */
function buildFeedbackHTML(total, scores, feedback, qIndex) {
  const cls     = scoreClass(total);
  const panelId = `fb-body-${qIndex}`;

  // Rincian skor per aspek
  const sitPct = Math.round((scores.situation / 25) * 100);
  const actPct = Math.round((scores.action     / 25) * 100);
  const resPct = Math.round((scores.result     / 25) * 100);
  const lenPct = Math.round((scores.length     / 15) * 100);
  const relPct = scores.relevance !== undefined ? Math.round((scores.relevance / 20) * 100) : null;

  function miniBar(label, pct) {
    const barCls = pct >= 70 ? 'score-hi' : pct >= 40 ? 'score-mid' : 'score-lo';
    return `
      <div class="fb-aspect-row">
        <span class="fb-aspect-label">${label}</span>
        <div class="fb-aspect-track">
          <div class="fb-aspect-fill" style="width:${pct}%;background:${
            pct >= 70 ? 'var(--clr-score-hi)' : pct >= 40 ? 'var(--clr-score-mid)' : 'var(--clr-score-lo)'
          }"></div>
        </div>
        <span class="fb-aspect-val ${barCls}">${pct}%</span>
      </div>`;
  }

  const aspectsHTML = `
    <div class="fb-aspects">
      ${miniBar('Situation/Task', sitPct)}
      ${miniBar('Action',         actPct)}
      ${miniBar('Result',         resPct)}
      ${miniBar('Kelengkapan',    lenPct)}
      ${relPct !== null ? miniBar('Relevansi', relPct) : ''}
    </div>`;

  const goodHTML = feedback.good.length
    ? `<div class="fb-section"><div class="fb-label">✅ Yang Sudah Baik</div><div class="fb-text">${feedback.good.map(g => `• ${g}`).join('<br>')}</div></div>`
    : '';
  const badHTML  = feedback.bad.length
    ? `<div class="fb-section"><div class="fb-label">⚠️ Yang Perlu Diperbaiki</div><div class="fb-text">${feedback.bad.map(b => `• ${b}`).join('<br>')}</div></div>`
    : '';
  const tipHTML  = `<div class="fb-section fb-tip"><div class="fb-text">${feedback.tip}</div></div>`;

  return `
    <div class="fb-card" data-panel="${panelId}">
      <div class="fb-card__header">
        <span class="score-badge ${cls}">${total}/100</span>
        <button type="button" class="fb-toggle btn btn--ghost btn--sm"
                aria-expanded="true" aria-controls="${panelId}">
          Sembunyikan ▲
        </button>
      </div>
      <div class="fb-card__body" id="${panelId}">
        ${aspectsHTML}
        ${goodHTML}
        ${badHTML}
        ${tipHTML}
      </div>
    </div>`;
}

/* ============================================================
   4. STATE APLIKASI
   ============================================================ */

/** @type {{ category: string, position: string, questions: string[], currentQ: number, scores: Object[], sessionStart: number }} */
const state = {
  category:     'perilaku',
  position:     'web-developer',
  questions:    [],
  currentQ:     0,
  scores:       [],      // [{total, situation, action, result, length, penalty, answer, question}]
  sessionStart: 0,
};

/* ============================================================
   5. NAVIGASI LAYAR
   ============================================================ */

/**
 * Menampilkan layar tertentu dan menyembunyikan yang lain.
 * @param {'screen-start'|'screen-chat'|'screen-summary'} id
 */
function showScreen(id) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => {
    s.classList.remove('screen--active');
    s.hidden = true;
  });
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('screen--active');
    target.hidden = false;
  }
}

/* ============================================================
   6. LOGIKA CHAT
   ============================================================ */

/** @type {HTMLUListElement} */
const chatMessages = document.getElementById('chat-messages');

/**
 * Menambahkan gelembung pesan ke UI chat.
 * @param {'agent'|'user'} role
 * @param {string} text  (boleh berisi HTML aman)
 * @param {boolean} [isHTML=false]
 * @returns {HTMLLIElement}
 */
function addBubble(role, text, isHTML = false) {
  const li = document.createElement('li');
  li.classList.add('bubble', `bubble--${role}`);
  const senderLabel = role === 'agent' ? 'Waraja' : 'Anda';
  const senderEl = `<div class="bubble__sender">${senderLabel}</div>`;
  if (isHTML) {
    li.innerHTML = senderEl + text;
  } else {
    const senderDiv = document.createElement('div');
    senderDiv.className = 'bubble__sender';
    senderDiv.textContent = senderLabel;
    const textDiv = document.createElement('div');
    textDiv.textContent = text;
    li.appendChild(senderDiv);
    li.appendChild(textDiv);
  }
  chatMessages.appendChild(li);
  li.scrollIntoView({ behavior: 'smooth', block: 'end' });
  return li;
}

/**
 * Menampilkan indikator "sedang mengetik…"
 * @returns {HTMLLIElement}
 */
function addTypingIndicator() {
  const li = document.createElement('li');
  li.classList.add('bubble', 'bubble--agent', 'bubble--typing');
  li.setAttribute('aria-label', 'Waraja sedang mengetik');
  li.innerHTML = `
    <div class="bubble__sender">Waraja</div>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  `;
  chatMessages.appendChild(li);
  li.scrollIntoView({ behavior: 'smooth', block: 'end' });
  return li;
}

/**
 * Memperbarui progress bar dan teks.
 */
function updateProgress() {
  const total = state.questions.length;
  const done  = state.currentQ;
  const fillEl = document.getElementById('progress-fill');
  const textEl = document.getElementById('progress-text');
  const bar    = fillEl?.parentElement;
  if (fillEl) fillEl.style.width = `${(done / total) * 100}%`;
  if (textEl) textEl.textContent = `${done} / ${total}`;
  if (bar)    bar.setAttribute('aria-valuenow', done);
}

/**
 * Agen mengajukan pertanyaan berikutnya setelah jeda singkat.
 * questions[] sekarang berisi objek {text, relevantKeywords}.
 */
function askNextQuestion() {
  updateProgress();

  if (state.currentQ >= state.questions.length) {
    // Semua pertanyaan sudah dijawab
    finishSession();
    return;
  }

  const qObj     = state.questions[state.currentQ]; // { text, relevantKeywords }
  const typingEl = addTypingIndicator();

  // Simulasi jeda mengetik (800 ms)
  setTimeout(() => {
    typingEl.remove();
    addBubble('agent', `Pertanyaan ${state.currentQ + 1}: ${qObj.text}`);
    enableInput();
  }, 800);
}

/**
 * Mengaktifkan input pengguna.
 */
function enableInput() {
  const inputEl = document.getElementById('user-input');
  const btnSend = document.getElementById('btn-send');
  if (inputEl) { inputEl.disabled = false; inputEl.focus(); }
  if (btnSend) btnSend.disabled = false;
}

/**
 * Menonaktifkan input pengguna (saat menunggu penilaian).
 */
function disableInput() {
  const inputEl = document.getElementById('user-input');
  const btnSend = document.getElementById('btn-send');
  if (inputEl) inputEl.disabled = true;
  if (btnSend) btnSend.disabled = true;
}

/**
 * Menangani pengiriman jawaban pengguna (v2).
 * Kartu umpan balik kini disisipkan langsung ke chat window (menetap),
 * bukan ke footer panel sementara.
 * @param {Event} e
 */
function handleSubmit(e) {
  e.preventDefault();
  const inputEl   = document.getElementById('user-input');
  const warningEl = document.getElementById('input-warning');
  const rawText   = inputEl.value;
  const text      = rawText.trim();
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;

  // Sembunyikan warning sebelumnya
  warningEl.hidden = true;
  warningEl.textContent = '';

  // Validasi: kosong
  if (!text) {
    warningEl.textContent = '⚠️ Jawaban tidak boleh kosong. Silakan ketik jawaban Anda.';
    warningEl.hidden = false;
    inputEl.focus();
    return;
  }

  // Validasi: terlalu pendek (< 5 kata)
  if (wordCount < 5) {
    warningEl.textContent = '⚠️ Jawaban terlalu singkat. Coba ceritakan lebih detail ya, minimal beberapa kalimat.';
    warningEl.hidden = false;
    inputEl.focus();
    return;
  }

  // Tampilkan jawaban pengguna
  addBubble('user', text);
  inputEl.value = '';
  disableInput();

  // Ambil keywords dari pertanyaan saat ini
  const qObj     = state.questions[state.currentQ]; // { text, relevantKeywords }
  const keywords = qObj ? qObj.relevantKeywords : [];
  const qIndex   = state.currentQ; // simpan sebelum increment

  // Hitung skor (v2: teruskan keywords untuk relevansi)
  const scores   = calculateScore(text, keywords);
  const feedback = generateFeedback(scores, text);
  const fbHTML   = buildFeedbackHTML(scores.total, scores, feedback, qIndex);

  // Simpan ke state
  state.scores.push({
    ...scores,
    answer:   text,
    question: qObj ? qObj.text : '',
  });

  state.currentQ++;

  // Sisipkan kartu umpan balik ke chat (MENETAP, tidak hilang otomatis)
  setTimeout(() => {
    const fbLi = document.createElement('li');
    fbLi.className = 'chat-feedback-item';
    fbLi.innerHTML = fbHTML;
    chatMessages.appendChild(fbLi);
    fbLi.scrollIntoView({ behavior: 'smooth', block: 'end' });

    // Pasang event listener tombol lipat/buka pada kartu ini
    fbLi.querySelector('.fb-toggle')?.addEventListener('click', function () {
      const bodyId = this.getAttribute('aria-controls');
      const bodyEl = document.getElementById(bodyId);
      const isOpen = this.getAttribute('aria-expanded') === 'true';
      if (bodyEl) {
        bodyEl.hidden = isOpen;
        this.setAttribute('aria-expanded', String(!isOpen));
        this.textContent = isOpen ? 'Tampilkan ▼' : 'Sembunyikan ▲';
      }
    });

    // Lanjut ke pertanyaan berikutnya setelah jeda singkat
    setTimeout(askNextQuestion, 900);
  }, 400);
}

/* ============================================================
   7. RINGKASAN & GRAFIK
   ============================================================ */

/**
 * Menghitung rata-rata dari array angka.
 * @param {number[]} arr
 * @returns {number}
 */
function avg(arr) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

/**
 * Menampilkan layar ringkasan dengan grafik batang CSS (v2: + bar Relevansi).
 */
function showSummary() {
  const scores = state.scores;

  // Hitung rata-rata total
  const totalAvg = avg(scores.map(s => s.total));

  // Rata-rata per aspek (dalam persen dari maks masing-masing)
  const sitPct = avg(scores.map(s => Math.round((s.situation  / 25) * 100)));
  const actPct = avg(scores.map(s => Math.round((s.action     / 25) * 100)));
  const resPct = avg(scores.map(s => Math.round((s.result     / 25) * 100)));
  const lenPct = avg(scores.map(s => Math.round((s.length     / 15) * 100)));
  const relPct = avg(scores.map(s => Math.round(((s.relevance ?? 0) / 20) * 100)));

  // Update total skor
  const totalEl = document.getElementById('total-score-display');
  if (totalEl) {
    totalEl.textContent = totalAvg;
    totalEl.className   = 'total-score ' + scoreClass(totalAvg);
  }

  // Update grafik batang (CSS custom property --pct)
  function setBar(fillId, valId, pct) {
    const fill = document.getElementById(fillId);
    const val  = document.getElementById(valId);
    if (fill) fill.style.setProperty('--pct', pct);
    if (val)  val.textContent = `${pct}%`;
    if (val)  val.className   = 'bar-group__val ' + scoreClass(pct);
    if (fill) fill.style.background = pct >= 70
      ? 'var(--clr-score-hi)'
      : pct >= 40
        ? 'var(--clr-score-mid)'
        : 'var(--clr-score-lo)';
  }

  setBar('fill-situation', 'val-situation', sitPct);
  setBar('fill-action',    'val-action',    actPct);
  setBar('fill-result',    'val-result',    resPct);
  setBar('fill-length',    'val-length',    lenPct);
  setBar('fill-relevance', 'val-relevance', relPct); // v2: bar Relevansi

  // Bangun log jawaban (v2: skor per jawaban lebih lengkap)
  const logList = document.getElementById('answer-log-list');
  logList.innerHTML = '';
  scores.forEach((s, i) => {
    const fb      = generateFeedback(s, s.answer);
    const relPctQ = Math.round(((s.relevance ?? 0) / 20) * 100);
    const li      = document.createElement('li');
    li.className  = 'log-item';
    li.innerHTML  = `
      <div class="log-item__q">Pertanyaan ${i + 1}: ${s.question}</div>
      <div class="log-item__score-row">
        <span class="log-item__score ${scoreClass(s.total)}">Total: ${s.total}/100</span>
        <span class="log-item__aspect">S/T: ${Math.round((s.situation/25)*100)}%</span>
        <span class="log-item__aspect">A: ${Math.round((s.action/25)*100)}%</span>
        <span class="log-item__aspect">R: ${Math.round((s.result/25)*100)}%</span>
        <span class="log-item__aspect">Rel: ${relPctQ}%</span>
        ${s.repFlagged ? '<span class="log-item__flag">🔁 Pengulangan</span>' : ''}
      </div>
      <div class="log-item__tip">${fb.tip}</div>
    `;
    logList.appendChild(li);
  });

  showScreen('screen-summary');
}

/**
 * Menyelesaikan sesi: menyimpan riwayat dan menampilkan ringkasan.
 */
function finishSession() {
  const typingEl = addTypingIndicator();
  setTimeout(() => {
    typingEl.remove();
    addBubble('agent', 'Sesi wawancara selesai! Terima kasih atas jawaban Anda. Mari lihat ringkasan hasil Anda.');
    setTimeout(() => {
      saveSessionToHistory();
      showSummary();
    }, 1200);
  }, 800);
}

/* ============================================================
   8. RIWAYAT SESI (localStorage)
   ============================================================ */

const STORAGE_KEY = 'waraja_history';

/**
 * Membaca riwayat dari localStorage.
 * @returns {Array}
 */
function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Menyimpan riwayat ke localStorage.
 * @param {Array} history
 */
function saveHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Storage penuh atau tidak tersedia — abaikan
  }
}

/**
 * Menyimpan sesi saat ini ke riwayat.
 */
function saveSessionToHistory() {
  const history = loadHistory();
  const scores  = state.scores;
  const totalAvg = avg(scores.map(s => s.total));

  history.unshift({
    date:     new Date(state.sessionStart).toLocaleDateString('id-ID', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              }),
    category: state.category,
    score:    totalAvg,
    answers:  scores.length,
  });

  // Simpan maks 10 sesi terakhir
  saveHistory(history.slice(0, 10));
}

/**
 * Merender daftar riwayat di layar awal.
 */
function renderHistory() {
  const history = loadHistory();
  const section  = document.getElementById('history-section');
  const list     = document.getElementById('history-list');

  if (!history.length) {
    if (section) section.hidden = true;
    return;
  }

  section.hidden = false;
  list.innerHTML = '';
  history.forEach(item => {
    const li   = document.createElement('li');
    li.className = 'history-item';
    const cls  = scoreClass(item.score);
    li.innerHTML = `
      <span class="history-item__date">${item.date} · ${item.category}</span>
      <span class="history-item__score ${cls}">${item.score}/100</span>
    `;
    list.appendChild(li);
  });
}

/* ============================================================
   9. INISIALISASI & EVENT LISTENERS
   ============================================================ */

/**
 * Memulai sesi chat baru.
 * @param {string} category
 * @param {string} position
 */
function startSession(category, position) {
  // Reset state
  state.category    = category;
  state.position    = position;
  state.currentQ    = 0;
  state.scores      = [];
  state.sessionStart = Date.now();

  // Ambil 10 pertanyaan (acak urutannya)
  const pool = [...(QUESTION_BANK[category] || QUESTION_BANK.perilaku)];
  state.questions = shuffleArray(pool).slice(0, 10);

  // Bersihkan UI chat
  chatMessages.innerHTML = '';
  const warningEl = document.getElementById('input-warning');
  if (warningEl) warningEl.hidden = true;

  // Update subjudul
  const sub = document.getElementById('chat-subtitle');
  const CATEGORY_LABEL = { perilaku: 'Perilaku', teknis: 'Teknis', hr: 'HR / Umum' };
  if (sub) sub.textContent = `Pewawancara AI · ${CATEGORY_LABEL[category] || category}`;

  updateProgress();
  showScreen('screen-chat');

  // Salam pembuka
  const typingEl = addTypingIndicator();
  setTimeout(() => {
    typingEl.remove();
    addBubble('agent',
      `Halo! Saya Waraja, agent pelatih wawancara Anda. Sesi ini berisi ${state.questions.length} pertanyaan kategori ${CATEGORY_LABEL[category]}. Jawab setiap pertanyaan menggunakan metode STAR: Situation, Task, Action, dan Result. Siap? Mari mulai!`
    );
    setTimeout(askNextQuestion, 1000);
  }, 900);
}

/**
 * Mengacak array (Fisher-Yates).
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── DOM Ready ──────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  /* --- Layar Awal --- */
  renderHistory();
  showScreen('screen-start');

  // Form mulai
  const startForm = document.getElementById('start-form');
  startForm?.addEventListener('submit', e => {
    e.preventDefault();
    const position = document.getElementById('select-position')?.value || 'web-developer';
    const catInput = startForm.querySelector('input[name="category"]:checked');
    const category = catInput ? catInput.value : 'perilaku';
    startSession(category, position);
  });

  // Hapus riwayat
  document.getElementById('btn-clear-history')?.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    renderHistory();
  });

  /* --- Layar Chat --- */
  // Kembali ke awal
  document.getElementById('btn-back')?.addEventListener('click', () => {
    renderHistory();
    showScreen('screen-start');
  });

  // Submit jawaban via form
  document.getElementById('chat-form')?.addEventListener('submit', handleSubmit);

  // Enter untuk kirim (Shift+Enter = baris baru)
  document.getElementById('user-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.getElementById('chat-form')?.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  });

  /* --- Layar Ringkasan --- */
  // Coba lagi (kategori + posisi sama)
  document.getElementById('btn-retry')?.addEventListener('click', () => {
    startSession(state.category, state.position);
  });

  // Kembali ke beranda
  document.getElementById('btn-home')?.addEventListener('click', () => {
    renderHistory();
    showScreen('screen-start');
  });

});
