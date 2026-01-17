import { put, remove } from '@vercel/blob';

/**
 * Upload a file to Vercel Blob Storage
 * @param file - The file to upload
 * @param folder - Optional folder path (e.g., 'premade', 'custom')
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  folder?: string
): Promise<string> {
  // Generate a unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const pathname = folder ? `${folder}/${fileName}` : fileName;

  try {
    const blob = await put(pathname, file, {
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    });

    return blob.url;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete a file from Vercel Blob Storage
 * @param url - The public URL of the file to delete
 */
export async function deleteFile(url: string): Promise<void> {
  try {
    await remove(url, {
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    });
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
