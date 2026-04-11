import { useCallback, useEffect, useRef, useState } from 'react';
import { uploadFile } from '../services/media.service';

export interface MediaItem {
  previewUrl:      string;            // blob URL or HTTP URL — for display
  sourceUrl?:      string;            // persisted HTTP URL — stored in media_urls
  uploading?:      boolean;           // true while the file is being uploaded
  uploadError?:    string;            // set if the upload failed
  mediaType?:      'image' | 'video'; // detected from file.type on upload
  fileSize?:       number;            // original file size in bytes (only for local files)
  isAIGenerated?:  boolean;           // true only for DALL-E generated images
}

const MAX_MEDIA = 10;

export interface UseComposerMediaReturn {
  mediaItems:             MediaItem[];
  /** Exposed so useComposerDraft can populate items when loading an existing draft */
  setMediaItems:          React.Dispatch<React.SetStateAction<MediaItem[]>>;
  fileInputRef:           React.RefObject<HTMLInputElement | null>;
  handleFilesSelected:    (files: File[]) => void;
  handleFileChange:       (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAIImageGenerated: (blobUrl: string, sourceUrl: string) => void;
  handleReplaceMedia:     (index: number, blobUrl: string, sourceUrl: string) => void;
  removeMedia:            (index: number) => void;
}

export function useComposerMedia(onDirty: () => void): UseComposerMediaReturn {
  const fileInputRef                    = useRef<HTMLInputElement>(null);
  const [mediaItems, setMediaItems]     = useState<MediaItem[]>([]);

  // Revoke blob URLs when the composer unmounts
  useEffect(() => {
    return () => {
      mediaItems.forEach(item => {
        if (item.previewUrl.startsWith('blob:')) URL.revokeObjectURL(item.previewUrl);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilesSelected = useCallback((files: File[]) => {
    if (!files.length) return;

    setMediaItems(prev => {
      const slots   = MAX_MEDIA - prev.length;
      const allowed = files.slice(0, slots);
      if (!allowed.length) return prev;

      const newItems: MediaItem[] = allowed.map(f => ({
        previewUrl: URL.createObjectURL(f),
        uploading:  true,
        mediaType:  f.type.startsWith('video/') ? 'video' : 'image',
        fileSize:   f.size,
      }));

      const startIndex = prev.length;
      allowed.forEach((file, i) => {
        const index = startIndex + i;
        uploadFile(file)
          .then(result => {
            setMediaItems(current =>
              current.map((item, idx) =>
                idx === index ? { ...item, sourceUrl: result.url, uploading: false } : item,
              ),
            );
          })
          .catch(() => {
            setMediaItems(current =>
              current.map((item, idx) =>
                idx === index ? { ...item, uploading: false, uploadError: 'Upload failed' } : item,
              ),
            );
          });
      });

      return [...prev, ...newItems];
    });

    onDirty();
  }, [onDirty]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (fileInputRef.current) fileInputRef.current.value = '';
    handleFilesSelected(files);
  }, [handleFilesSelected]);

  const handleAIImageGenerated = useCallback((blobUrl: string, sourceUrl: string) => {
    setMediaItems(prev => {
      if (prev.length >= MAX_MEDIA) return prev;
      return [...prev, { previewUrl: blobUrl, sourceUrl, isAIGenerated: true }];
    });
    onDirty();
  }, [onDirty]);

  const handleReplaceMedia = useCallback((index: number, blobUrl: string, sourceUrl: string) => {
    setMediaItems(prev => {
      const item = prev[index];
      if (!item) return prev;
      if (item.previewUrl.startsWith('blob:')) URL.revokeObjectURL(item.previewUrl);
      return prev.map((it, i) =>
        i === index
          ? { ...it, previewUrl: blobUrl, sourceUrl, isAIGenerated: true, uploadError: undefined, uploading: false }
          : it,
      );
    });
    onDirty();
  }, [onDirty]);

  const removeMedia = useCallback((index: number) => {
    setMediaItems(prev => {
      const item = prev[index];
      if (item && item.previewUrl.startsWith('blob:')) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
    onDirty();
  }, [onDirty]);

  return {
    mediaItems,
    setMediaItems,
    fileInputRef,
    handleFilesSelected,
    handleFileChange,
    handleAIImageGenerated,
    handleReplaceMedia,
    removeMedia,
  };
}
