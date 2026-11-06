document.addEventListener('DOMContentLoaded', async () => {
  // Dapatkan tab yang sedang aktif
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const listElement = document.getElementById('m3u8-list');
  const statusElement = document.getElementById('status');

  // Ambil data dari storage berdasarkan ID tab
  const result = await chrome.storage.local.get(`tab_${tab.id}`);
  const urls = result[`tab_${tab.id}`] || [];

  if (urls.length > 0) {
    statusElement.style.display = 'none'; // Sembunyikan status kosong
    urls.forEach(url => {
      const li = document.createElement('li');

      // Buat span untuk URL
      const span = document.createElement('span');
      span.textContent = url;

      // Buat tombol salin
      const copyBtn = document.createElement('button');
      copyBtn.textContent = 'Salin';
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(url).then(() => {
          copyBtn.textContent = 'Tersalin!';
          setTimeout(() => copyBtn.textContent = 'Salin', 2000);
        });
      };

      li.appendChild(span);
      li.appendChild(copyBtn);
      listElement.appendChild(li);
    });
  } else {
    statusElement.textContent = 'Tidak ada file .m3u8 yang terdeteksi di tab ini.';
  }
});