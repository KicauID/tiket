window.function = async function (html) {
    const fidelity = 4; // kualitas tinggi default
    const fileName = "print";
    const orientation = "portrait";
    const margin = 0;

    // Ambil HTML dari parameter
    html = html.value ?? "No HTML set.";

    // TEMPORARY DOM untuk ukur dimensi HTML
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.visibility = "hidden";
    tempDiv.innerHTML = html;
    document.body.appendChild(tempDiv);

    const rect = tempDiv.getBoundingClientRect();
    const dimensions = [rect.width, rect.height];
    document.body.removeChild(tempDiv);

    console.log(`Auto size detected: ${dimensions}`);

    const customCSS = `
        body { margin: 0!important; }
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
                    jsPDF: { unit: 'px', orientation: '${orientation}', format: [${dimensions[0]}, ${dimensions[1]}] }
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
