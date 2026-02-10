const MAX_UPLOAD_SIZE = 25 * 1024 * 1024; // 25MB - reject above this
const MAX_STORAGE_SIZE = 2 * 1024 * 1024;  // 2MB - compress to this

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
  const originalWidth = bitmap.width;
  const originalHeight = bitmap.height;

  const canvas = document.createElement('canvas');
  canvas.width = originalWidth;
  canvas.height = originalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  // Try progressively lower quality until we're under the limit
  let quality = 0.85;
  const minQuality = 0.1;
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

  // If still too large after minimum quality, scale down dimensions
  let scale = 0.75;
  while (scale >= 0.25) {
    canvas.width = Math.round(originalWidth * scale);
    canvas.height = Math.round(originalHeight * scale);

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
