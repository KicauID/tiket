window.function = async function (
    html, fileName, format, zoom, orientation, margin, fidelity, customDimensions, autoSize
) {
    const fidelityMap = { low: 1, standard: 1.5, high: 2, veryHigh: 3, ultra: 4 };

    html = html.value ?? "No HTML set.";
    fileName = fileName.value ?? "file";
    format = format.value ?? "tiket";
    zoom = parseFloat(zoom.value ?? "1");
    orientation = orientation.value ?? "portrait";
    margin = parseInt(margin.value ?? "0");
    const quality = fidelityMap[fidelity.value] ?? 4;
    customDimensions = customDimensions.value ? customDimensions.value.split(",").map(Number) : null;
    autoSize = (autoSize?.value ?? "false").toLowerCase() === "true";

    const formatDimensions = {
        tiket: [350, 350],
        tiket1: [350, 500],
        A4: [595.28, 841.89],   // ukuran px @ 72dpi
        Letter: [612, 792]
    };

    let dimensions = customDimensions || formatDimensions[format] || [350, 350];

    // AUTO DETECT SIZE
    if (autoSize) {
        const tempDiv = document.createElement("div");
        tempDiv.style.position = "absolute";
        tempDiv.style.visibility = "hidden";
        tempDiv.innerHTML = html;
        document.body.appendChild(tempDiv);

        const rect = tempDiv.getBoundingClientRect();
        dimensions = [rect.width, rect.height];
        document.body.removeChild(tempDiv);

        console.log(`Auto size detected: ${dimensions}`);
    }

    const finalDimensions = dimensions.map((d) => Math.round(d / zoom));

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
            <div id="content" class="content thermal-${format}">${html}</div>
        </div>
        <script>
            document.getElementById('print').addEventListener('click', function() {
                var element = document.getElementById('content');
                var button = this;
                button.innerText = 'PRINTING...';
                button.className = 'printing';
                var opt = {
                    margin: ${margin},
                    filename: '${fileName}',
                    html2canvas: { useCORS: true, scale: ${quality} },
                    jsPDF: { unit: 'px', orientation: '${orientation}', format: [${finalDimensions[0]}, ${finalDimensions[1]}] }
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
