import { apiFetch } from '../lib/api';

export interface AiSettingsData {
  persona?:             string;
  brand_voice?:         string;
  target_audience?:     string;
  content_pillars?:     string;
  hashtag_strategy?:    string;
  example_posts?:       string;
  avoid?:               string;
  custom_instructions?: string;
}

export interface AiSettings extends AiSettingsData {
  id?:          string;
  workspace_id?: string;
}

export async function getAiSettings(workspaceId: string): Promise<AiSettings> {
  const res = await apiFetch<AiSettings>(`/ai-settings/${workspaceId}`);
  return res.data;
}

export async function saveAiSettings(workspaceId: string, data: AiSettingsData): Promise<AiSettings> {
  const res = await apiFetch<AiSettings>(`/ai-settings/${workspaceId}`, {
    method: 'PUT',
    body:   JSON.stringify(data),
  });
  return res.data;
}
