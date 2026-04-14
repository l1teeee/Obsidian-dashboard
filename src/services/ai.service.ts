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
  topic?:       string;
  platform?:    string;
  workspaceId?: string;
  imageUrls?:   string[];
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

export interface SuggestTimePayload {
  caption?:     string;
  platforms:    string[];
  currentHour?: number;   // client's local hour (0-23)
  weekday?:     string;   // client's local weekday name
}

export interface SuggestTimeResult {
  hour:      number;
  minute:    number;
  dayOffset: number;
  reason:    string;
}

export async function suggestScheduleTime(payload: SuggestTimePayload): Promise<SuggestTimeResult> {
  const res = await apiFetch<SuggestTimeResult>('/ai/suggest-time', {
    method: 'POST',
    body:   JSON.stringify(payload),
  });
  return res.data;
}

export interface AnalyzeImagePayload {
  imageUrls:    string[];
  platforms:    string[];
  workspaceId?: string;
  currentHour?: number;
  weekday?:     string;
}

export interface AnalyzeImageResult {
  captions: string[];
  hashtags: string[];
  bestTime: {
    hour:      number;
    minute:    number;
    dayOffset: number;
    reason:    string;
  };
}

export async function analyzeImageForPost(payload: AnalyzeImagePayload): Promise<AnalyzeImageResult> {
  const res = await apiFetch<AnalyzeImageResult>('/ai/analyze-image', {
    method: 'POST',
    body:   JSON.stringify(payload),
  });
  return res.data;
}

export interface CarouselSlidesPayload {
  topic:  string;
  count:  number;
  style?: string;
}

export interface CarouselSlidesResult {
  slides: string[];
}

export async function generateCarouselSlides(payload: CarouselSlidesPayload): Promise<CarouselSlidesResult> {
  const res = await apiFetch<CarouselSlidesResult>('/ai/carousel-slides', {
    method: 'POST',
    body:   JSON.stringify(payload),
  });
  return res.data;
}

export interface EditImagePayload {
  imageDataUrl: string;
  maskDataUrl:  string;
  instruction:  string;
}

export interface EditImageResult {
  dataUrl: string;
}

export async function editImage(payload: EditImagePayload): Promise<EditImageResult> {
  const res = await apiFetch<EditImageResult>('/ai/edit-image', {
    method: 'POST',
    body:   JSON.stringify(payload),
  });
  return res.data;
}
