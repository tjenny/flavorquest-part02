/**
 * Upload utility that returns fake URLs for demo purposes
 */
export async function uploadFile(file: File): Promise<string> {
  // Return fake URL immediately
  const fakeUrl = `https://fake-upload.com/${Date.now()}-${file.name}`;
  
  return fakeUrl;
}

/**
 * Upload multiple files
 */
export async function uploadFiles(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(file => uploadFile(file));
  return Promise.all(uploadPromises);
}
