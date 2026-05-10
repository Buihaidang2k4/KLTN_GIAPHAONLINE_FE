export const formatByte = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}


export const formatMbToGb = (mb: number) => {
    if (!mb) return "0 GB";

    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
}