window.function = function (htmlParam, fileNameParam) {
  try {
    // Ambil input HTML
    const htmlRaw = (htmlParam && typeof htmlParam === 'object' && 'value' in htmlParam)
      ? String(htmlParam.value)
      : String(htmlParam ?? '');

    const fileNameRaw = (fileNameParam && typeof fileNameParam === 'object' && 'value' in fileNameParam)
      ? String(fileNameParam.value)
      : String(fileNameParam ?? 'print');

    const safeFileName = fileNameRaw.replace(/[^\w\-\.]+/g, '_');
    const encodedUserHtml = encodeURIComponent(htmlRaw);

    // CSS: lebar tetap 350px, semua margin/padding atas dihapus total
    const customCSS = `
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #fff;
        font-family: Arial, sans-serif;
      }
      * {
        margin-top: 0 !important;
        padding-top: 0 !important;
      }
      .invoice {
        width: 350px;
        height: auto;
        border-bottom: 5px dashed #000;
        padding: 0;
        box-sizing: border-box;
      }
      #print {
        width:100%;
        border: none;
        height:36px;
        background:#0353A7;
        color:#fff;
        font-weight:600;
        cursor:pointer;
        position:fixed;
        top:0;
        left:0;
        z-index:9999;
      }
    `;

    // HTML akhir
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
        var contentEl = document.getElementById('content');
        contentEl.innerHTML = decodeURIComponent("${encodedUserHtml}");

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

            html2pdf().set(opt).from(el).toPdf().get('pdf').then(
