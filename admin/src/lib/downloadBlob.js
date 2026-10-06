// Triggers a browser download for an already-fetched blob response (CSV
// export, invoice PDF, etc.) — same object-URL dance was copy-pasted at
// every call site before this.
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
