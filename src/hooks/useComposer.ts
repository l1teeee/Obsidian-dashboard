import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CHANNELS } from '../domain/entities/Composer';
import type { ChannelId } from '../domain/entities/Composer';
import * as postsService from '../services/posts.service';

// Maps frontend channel IDs to backend platform values
const PLATFORM_MAP: Record<ChannelId, string> = {
  ig: 'meta',
  li: 'linkedin',
  fb: 'meta',
};

export type ActionType = 'draft' | 'publish' | 'schedule';

export function useComposer(onSuccess?: (type: ActionType, names: string) => void) {
  const pageRef      = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [caption,          setCaption]         = useState('');
  const [mediaPreview,     setMediaPreview]     = useState<string | null>(null);
  const [selectedChannels, setSelectedChannels] = useState<ChannelId[]>(['ig']);
  const [previewTab,       setPreviewTab]       = useState<ChannelId>('ig');
  const [scheduleDate,     setScheduleDate]     = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 15, 0, 0);
    return d;
  });
  const [toast,        setToast]        = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => { if (mediaPreview) URL.revokeObjectURL(mediaPreview); };
  }, [mediaPreview]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-editor-panel]',   { x: -30, opacity: 0, duration: 0.55, ease: 'power3.out', delay: 0.1 });
      gsap.from('[data-phone-mockup]',   { scale: 0.92, opacity: 0, duration: 0.6, ease: 'back.out(1.2)', delay: 0.25 });
      gsap.from('[data-editor-section]', { y: 16, opacity: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.3 });
    }, pageRef.current!);
    return () => ctx.revert();
  }, []);

  const toggleChannel = (id: ChannelId) => {
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
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaPreview(URL.createObjectURL(file));
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = async (type: ActionType) => {
    setIsSubmitting(true);
    try {
      const statusMap = {
        draft:    'draft',
        publish:  'published',
        schedule: 'scheduled',
      } as const;

      await Promise.all(
        selectedChannels.map(channelId =>
          postsService.create({
            platform:     PLATFORM_MAP[channelId],
            post_type:    'post',
            caption:      caption || undefined,
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
    } catch (err) {
      showToast(`Error: ${(err as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    caption,        setCaption,
    mediaPreview,   setMediaPreview,
    selectedChannels,
    previewTab,     setPreviewTab,
    scheduleDate,   setScheduleDate,
    toast,
    showSuggestions, setShowSuggestions,
    isSubmitting,
    toggleChannel,
    handleFileChange,
    handleAction,
    pageRef,
    fileInputRef,
  };
}
