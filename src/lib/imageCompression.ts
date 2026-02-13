const MAX_UPLOAD_SIZE = 25 * 1024 * 1024;    // 25MB - reject above this
const MAX_STORAGE_SIZE = 500 * 1024;          // 500KB - compress to this
const MAX_DIMENSION = 1600;                   // Max width/height in pixels

export function needsCompression(file: File): boolean {
  return file.size > MAX_STORAGE_SIZE;
}

export function isTooLarge(file: File): boolean {
  return file.size > MAX_UPLOAD_SIZE;
}

export async function compressImage(file: File): Promise<File> {
  if (file.size <= MAX_STORAGE_SIZE) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  let width = bitmap.width;
  let height = bitmap.height;

  // Scale down to MAX_DIMENSION first if needed
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // Try progressively lower quality until we're under the limit
  let quality = 0.8;
  const minQuality = 0.3;
  const qualityStep = 0.1;

  while (quality >= minQuality) {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    );

    if (!blob) throw new Error('Failed to compress image');

    if (blob.size <= MAX_STORAGE_SIZE) {
      return new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
        type: 'image/jpeg',
      });
    }

    quality -= qualityStep;
  }

  // If still too large, scale down further
  let scale = 0.75;
  while (scale >= 0.25) {
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);

    const scaledBitmap = await createImageBitmap(file);
    ctx.drawImage(scaledBitmap, 0, 0, canvas.width, canvas.height);
    scaledBitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.7)
    );

    if (!blob) throw new Error('Failed to compress image');

    if (blob.size <= MAX_STORAGE_SIZE) {
      return new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
        type: 'image/jpeg',
      });
    }

    scale -= 0.25;
  }

  throw new Error('Unable to compress image to target size');
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
