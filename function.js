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
    body {
        margin: 0!important;
    }

    .button {
        width: 100%;
        border-radius: 0;
        font-size: 14px;
        font-weight: 600;
        line-height: 1.5rem;
        color: #ffffff;
        border: none;
        font-family: 'Arial';
        padding: 0px 12px;
        height: 32px;
        text-transform: uppercase;
        cursor: pointer;
        box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 1px 2.5px rgba(0, 0, 0, 0.1);
        position: fixed;
        top: 0;
        z-index: 1000;
        background: #0353A7;
    }

    .button:hover {
        background: #f5f5f5;
        color: #000000;
    }

    .button.printing {
        background: #ffffff;
        color: #000000;
    }

    .button.done {
        background: #ffffff;
        color: #000000;
    }

    ::-webkit-scrollbar {
        width: 5px;
        background-color: rgb(0 0 0 / 8%);
    }

    ::-webkit-scrollbar-thumb {
        background-color: rgb(0 0 0 / 32%);
        border-radius: 4px;
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
