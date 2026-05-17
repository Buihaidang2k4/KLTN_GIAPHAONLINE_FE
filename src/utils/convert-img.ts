

export async function imageToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.onerror = () => reject(new Error(`Cannot load image: ${url}`));
        // Thêm cache-bust để tránh CORS cache
        img.src = url + (url.includes("?") ? "&" : "?") + "_cb=" + Date.now();
    });
}

/**
 * Convert nhiều URL cùng lúc, trả về Map<url, base64>
 */
export async function batchImagesToBase64(
  urls: string[]
): Promise<Map<string, string>> {
  const unique = [...new Set(urls.filter(Boolean))];
  const results = await Promise.allSettled(
    unique.map((url) => imageToBase64(url).then((b64) => ({ url, b64 })))
  );
  const map = new Map<string, string>();
  results.forEach((r) => {
    if (r.status === "fulfilled") map.set(r.value.url, r.value.b64);
  });
  return map;
}



