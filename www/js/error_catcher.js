window.errors = [];
window.onerror = function(message, source, lineno, colno, error) {
    window.errors.push({
        message: message,
        source: source,
        lineno: lineno,
        colno: colno,
        error: error
    });
}