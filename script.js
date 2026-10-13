/**
 * WARAJA – script.js
 * Agent Pelatih Wawancara STAR — Vanilla JS ES6+, tanpa library
 *
 * Struktur:
 *   1. Bank Pertanyaan
 *   2. Fungsi Penilaian STAR (masing-masing terpisah)
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

/** @type {Object.<string, string[]>} */
const QUESTION_BANK = {
  perilaku: [
    'Ceritakan pengalaman Anda saat harus bekerja sama dalam tim yang sulit. Apa yang Anda lakukan dan bagaimana hasilnya?',
    'Berikan contoh saat Anda menghadapi deadline yang sangat ketat. Bagaimana Anda mengatasinya?',
    'Pernahkah Anda membuat kesalahan dalam pekerjaan atau kuliah? Ceritakan dan apa yang Anda pelajari?',
    'Ceritakan situasi di mana Anda harus memimpin kelompok meskipun Anda bukan pemimpin resminya.',
    'Berikan contoh bagaimana Anda menyesuaikan diri dengan perubahan mendadak dalam proyek.',
    'Ceritakan saat Anda menerima kritik dari dosen atau atasan. Bagaimana respons Anda?',
    'Pernahkah Anda memotivasi rekan yang tidak bersemangat? Apa yang Anda lakukan?',
    'Ceritakan pengalaman Anda menyelesaikan konflik dengan anggota tim.',
    'Berikan contoh saat Anda harus memprioritaskan beberapa tugas sekaligus.',
    'Ceritakan proyek yang paling membanggakan selama kuliah dan kontribusi konkret Anda.'
  ],
  teknis: [
    'Ceritakan pengalaman Anda membangun sebuah fitur web dari nol. Teknologi apa yang Anda gunakan dan bagaimana hasilnya?',
    'Berikan contoh saat Anda menemukan bug yang sulit. Bagaimana proses debugging Anda?',
    'Ceritakan pengalaman mengoptimalkan performa sebuah halaman web. Apa yang Anda lakukan dan seberapa besar peningkatannya?',
    'Pernahkah Anda melakukan code review atau review kode orang lain? Ceritakan prosesnya.',
    'Ceritakan bagaimana Anda belajar teknologi baru yang dibutuhkan proyek dalam waktu singkat.',
    'Berikan contoh saat Anda menerapkan prinsip responsive design. Apa tantangan utamanya?',
    'Ceritakan pengalaman Anda bekerja dengan version control (Git) dalam tim.',
    'Bagaimana Anda memastikan aksesibilitas (a11y) pada proyek web Anda? Beri contoh konkret.',
    'Ceritakan saat Anda harus menulis dokumentasi teknis. Siapa audiensnya dan bagaimana pendekatannya?',
    'Berikan contoh bagaimana Anda menangani error handling di aplikasi yang pernah Anda buat.'
  ],
  hr: [
    'Ceritakan satu kekuatan terbesar Anda dan bagaimana Anda menggunakannya dalam pekerjaan.',
    'Di mana Anda melihat diri Anda lima tahun ke depan? Langkah konkret apa yang sudah Anda ambil?',
    'Mengapa Anda tertarik dengan posisi Web Developer dan apa yang membuat Anda cocok untuk peran ini?',
    'Ceritakan pengalaman magang atau kerja paruh waktu yang paling berkesan dan pelajaran yang Anda petik.',
    'Bagaimana Anda menyeimbangkan kehidupan kuliah, proyek, dan kegiatan di luar akademik?',
    'Ceritakan saat Anda mengambil inisiatif di luar tanggung jawab utama Anda.',
    'Apa motivasi terbesar Anda memilih karier di bidang teknologi web?',
    'Ceritakan pengalaman Anda mengelola waktu saat mengerjakan beberapa proyek paralel.',
    'Bagaimana Anda mendefinisikan "kerja keras" dan beri contoh nyata penerapannya.',
    'Ceritakan satu hal tentang diri Anda yang tidak terlihat dari CV tetapi relevan untuk posisi ini.'
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

/**
 * Menghitung skor total dari sebuah jawaban.
 * @param {string} text
 * @returns {{ total: number, situation: number, action: number, result: number, length: number, penalty: number }}
 */
function calculateScore(text) {
  const situation = scoreSituation(text);
  const action    = scoreAction(text);
  const result    = scoreResult(text);
  const length    = scoreLength(text);
  const penalty   = penaltyFillerWords(text);

  // Total maks 90 (25+25+25+15) dikurangi penalti, lalu diskalakan ke 100
  const raw   = situation + action + result + length - penalty;
  const total = Math.max(0, Math.min(100, Math.round((raw / 90) * 100)));

  return { total, situation, action, result, length, penalty };
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
 * Menghasilkan teks umpan balik lengkap dari hasil skor.
 * @param {{ total: number, situation: number, action: number, result: number, length: number, penalty: number }} scores
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

  // Filler penalty
  if (scores.penalty > 0) {
    bad.push(`Terdeteksi kata pengisi (−${scores.penalty} poin). Hindari "pokoknya", "gitu deh", dll.`);
  }

  // Pilih satu tips konkret berdasarkan kelemahan utama
  let tip = '';
  if (scores.result < 15) {
    tip = '💡 Tips: Akhiri jawaban Anda dengan kalimat seperti "Hasilnya, nilai tim kami naik 20%" atau "Proyek selesai tepat waktu dan diterima klien."';
  } else if (scores.situation < 12) {
    tip = '💡 Tips: Mulai jawaban dengan frasa seperti "Waktu itu saya sedang mengerjakan proyek…" agar konteks lebih jelas.';
  } else if (scores.action < 15) {
    tip = '💡 Tips: Jelaskan langkah-langkah spesifik yang Anda ambil — "Saya mengerjakan bagian X, lalu saya mengoptimalkan Y."';
  } else if (wordCount < 30) {
    tip = '💡 Tips: Perluas jawaban Anda dengan detail tambahan tentang tantangan yang dihadapi dan solusi yang Anda pilih.';
  } else {
    tip = '💡 Tips: Untuk skor lebih tinggi, tambahkan angka atau metrik konkret dalam bagian hasil jawaban Anda.';
  }

  return { good, bad, tip };
}

/**
 * Membuat HTML untuk panel umpan balik.
 * @param {number} total
 * @param {{ good: string[], bad: string[], tip: string }} feedback
 * @returns {string}
 */
function buildFeedbackHTML(total, feedback) {
  const cls  = scoreClass(total);
  const goodHTML = feedback.good.length
    ? `<div class="fb-section"><div class="fb-label">✅ Yang Sudah Baik</div><div class="fb-text">${feedback.good.map(g => `• ${g}`).join('<br>')}</div></div>`
    : '';
  const badHTML  = feedback.bad.length
    ? `<div class="fb-section"><div class="fb-label">⚠️ Yang Perlu Diperbaiki</div><div class="fb-text">${feedback.bad.map(b => `• ${b}`).join('<br>')}</div></div>`
    : '';
  const tipHTML  = `<div class="fb-section"><div class="fb-text">${feedback.tip}</div></div>`;

  return `
    <div class="score-badge ${cls}">${total}/100</div>
    ${goodHTML}
    ${badHTML}
    ${tipHTML}
  `;
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
 */
function askNextQuestion() {
  updateProgress();

  if (state.currentQ >= state.questions.length) {
    // Semua pertanyaan sudah dijawab
    finishSession();
    return;
  }

  const question = state.questions[state.currentQ];
  const typingEl = addTypingIndicator();

  // Simulasi jeda mengetik (800 ms)
  setTimeout(() => {
    typingEl.remove();
    addBubble('agent', `Pertanyaan ${state.currentQ + 1}: ${question}`);
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
 * Menangani pengiriman jawaban pengguna.
 * @param {Event} e
 */
function handleSubmit(e) {
  e.preventDefault();
  const inputEl  = document.getElementById('user-input');
  const warningEl = document.getElementById('input-warning');
  const feedbackPanel = document.getElementById('feedback-panel');
  const rawText  = inputEl.value;
  const text     = rawText.trim();
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;

  // Sembunyikan warning sebelumnya
  warningEl.hidden = true;
  warningEl.textContent = '';
  feedbackPanel.hidden = true;

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

  // Hitung skor
  const scores   = calculateScore(text);
  const feedback = generateFeedback(scores, text);
  const fbHTML   = buildFeedbackHTML(scores.total, feedback);

  // Simpan ke state
  state.scores.push({
    ...scores,
    answer:   text,
    question: state.questions[state.currentQ],
  });

  state.currentQ++;

  // Tampilkan umpan balik setelah jeda
  setTimeout(() => {
    feedbackPanel.innerHTML = fbHTML;
    feedbackPanel.hidden = false;

    // Pertanyaan berikutnya setelah umpan balik
    setTimeout(() => {
      feedbackPanel.hidden = true;
      askNextQuestion();
    }, 3500);
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
 * Menampilkan layar ringkasan dengan grafik batang CSS.
 */
function showSummary() {
  const scores = state.scores;

  // Hitung rata-rata total
  const totalAvg = avg(scores.map(s => s.total));

  // Rata-rata per aspek (dalam persen dari maks masing-masing)
  const sitPct    = avg(scores.map(s => Math.round((s.situation / 25) * 100)));
  const actPct    = avg(scores.map(s => Math.round((s.action     / 25) * 100)));
  const resPct    = avg(scores.map(s => Math.round((s.result     / 25) * 100)));
  const lenPct    = avg(scores.map(s => Math.round((s.length     / 15) * 100)));

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
    // Warna batang sesuai skor
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

  // Bangun log jawaban
  const logList = document.getElementById('answer-log-list');
  logList.innerHTML = '';
  scores.forEach((s, i) => {
    const fb  = generateFeedback(s, s.answer);
    const li  = document.createElement('li');
    li.className = 'log-item';
    li.innerHTML = `
      <div class="log-item__q">Q${i + 1}: ${s.question}</div>
      <div class="log-item__score ${scoreClass(s.total)}">Skor: ${s.total}/100</div>
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
  const feedbackPanel = document.getElementById('feedback-panel');
  if (feedbackPanel) feedbackPanel.hidden = true;
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
