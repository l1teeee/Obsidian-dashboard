import { apiFetch } from '../lib/api';

export interface UploadResult {
  url:      string;
  filename: string;
  size:     number;
  mimeType: string;
}

/** Upload a single file via the backend. Returns the public S3 URL. Best for images (< 20 MB). */
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

interface PresignResult {
  presignedUrl: string;
  key:          string;
  publicUrl:    string;
  expiresIn:    number;
}

/**
 * Upload a file DIRECTLY to S3 via a presigned PUT URL.
 * The file never passes through the backend — ideal for large videos.
 * Returns the public S3 URL to store as sourceUrl in the post.
 */
export async function presignUpload(file: File): Promise<UploadResult> {
  // Step 1: get presigned URL from backend
  const { data } = await apiFetch<PresignResult>('/media/presign', {
    method: 'POST',
    body:   JSON.stringify({ mimeType: file.type }),
  });

  // Step 2: PUT file directly to S3 — no auth headers (presigned URL is self-contained)
  const putRes = await fetch(data.presignedUrl, {
    method:  'PUT',
    headers: { 'Content-Type': file.type },
    body:    file,
  });
  if (!putRes.ok) {
    throw new Error(`S3 upload failed: ${putRes.status} ${putRes.statusText}`);
  }

  return {
    url:      data.publicUrl,
    filename: file.name,
    size:     file.size,
    mimeType: file.type,
  };
}
