// Menyimpan daftar m3u8 yang terdeteksi per tab
const m3u8List = {};

// Mendengarkan semua permintaan yang akan terjadi
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    // Filter: Hanya proses jika URL mengandung '.m3u8'
    // dan abaikan request dari tab ekstensi itu sendiri
    if (details.url.includes('.m3u8') && details.tabId !== -1) {
      const tabId = details.tabId;

      // Jika tab ini belum ada di daftar, inisialisasi
      if (!m3u8List[tabId]) {
        m3u8List[tabId] = new Set();
      }

      // Tambahkan URL ke Set (otomatis menduplikasi)
      m3u8List[tabId].add(details.url);

      // Simpan ke storage agar bisa diakses oleh popup
      // Kita simpan sebagai array karena Set tidak bisa diserialisasi
      chrome.storage.local.set({ [`tab_${tabId}`]: [...m3u8List[tabId]] });

      console.log(`M3U8 Terdeteksi di Tab ${tabId}:`, details.url);
    }
  },
  { urls: ["<all_urls>"] } // Pantau semua URL
);

// Membersihkan data saat tab ditutup
chrome.tabs.onRemoved.addListener((tabId) => {
  delete m3u8List[tabId];
  chrome.storage.local.remove(`tab_${tabId}`);
});