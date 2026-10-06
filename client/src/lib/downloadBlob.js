// Triggers a browser download for an already-fetched blob response (invoice
// PDF, etc.) — kept as a one-liner so future blob downloads don't repeat
// the object-URL dance inline.
export function downloadBlob(data, filename) {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}
