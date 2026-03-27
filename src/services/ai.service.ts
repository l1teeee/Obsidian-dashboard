import { apiFetch } from '../lib/api';

export interface GenerateImagePayload {
  prompt: string;
  size?:  '1024x1024' | '1792x1024' | '1024x1792';
}

export interface GenerateImageResult {
  dataUrl:        string;   // data:image/png;base64,... — use directly in <img src>
  revised_prompt: string;
}

export async function generateImage(payload: GenerateImagePayload): Promise<GenerateImageResult> {
  const res = await apiFetch<GenerateImageResult>('/ai/generate-image', {
    method: 'POST',
    body:   JSON.stringify(payload),
  });
  return res.data;
}

export interface InspirePayload {
  topic:        string;
  platform?:    string;
  workspaceId?: string;
}

export interface InspireResult {
  captions:  string[];
  hashtags:  string[];
}

export async function getInspiration(payload: InspirePayload): Promise<InspireResult> {
  const res = await apiFetch<InspireResult>('/ai/inspire', {
    method: 'POST',
    body:   JSON.stringify(payload),
  });
  return res.data;
}
