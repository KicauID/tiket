window.function = function (html, fileName) {
    const fidelityMap = {
        low: 1,
        standard: 1.5,
        high: 2,
        veryHigh: 3,
        ultra: 4
    };

    html = html.value ?? "No HTML set.";
    fileName = fileName.value ?? "file";
    const quality = fidelityMap["high"];

    const customCSS = `
    body {
        margin: 0!important;
    }
    .invoice {
        width: 350px;
        height: auto;
        border-bottom: 5px dashed #000;
        padding: 0px;
        box-sizing: border-box;
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
        position: fixed;
        top: 0;
        z-index: 1000;
        background: #0353A7;
    }
    .button:hover {
        background: #f5f5f5;
        color: #000000;
    }
    `;

    const originalHTML = `
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
    <style>${customCSS}</style>
    <div class="main">
        <button class="button" id="print">Print</button>
        <div id="content" class="invoice">${html}</div>
    </div>
    <script>
        document.getElementById('print').addEventListener('click', function() {
            var element = document.getElementById('content');
            var button = this;
            button.innerText = 'PRINTING...';
            button.className = 'printing';

            var elementWidth = 350; 
            var elementHeight = element.scrollHeight;

            var opt = {
                margin: 0,
                filename: '${fileName}',
                html2canvas: {
                    useCORS: true,
                    scale: ${quality}
                },
                jsPDF: {
                    unit: 'px',
                    orientation: 'portrait',
                    format: [elementWidth, elementHeight],
                    hotfixes: ['px_scaling']
                }
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

    var encodedHtml = encodeURIComponent(originalHTML);
    return "data:text/html;charset=utf-8," + encodedHtml;
};
