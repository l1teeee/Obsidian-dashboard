import { useCallback, useEffect, useRef, useState } from 'react';
import { CHANNEL_FROM_PLATFORM, PLATFORM_MAP } from '../domain/entities/Composer';
import type { ChannelId } from '../types/composer.types';
import * as postsService from '../services/posts.service';
import type { MediaItem } from './useComposerMedia';

export interface DraftSnapshot {
  caption:          string;
  mediaItems:       MediaItem[];
  isScheduleMode:   boolean;
  scheduleDate:     Date;
  selectedChannels: ChannelId[];
}

interface DraftSetters {
  setCaption:          (v: string) => void;
  setMediaItems:       (items: MediaItem[]) => void;
  setSelectedChannels: (ids: ChannelId[]) => void;
  setPreviewTab:       (id: ChannelId) => void;
  setScheduleDate:     (d: Date) => void;
  setIsScheduleMode:   (v: boolean) => void;
}

export interface UseComposerDraftReturn {
  draftLoading:      boolean;
  createdDraftIdRef: React.MutableRefObject<string | null>;
  /** Save current state as draft. Coordinator calls this with a snapshot of its state. */
  autoSaveDraft:     (snapshot: DraftSnapshot) => Promise<void>;
}

export function useComposerDraft(
  editId:    string | undefined,
  setters:   DraftSetters,
  onCreated: () => void,
): UseComposerDraftReturn {
  // Tracks the ID of a newly created draft so subsequent saves update instead of creating
  const createdDraftIdRef                 = useRef<string | null>(null);
  const [draftLoading, setDraftLoading]   = useState(!!editId);

  // Load existing draft when editId is provided
  useEffect(() => {
    if (!editId) return;
    let cancelled = false;
    setDraftLoading(true);
    postsService.getById(editId)
      .then(post => {
        if (cancelled) return;
        setters.setCaption(post.caption ?? '');

        if (post.media_urls?.length) {
          const isVideoUrl = (url: string) => /\.(mp4|mov|webm|avi)(\?|#|$)/i.test(url);
          setters.setMediaItems(post.media_urls.map(url => ({
            previewUrl: url,
            sourceUrl:  url,
            mediaType:  isVideoUrl(url) ? 'video' : 'image',
          })));
        }

        const channel = CHANNEL_FROM_PLATFORM[post.platform] ?? 'ig';
        setters.setSelectedChannels([channel]);
        setters.setPreviewTab(channel);

        if (post.scheduled_at) {
          setters.setScheduleDate(new Date(post.scheduled_at));
          setters.setIsScheduleMode(true);
        }
      })
      .catch(() => { /* draft fetch failed — start with empty state */ })
      .finally(() => { if (!cancelled) setDraftLoading(false); });
    return () => { cancelled = true; };
  // Setters are stable references; editId is effectively a constant per composer mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  const autoSaveDraft = useCallback(async (snapshot: DraftSnapshot): Promise<void> => {
    const { caption, mediaItems, isScheduleMode, scheduleDate, selectedChannels } = snapshot;

    const mediaUrls = mediaItems
      .map(i => i.sourceUrl)
      .filter((u): u is string => !!u && u.startsWith('http'));

    const scheduled_at = isScheduleMode ? scheduleDate.toISOString() : undefined;
    const effectiveId  = editId ?? createdDraftIdRef.current;

    if (effectiveId) {
      await postsService.update(effectiveId, {
        caption:      caption || undefined,
        media_urls:   mediaUrls.length ? mediaUrls : undefined,
        status:       'draft',
        scheduled_at,
      });
    } else {
      const created = await postsService.create({
        platform:     PLATFORM_MAP[selectedChannels[0] ?? 'ig'],
        post_type:    'post',
        caption:      caption || undefined,
        media_urls:   mediaUrls.length ? mediaUrls : undefined,
        status:       'draft',
        scheduled_at,
      });
      createdDraftIdRef.current = created.id;
      onCreated();
    }
  }, [editId, onCreated]);

  return { draftLoading, createdDraftIdRef, autoSaveDraft };
}
