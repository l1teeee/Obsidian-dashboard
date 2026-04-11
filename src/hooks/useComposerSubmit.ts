import { useCallback, useState } from 'react';
import { CHANNELS, PLATFORM_MAP } from '../domain/entities/Composer';
import type { ChannelId } from '../types/composer.types';
import * as postsService from '../services/posts.service';
import { postsStore } from '../lib/postsStore';
import type { ActionType } from './useComposer';
import type { MediaItem } from './useComposerMedia';

export interface SubmitSnapshot {
  caption:                 string;
  mediaItems:              MediaItem[];
  selectedChannels:        ChannelId[];
  scheduleDate:            Date;
  editId:                  string | undefined;
  unconnectedChannelNames: string[];
}

export interface UseComposerSubmitReturn {
  isSubmitting: boolean;
  handleAction: (
    type:       ActionType,
    snapshot:   SubmitSnapshot,
    showToast:  (msg: string) => void,
    onSuccess?: (type: ActionType, names: string) => void,
  ) => Promise<void>;
}

export function useComposerSubmit(): UseComposerSubmitReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = useCallback(async (
    type:       ActionType,
    snapshot:   SubmitSnapshot,
    showToast:  (msg: string) => void,
    onSuccess?: (type: ActionType, names: string) => void,
  ): Promise<void> => {
    const { caption, mediaItems, selectedChannels, scheduleDate, editId, unconnectedChannelNames } = snapshot;

    // Block publish/schedule when a selected channel has no connected account
    if (type !== 'draft' && unconnectedChannelNames.length > 0) {
      showToast(`No account connected for ${unconnectedChannelNames.join(', ')}. Save as draft instead.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const statusMap = {
        draft:    'draft',
        publish:  'published',
        schedule: 'scheduled',
      } as const;

      const mediaUrls = mediaItems
        .map(i => i.sourceUrl)
        .filter((u): u is string => !!u && u.startsWith('http'));

      if (editId) {
        // Update existing post/draft
        await postsService.update(editId, {
          caption:      caption || undefined,
          media_urls:   mediaUrls.length ? mediaUrls : undefined,
          status:       statusMap[type],
          scheduled_at: type === 'schedule' ? scheduleDate.toISOString() : undefined,
        });

        const channel = selectedChannels[0] ?? 'ig';
        const names   = CHANNELS.find(c => c.id === channel)?.label ?? channel;
        if (onSuccess) {
          onSuccess(type, names);
        } else {
          if (type === 'draft')    showToast('Draft updated successfully');
          if (type === 'publish')  showToast(`Post published to ${names}`);
          if (type === 'schedule') showToast(`Scheduled for ${scheduleDate.toLocaleString()}`);
        }
      } else {
        // Create new posts — one per selected channel
        await Promise.all(
          selectedChannels.map(channelId =>
            postsService.create({
              platform:     PLATFORM_MAP[channelId],
              post_type:    'post',
              caption:      caption || undefined,
              media_urls:   mediaUrls.length ? mediaUrls : undefined,
              status:       statusMap[type],
              scheduled_at: type === 'schedule' ? scheduleDate.toISOString() : undefined,
            })
          )
        );
        // Invalidate cache so Posts page fetches fresh data on next mount
        postsStore.invalidate();

        const names = selectedChannels.map(id => CHANNELS.find(c => c.id === id)?.label).join(', ');
        if (onSuccess) {
          onSuccess(type, names);
        } else {
          const dateStr = scheduleDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          const timeStr = scheduleDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
          if (type === 'draft')    showToast('Draft saved successfully');
          if (type === 'publish')  showToast(`Post published to ${names}`);
          if (type === 'schedule') showToast(`Scheduled for ${dateStr} at ${timeStr} on ${names}`);
        }
      }
    } catch (err) {
      showToast(`Error: ${(err as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { isSubmitting, handleAction };
}
