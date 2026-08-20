export const IMAGE_MAX_DIMENSION = 1600;
export const IMAGE_JPEG_QUALITY = 0.8;
const RECOMPRESS_MIN_BYTES = 150 * 1024;
const COMPRESSIBLE = new Set(["image/jpeg", "image/png", "image/webp"]);

function loadImage(file: File): Promise<ImageBitmap> {
  return createImageBitmap(file, { imageOrientation: "from-image" }).catch(() =>
    createImageBitmap(file)
  );
}

export async function compressImage(file: File): Promise<File> {
  if (!COMPRESSIBLE.has(file.type) || file.size <= RECOMPRESS_MIN_BYTES) return file;

  try {
    const bitmap = await loadImage(file);
    if (bitmap.width <= 0 || bitmap.height <= 0) {
      bitmap.close();
      return file;
    }
    const scale = Math.min(1, IMAGE_MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }

    // PNG/WEBP can carry transparency — flattening to a white background and
    // forcing JPEG would silently destroy it, so keep those as PNG (no matte).
    const hasAlpha = file.type === "image/png" || file.type === "image/webp";
    if (!hasAlpha) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const outType = hasAlpha ? "image/png" : "image/jpeg";
    const outExt = hasAlpha ? "png" : "jpg";
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, outType, hasAlpha ? undefined : IMAGE_JPEG_QUALITY)
    );
    if (!blob || blob.size >= file.size) return file;

    const base = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${base}.${outExt}`, {
      type: outType,
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  }
}