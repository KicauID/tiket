window.function = function (html) {
    // Ambil HTML dari param Glide
    html = html?.value ?? "No HTML set.";

    // CSS khusus untuk tombol dan layout
    const customCSS = `
        body { margin: 0!important; }
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
        .button:hover { background: #f5f5f5; color: #000000; }
        .button.printing { background: #ffffff; color: #000000; }
        .button.done { background: #ffffff; color: #000000; }
        ::-webkit-scrollbar { width: 5px; background-color: rgb(0 0 0 / 8%); }
        ::-webkit-scrollbar-thumb { background-color: rgb(0 0 0 / 32%); border-radius: 4px; }
    `;

    // HTML yang akan dibuka saat print
    const originalHTML = `
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
        <style>${customCSS}</style>
        <div class="main">
            <button class="button" id="print">Print</button>
            <div id="content" class="content">${html}</div>
        </div>
        <script>
            document.getElementById('print').addEventListener('click', function() {
                var element = document.getElementById('content');
                var button = this;
                button.innerText = 'PRINTING...';
                button.className = 'printing';

                var opt = {
                    margin: 0,
                    filename: 'print.pdf',
                    html2canvas: { useCORS: true, scale: 2 },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };

                html2pdf().set(opt).from(element).toPdf().get('pdf').then(function(pdf) {
                    pdf.autoPrint();
                    window.open(pdf.output('bloburl'), '_blank');
                    button.innerText = 'PRINT DONE';
                    button.className = 'done';
                    setTimeout(function() {
                        button.innerText = 'Print';
                        button.className = '';
                    }, 2000);
                });
            });
        </script>
    `;

    // Encode HTML agar aman dibuka di browser
    const encodedHtml = encodeURIComponent(originalHTML)
        .replace(/'/g, "%27")
        .replace(/"/g, "%22");

    return "data:text/html;charset=utf-8," + encodedHtml;
};
