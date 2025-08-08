window.function = function (htmlParam, fileNameParam) {
  try {
    // Ambil input (Glide biasanya kirim { value: "..." })
    const htmlRaw = (htmlParam && typeof htmlParam === 'object' && 'value' in htmlParam)
      ? String(htmlParam.value)
      : String(htmlParam ?? '');

    const fileNameRaw = (fileNameParam && typeof fileNameParam === 'object' && 'value' in fileNameParam)
      ? String(fileNameParam.value)
      : String(fileNameParam ?? 'print');

    // sanitasi nama file untuk keamanan
    const safeFileName = fileNameRaw.replace(/[^\w\-\.]+/g, '_');

    // encode HTML user supaya tidak memutus <script> wrapper saat kita embed
    const encodedUserHtml = encodeURIComponent(htmlRaw);

    // CSS termasuk .invoice width:350px
    const customCSS = `
      body { margin: 0 !important; background: #fff; font-family: Arial, sans-serif; }
      .invoice { width: 350px; height: auto; border-bottom: 5px dashed #000; padding: 0; box-sizing: border-box; }
      #print { width:100%; border: none; height:36px; background:#0353A7; color:#fff; font-weight:600; cursor:pointer; position:fixed; top:0; left:0; z-index:9999; }
      #content { margin-top:40px; } /* beri ruang untuk tombol */
    `;

    // Halaman HTML yang akan dibuka (kita injek HTML user via decodeURIComponent di dalamnya)
    const originalHTML = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${safeFileName}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
  <style>${customCSS}</style>
</head>
<body>
  <button id="print">Print</button>
  <div id="content" class="invoice"></div>

  <script>
    (function () {
      try {
        // Masukkan HTML user ke #content (safe karena kita menggunakan encoded string)
        var contentEl = document.getElementById('content');
        contentEl.innerHTML = decodeURIComponent("${encodedUserHtml}");

        // Fungsi print: hitung tinggi konten setelah render dan cetak sesuai ukuran
        function doPrint() {
          try {
            var el = document.getElementById('content');

            // Lebar tetap 350px (sesuai CSS), tinggi otomatis dari konten
            var elementWidth = 350;
            // scrollHeight memberi tinggi penuh konten termasuk overflow
            var elementHeight = Math.max(el.scrollHeight, el.offsetHeight, el.clientHeight || 0);

            // Minimal height safety (jika 0 atau terlalu kecil)
            if (!elementHeight || elementHeight < 50) {
              elementHeight = 600;
            }

            var opt = {
              margin: 0,
              filename: '${safeFileName}.pdf',
              html2canvas: { useCORS: true, scale: 2 },
              jsPDF: {
                unit: 'px',
                orientation: 'portrait',
                format: [elementWidth, elementHeight],
                hotfixes: ['px_scaling']
              }
            };

            // Jalankan konversi dan buka hasil (bloburl) untuk dicetak
            html2pdf().set(opt).from(el).toPdf().get('pdf').then(function (pdf) {
              try {
                pdf.autoPrint();
              } catch (e) {
                console.warn('autoPrint error (non-fatal):', e);
              }
              window.open(pdf.output('bloburl'), '_blank');
            }).catch(function (err) {
              console.error('html2pdf error:', err);
              alert('Gagal membuat PDF — lihat console untuk detail.');
            });
          } catch (e) {
            console.error('doPrint internal error:', e);
            alert('Kesalahan saat proses print — lihat console.');
          }
        }

        document.getElementById('print').addEventListener('click', doPrint);

        // (opsional) auto-scroll ke atas supaya tombol tidak menutup konten saat preview
        window.scrollTo(0, 0);
      } catch (e) {
        console.error('init error:', e);
        document.body.insertAdjacentHTML('beforeend', '<pre style="color:red">Init error: ' + (e && e.toString()) + '</pre>');
      }
    })();
  </script>
</body>
</html>`;

    // Encode halaman final jadi data URL
    const encodedHtml = encodeURIComponent(originalHTML);
    return "data:text/html;charset=utf-8," + encodedHtml;
  } catch (err) {
    // Jika masih error di sisi function, kembalikan pesan error agar driver bisa menampilkan
    const msg = (err && err.toString && err.toString()) || 'Unknown error in function';
    return "ERROR: " + msg;
  }
};
