import { createAdminClient } from './admin';

const BUCKET_NAME = 'recipe-images';

export async function uploadImage(
  file: File,
  path: string
): Promise<string | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function uploadImageFromBuffer(
  buffer: Buffer,
  path: string,
  contentType: string
): Promise<string | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, buffer, {
      cacheControl: '3600',
      upsert: true,
      contentType,
    });

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function deleteImage(path: string): Promise<boolean> {
  const supabase = createAdminClient();

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path]);

  if (error) {
    console.error('Error deleting image:', error);
    return false;
  }

  return true;
}

export async function deleteRecipeImages(recipeId: number): Promise<boolean> {
  const supabase = createAdminClient();

  // List all files in the recipe's folder
  const { data: files, error: listError } = await supabase.storage
    .from(BUCKET_NAME)
    .list(`${recipeId}`);

  if (listError) {
    console.error('Error listing recipe images:', listError);
    return false;
  }

  if (!files || files.length === 0) {
    return true; // No files to delete
  }

  // Delete all files in the folder
  const filePaths = files.map((file) => `${recipeId}/${file.name}`);
  const { error: deleteError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove(filePaths);

  if (deleteError) {
    console.error('Error deleting recipe images:', deleteError);
    return false;
  }

  return true;
}

export function getStorageUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${path}`;
}
