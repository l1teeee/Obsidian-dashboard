import { useCallback, useEffect, useRef, useState } from 'react';
import { uploadFile, presignUpload } from '../services/media.service';

export interface MediaItem {
  previewUrl:      string;            // blob URL or HTTP URL — for display
  sourceUrl?:      string;            // persisted HTTP URL — stored in media_urls
  thumbnailUrl?:   string;            // first-frame JPEG for video previews in social cards
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

/** Extract the first frame of a video blob URL as a JPEG data URL. */
function extractFirstFrame(videoUrl: string): Promise<string | null> {
  return new Promise(resolve => {
    const video    = document.createElement('video');
    video.preload      = 'metadata';
    video.muted        = true;
    video.crossOrigin  = 'anonymous';  // needed for canvas drawImage on S3 URLs
    video.src          = videoUrl;

    video.addEventListener('loadeddata', () => {
      // Seek slightly past 0 so the frame is fully decoded
      video.currentTime = 0.1;
    });

    video.addEventListener('seeked', () => {
      try {
        const canvas  = document.createElement('canvas');
        canvas.width  = video.videoWidth  || 640;
        canvas.height = video.videoHeight || 360;
        const ctx     = canvas.getContext('2d');
        if (!ctx) { resolve(null); return; }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      } catch {
        resolve(null);
      }
    });

    video.addEventListener('error', () => resolve(null));
    video.load();
  });
}

export function useComposerMedia(onDirty: () => void): UseComposerMediaReturn {
  const fileInputRef                    = useRef<HTMLInputElement>(null);
  const [mediaItems, setMediaItems]     = useState<MediaItem[]>([]);

  // Extract first-frame thumbnails for video items that don't have one yet
  // (covers videos loaded from a saved draft, where only the S3 URL is known)
  useEffect(() => {
    mediaItems.forEach((item, index) => {
      if (item.mediaType === 'video' && !item.thumbnailUrl && !item.uploading) {
        extractFirstFrame(item.previewUrl).then(thumb => {
          if (!thumb) return;
          setMediaItems(current =>
            current.map((it, idx) =>
              idx === index ? { ...it, thumbnailUrl: thumb } : it,
            ),
          );
        }).catch(() => {});
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaItems.length]);

  // Fetch file sizes for draft-loaded items that have an S3 URL but no fileSize.
  // Uses a HEAD request so no body is downloaded — silently skips if CORS blocks it.
  useEffect(() => {
    mediaItems.forEach((item, index) => {
      if (item.fileSize !== undefined) return;
      if (!item.previewUrl.startsWith('http')) return;
      if (item.uploading) return;

      fetch(item.previewUrl, { method: 'HEAD' })
        .then(res => {
          const len  = res.headers.get('content-length');
          const size = len ? parseInt(len, 10) : NaN;
          if (!isNaN(size) && size > 0) {
            setMediaItems(current =>
              current.map((it, idx) =>
                idx === index ? { ...it, fileSize: size } : it,
              ),
            );
          }
        })
        .catch(() => {});
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaItems.length]);

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
        const index    = startIndex + i;
        const isVideo  = file.type.startsWith('video/');
        const blobUrl  = newItems[i]!.previewUrl;

        // For videos: extract first frame immediately so previews show a static image
        if (isVideo) {
          extractFirstFrame(blobUrl).then(thumb => {
            if (!thumb) return;
            setMediaItems(current =>
              current.map((item, idx) =>
                idx === index ? { ...item, thumbnailUrl: thumb } : item,
              ),
            );
          }).catch(() => {});
        }

        // Videos upload directly to S3 via presigned URL (bypass backend for large files)
        // Images upload through the backend (magic-byte validation + 20 MB limit)
        const uploader = isVideo ? presignUpload : uploadFile;
        uploader(file)
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
