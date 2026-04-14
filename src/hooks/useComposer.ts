import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CHANNELS } from '../domain/entities/Composer';
import type { ChannelId } from '../types/composer.types';
import { listConnections } from '../services/platforms.service';
import { postsStore } from '../lib/postsStore';
import { useComposerMedia } from './useComposerMedia';
import { useComposerDraft } from './useComposerDraft';
import { useComposerSubmit } from './useComposerSubmit';

export type ActionType = 'draft' | 'publish' | 'schedule';

// Re-export so consumers keep the same import path
export type { MediaItem } from './useComposerMedia';

export function useComposer(onSuccess?: (type: ActionType, names: string) => void, editId?: string) {
  const pageRef       = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── UI state owned by the coordinator ─────────────────────────────────────
  const [caption,          setCaption]         = useState('');
  const [selectedChannels, setSelectedChannels] = useState<ChannelId[]>(['ig']);
  const [previewTab,       setPreviewTab]       = useState<ChannelId>('ig');
  const [scheduleDate,     setScheduleDate]     = useState<Date>(() => {
    const d = new Date();
    d.setTime(d.getTime() + 60 * 60 * 1000); // +1 hour from now
    return d;
  });
  const [toast,           setToast]           = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDirty,         setIsDirty]         = useState(false);
  const [isScheduleMode,  setIsScheduleMode]  = useState(false);
  // Platform account info — shown in ChannelSelector and previews
  const [fbPageName,       setFbPageName]       = useState<string | null>(null);
  const [igAccountName,    setIgAccountName]    = useState<string | null>(null);
  const [liConnected,      setLiConnected]      = useState(true); // LinkedIn: default true (API doesn't track it yet)
  const [connectionsLoaded, setConnectionsLoaded] = useState(false);

  // ── Sub-hooks ──────────────────────────────────────────────────────────────
  const markDirty = useCallback(() => setIsDirty(true), []);

  const media = useComposerMedia(markDirty);

  const draft = useComposerDraft(
    editId,
    {
      setCaption,
      setMediaItems:       media.setMediaItems,
      setSelectedChannels,
      setPreviewTab,
      setScheduleDate,
      setIsScheduleMode,
    },
    useCallback(() => postsStore.invalidate(), []),
  );

  const submit = useComposerSubmit();

  // ── Platform connections ───────────────────────────────────────────────────
  useEffect(() => {
    listConnections()
      .then(conns => {
        const fb = conns.find(c => c.platform === 'facebook' && c.page_id);
        setFbPageName(fb?.page_name ?? null);

        const ig = conns.find(c => c.platform === 'instagram');
        setIgAccountName(ig?.account_name ?? null);

        const li = conns.find(c => (c.platform as string) === 'linkedin');
        if (li !== undefined) setLiConnected(true);
      })
      .catch(() => { /* no connections — silently ignore */ })
      .finally(() => setConnectionsLoaded(true));
  }, []);

  // ── GSAP entrance animation ────────────────────────────────────────────────
  useEffect(() => {
    if (draft.draftLoading) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-editor-panel]',   { x: -30, opacity: 0, duration: 0.55, ease: 'power3.out', delay: 0.1 });
      gsap.from('[data-phone-mockup]',   { scale: 0.92, opacity: 0, duration: 0.6, ease: 'back.out(1.2)', delay: 0.25 });
      gsap.from('[data-editor-section]', { y: 16, opacity: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.3 });
    }, pageRef.current!);
    return () => ctx.revert();
  }, [draft.draftLoading]);

  // ── Toast cleanup ──────────────────────────────────────────────────────────
  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(msg);
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const handleCaptionChange = useCallback((val: string) => {
    setCaption(val);
    setIsDirty(true);
  }, []);

  const toggleChannel = useCallback((id: ChannelId) => {
    setSelectedChannels(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // keep at least one
        const next = prev.filter(c => c !== id);
        if (previewTab === id) setPreviewTab(next[0]);
        return next;
      }
      setPreviewTab(id);
      return [...prev, id];
    });
    setIsDirty(true);
  }, [previewTab]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const channelConnected: Record<ChannelId, boolean> = {
    ig: !!igAccountName,
    fb: !!fbPageName,
    li: liConnected,
  };

  const unconnectedChannelNames = connectionsLoaded
    ? selectedChannels
        .filter(ch => !channelConnected[ch])
        .map(ch => CHANNELS.find(c => c.id === ch)?.label ?? ch)
    : [];

  const hasContent = caption.length > 0 || media.mediaItems.length > 0;

  // ── Public API: snapshot-injecting wrappers ────────────────────────────────
  /** Zero-argument wrapper — used by PostComposer's navigation guard */
  const autoSaveDraft = useCallback(async (): Promise<void> => {
    await draft.autoSaveDraft({ caption, mediaItems: media.mediaItems, isScheduleMode, scheduleDate, selectedChannels });
    setIsDirty(false);
  }, [draft, caption, media.mediaItems, isScheduleMode, scheduleDate, selectedChannels]);

  /** Single-argument wrapper — injects current state snapshot into submit sub-hook */
  const handleAction = useCallback(async (type: ActionType): Promise<void> => {
    await submit.handleAction(
      type,
      { caption, mediaItems: media.mediaItems, selectedChannels, scheduleDate, editId, unconnectedChannelNames },
      showToast,
      onSuccess,
    );
  }, [submit, caption, media.mediaItems, selectedChannels, scheduleDate, editId, unconnectedChannelNames, showToast, onSuccess]);

  return {
    caption,           setCaption,
    handleCaptionChange,
    mediaItems:        media.mediaItems,
    selectedChannels,
    previewTab,        setPreviewTab,
    scheduleDate,      setScheduleDate,
    toast,
    showSuggestions,   setShowSuggestions,
    isSubmitting:      submit.isSubmitting,
    draftLoading:      draft.draftLoading,
    hasContent,
    isDirty,
    isScheduleMode,    setIsScheduleMode,
    fbPageName,
    igAccountName,
    channelConnected,
    unconnectedChannelNames,
    toggleChannel,
    handleFileChange:       media.handleFileChange,
    handleFilesSelected:    media.handleFilesSelected,
    handleAIImageGenerated: media.handleAIImageGenerated,
    handleReplaceMedia:     media.handleReplaceMedia,
    removeMedia:            media.removeMedia,
    handleAction,
    autoSaveDraft,
    pageRef,
    fileInputRef: media.fileInputRef,
  };
}
