import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CHANNELS } from '../domain/entities/Composer';
import type { ChannelId } from '../domain/entities/Composer';
import * as postsService from '../services/posts.service';
import { uploadFile } from '../services/media.service';

const PLATFORM_MAP: Record<ChannelId, string> = {
  ig: 'meta',
  li: 'linkedin',
  fb: 'meta',
};

// Reverse: platform string stored in DB → ChannelId
const CHANNEL_FROM_PLATFORM: Record<string, ChannelId> = {
  meta:      'ig',
  instagram: 'ig',
  linkedin:  'li',
  facebook:  'fb',
};

export type ActionType = 'draft' | 'publish' | 'schedule';

export interface MediaItem {
  previewUrl:    string;            // blob URL or HTTP URL — for display
  sourceUrl?:    string;            // persisted HTTP URL — stored in media_urls
  uploading?:    boolean;           // true while the file is being uploaded
  uploadError?:  string;            // set if the upload failed
}

const MAX_MEDIA = 10;

export function useComposer(onSuccess?: (type: ActionType, names: string) => void, editId?: string) {
  const pageRef        = useRef<HTMLDivElement>(null);
  const fileInputRef   = useRef<HTMLInputElement>(null);
  const toastTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [caption,          setCaption]          = useState('');
  const [mediaItems,       setMediaItems]        = useState<MediaItem[]>([]);
  const [selectedChannels, setSelectedChannels]  = useState<ChannelId[]>(['ig']);
  const [previewTab,       setPreviewTab]        = useState<ChannelId>('ig');
  const [scheduleDate,     setScheduleDate]      = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 15, 0, 0);
    return d;
  });
  const [toast,            setToast]            = useState<string | null>(null);
  const [showSuggestions,  setShowSuggestions]  = useState(false);
  const [isSubmitting,     setIsSubmitting]     = useState(false);
  const [draftLoading,     setDraftLoading]     = useState(!!editId);
  const [isScheduleMode,   setIsScheduleMode]   = useState(false);
  // isDirty: true only when the user has made actual changes (not just loaded a draft)
  const [isDirty,          setIsDirty]          = useState(false);

  // Load draft data when editing an existing post
  useEffect(() => {
    if (!editId) return;
    let cancelled = false;
    setDraftLoading(true);
    postsService.getById(editId)
      .then(post => {
        if (cancelled) return;
        setCaption(post.caption ?? '');

        if (post.media_urls?.length) {
          setMediaItems(post.media_urls.map(url => ({ previewUrl: url, sourceUrl: url })));
        }

        const channel = CHANNEL_FROM_PLATFORM[post.platform] ?? 'ig';
        setSelectedChannels([channel]);
        setPreviewTab(channel);

        if (post.scheduled_at) {
          setScheduleDate(new Date(post.scheduled_at));
          setIsScheduleMode(true);
        }
      })
      .catch(() => { /* draft fetch failed — start with empty state */ })
      .finally(() => { if (!cancelled) setDraftLoading(false); });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  // Revoke blob URLs on unmount
  useEffect(() => {
    return () => {
      mediaItems.forEach(item => {
        if (item.previewUrl.startsWith('blob:')) URL.revokeObjectURL(item.previewUrl);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (draftLoading) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-editor-panel]',   { x: -30, opacity: 0, duration: 0.55, ease: 'power3.out', delay: 0.1 });
      gsap.from('[data-phone-mockup]',   { scale: 0.92, opacity: 0, duration: 0.6, ease: 'back.out(1.2)', delay: 0.25 });
      gsap.from('[data-editor-section]', { y: 16, opacity: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.3 });
    }, pageRef.current!);
    return () => ctx.revert();
  }, [draftLoading]);

  /** Caption change initiated by the user — marks the form dirty */
  const handleCaptionChange = useCallback((val: string) => {
    setCaption(val);
    setIsDirty(true);
  }, []);

  const toggleChannel = useCallback((id: ChannelId) => {
    setSelectedChannels(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        const next = prev.filter(c => c !== id);
        if (previewTab === id) setPreviewTab(next[0]);
        return next;
      }
      setPreviewTab(id);
      return [...prev, id];
    });
    setIsDirty(true);
  }, [previewTab]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    if (fileInputRef.current) fileInputRef.current.value = '';

    setMediaItems(prev => {
      const slots   = MAX_MEDIA - prev.length;
      const allowed = files.slice(0, slots);
      if (!allowed.length) return prev;

      // Add items immediately with uploading:true for instant preview + spinner
      const newItems: MediaItem[] = allowed.map(f => ({
        previewUrl: URL.createObjectURL(f),
        uploading:  true,
      }));

      // Upload each file individually in the background
      const startIndex = prev.length;
      allowed.forEach((file, i) => {
        const index = startIndex + i;
        uploadFile(file)
          .then(result => {
            setMediaItems(current =>
              current.map((item, idx) =>
                idx === index
                  ? { ...item, sourceUrl: result.url, uploading: false }
                  : item,
              ),
            );
          })
          .catch(() => {
            setMediaItems(current =>
              current.map((item, idx) =>
                idx === index
                  ? { ...item, uploading: false, uploadError: 'Upload failed' }
                  : item,
              ),
            );
          });
      });

      return [...prev, ...newItems];
    });

    setIsDirty(true);
  }, []);

  const handleAIImageGenerated = useCallback((blobUrl: string, sourceUrl: string) => {
    setMediaItems(prev => {
      if (prev.length >= MAX_MEDIA) return prev;
      return [...prev, { previewUrl: blobUrl, sourceUrl }];
    });
    setIsDirty(true);
  }, []);

  const removeMedia = useCallback((index: number) => {
    setMediaItems(prev => {
      const item = prev[index];
      if (item && item.previewUrl.startsWith('blob:')) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
    setIsDirty(true);
  }, []);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(msg);
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  // Clear pending toast timer on unmount
  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  const hasContent = caption.length > 0 || mediaItems.length > 0;

  /** Silent save as draft — no animation, no toast. Used for auto-save on navigation. */
  const autoSaveDraft = async (): Promise<void> => {
    const mediaUrls = mediaItems
      .map(i => i.sourceUrl)
      .filter((u): u is string => !!u && u.startsWith('http'));

    if (editId) {
      await postsService.update(editId, {
        caption:    caption || undefined,
        media_urls: mediaUrls.length ? mediaUrls : undefined,
        status:     'draft',
      });
    } else {
      await postsService.create({
        platform:  PLATFORM_MAP[selectedChannels[0] ?? 'ig'],
        post_type: 'post',
        caption:   caption || undefined,
        media_urls: mediaUrls.length ? mediaUrls : undefined,
        status:    'draft',
      });
    }
    setIsDirty(false);
  };

  const handleAction = async (type: ActionType) => {
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
        // Update existing draft
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
        // Create new posts (one per selected channel)
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
  };

  return {
    caption,           setCaption,
    handleCaptionChange,
    mediaItems,
    selectedChannels,
    previewTab,        setPreviewTab,
    scheduleDate,      setScheduleDate,
    toast,
    showSuggestions,   setShowSuggestions,
    isSubmitting,
    draftLoading,
    hasContent,
    isDirty,
    isScheduleMode,    setIsScheduleMode,
    toggleChannel,
    handleFileChange,
    handleAIImageGenerated,
    removeMedia,
    handleAction,
    autoSaveDraft,
    pageRef,
    fileInputRef,
  };
}
