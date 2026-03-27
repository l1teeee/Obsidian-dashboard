import { apiFetch } from '../lib/api';

export interface UploadResult {
  url:      string;
  filename: string;
  size:     number;
  mimeType: string;
}

/** Upload a single file. Returns the public URL from the storage adapter. */
export async function uploadFile(file: File): Promise<UploadResult> {
  const form = new FormData();
  form.append('file', file);

  const res = await apiFetch<UploadResult>('/media/upload', {
    method:  'POST',
    body:    form,
    // Do NOT set Content-Type — browser must set it with the multipart boundary
    headers: {},
  });
  return res.data;
}
