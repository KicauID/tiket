window.addEventListener("message", async function(event) {
    const { data: { key, params } } = event;

    let result, error;
    try {
        // Hanya meneruskan param HTML
        result = await window.function(...params);
    } catch (e) {
        result = undefined;
        try {
            error = e.toString();
        } catch {
            error = "Exception can't be stringified.";
        }
    }

    const response = { key };
    if (result !== undefined) {
        response.result = { value: result };
    }
    if (error !== undefined) {
        response.error = error;
    }

    event.source.postMessage(response, "*");
});
