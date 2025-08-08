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

    // CSS fix overlay tombol
    const customCSS = `
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #fff;
        font-family: Arial, sans-serif;
      }

      .button {
        width: 100%;
        height: 32px;
        border-radius: 0;
        font-size: 14px;
        font-weight: 600;
        line-height: 32px;
        color: #ffffff;
        border: none;
        padding: 0 12px;
        text-transform: uppercase;
        cursor: pointer;
        box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 1px 2.5px rgba(0, 0, 0, 0.1);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        background: #0353A7;
      }

      .button:hover {
        background: #f5f5f5;
        color: #000000;
      }

      .button.printing,
      .button.done {
        background: #ffffff;
        color: #000000;
      }

      .invoice {
        width: 350px;
        height: auto;
        padding: 0;
        box-sizing: border-box;
        margin-top: 0 !important;
      }

      ::-webkit-scrollbar {
        width: 5px;
        background-color: rgba(0, 0, 0, 0.08);
      }

      ::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.32);
        border-radius: 4px;
      }
    `;

    // Halaman HTML yang akan dibuka
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
  <button class="button" id="print">PRINT</button>
  <div id="content" class="invoice"></div>

  <script>
    (function () {
      try {
        // Masukkan HTML user
        var contentEl = document.getElementById('content');
        contentEl.innerHTML = decodeURIComponent("${encodedUserHtml}");

        // Fungsi print
        function doPrint() {
          try {
            var el = document.getElementById('content');
            var elementWidth = 350;
            var elementHeight = Math.max(el.scrollHeight, el.offsetHeight, el.clientHeight || 0);
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

            html2pdf().set(opt).from(el).toPdf().get('pdf').then(function (pdf) {
              try { pdf.autoPrint(); } catch (e) { console.warn('autoPrint error:', e); }
              window.open(pdf.output('bloburl'), '_blank');
            }).catch(function (err) {
              console.error('html2pdf error:', err);
              alert('Gagal membuat PDF — lihat console.');
            });
          } catch (e) {
            console.error('doPrint internal error:', e);
            alert('Kesalahan saat proses print.');
          }
        }

        document.getElementById('print').addEventListener('click', doPrint);
        window.scrollTo(0, 0);
      } catch (e) {
        console.error('init error:', e);
        document.body.insertAdjacentHTML('beforeend', '<pre style="color:red">Init error: ' + e + '</pre>');
      }
    })();
  </script>
</body>
</html>`;

    return "data:text/html;charset=utf-8," + encodeURIComponent(originalHTML);
  } catch (err) {
    return "ERROR: " + (err?.toString?.() || 'Unknown error');
  }
};
