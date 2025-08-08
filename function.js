window.function = async function (html) {
    const fidelity = 4; // kualitas tinggi default
    const fileName = "print";
    const orientation = "portrait";
    const margin = 0;

    html = html.value ?? "No HTML set.";

    // TEMPORARY DOM untuk ukur dimensi real konten
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.visibility = "hidden";
    tempDiv.style.left = "-9999px"; 
    tempDiv.style.top = "-9999px";
    tempDiv.style.background = "white";
    tempDiv.style.padding = "0";
    tempDiv.innerHTML = html;
    document.body.appendChild(tempDiv);

    let width = tempDiv.scrollWidth;
    let height = tempDiv.scrollHeight;

    // Fallback jika terlalu kecil → gunakan A4 px @72dpi
    if (width < 100 || height < 100) {
        width = 595.28;
        height = 841.89;
        console.log("Fallback to A4 size");
    }

    document.body.removeChild(tempDiv);

    console.log(`Auto size detected: ${width} x ${height}`);

    const customCSS = `
        body { margin: 0!important; background: white; }
        .button {
            width: 100%;
            border-radius: 0;
            font-size: 14px;
            font-weight: 600;
            color: #fff;
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
        .button:hover { background: #f5f5f5; color: #000; }
    `;

    const originalHTML = `
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
        <style>${customCSS}</style>
        <div class="main">
            <button class="button" id="print">Print</button>
            <div id="content">${html}</div>
        </div>
        <script>
            document.getElementById('print').addEventListener('click', function() {
                var element = document.getElementById('content');
                var button = this;
                button.innerText = 'PRINTING...';
                var opt = {
                    margin: ${margin},
                    filename: '${fileName}',
                    html2canvas: { useCORS: true, scale: ${fidelity} },
                    jsPDF: { unit: 'px', orientation: '${orientation}', format: [${width}, ${height}] }
                };
                html2pdf().set(opt).from(element).toPdf().get('pdf').then(function(pdf) {
                    pdf.autoPrint();
                    window.open(pdf.output('bloburl'), '_blank');
                    button.innerText = 'PRINT DONE';
                    setTimeout(() => { button.innerText = 'Print'; }, 2000);
                });
            });
        </script>
    `;

    return "data:text/html;charset=utf-8," + encodeURIComponent(originalHTML);
};
