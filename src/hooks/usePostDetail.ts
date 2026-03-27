import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import * as postsService from '../services/posts.service';
import type { ApiPost } from '../services/posts.service';

export function usePostDetail() {
  const navigate   = useNavigate();
  const { id }     = useParams<{ id: string }>();
  const pageRef    = useRef<HTMLDivElement>(null);
  const resolvedId = id ?? '';

  const [apiPost,  setApiPost]  = useState<ApiPost | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!resolvedId) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    postsService.getById(resolvedId)
      .then(p  => { if (!cancelled) setApiPost(p); })
      .catch(() => { if (!cancelled) setNotFound(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [resolvedId]);

  useEffect(() => {
    if (loading || !apiPost) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-post-img]',   { scale: 1.04, opacity: 0, duration: 0.7, ease: 'power3.out' });
      gsap.from('[data-metric]',     { y: 16, opacity: 0, duration: 0.45, stagger: 0.07, ease: 'power2.out', delay: 0.2 });
      gsap.from('[data-bench-bar]',  { scaleX: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.4, transformOrigin: 'left center' });

      const circle = document.querySelector<SVGCircleElement>('[data-sentiment-ring]');
      if (circle) {
        const dasharray = 364;
        const offset    = 60;
        gsap.set(circle, { strokeDasharray: dasharray, strokeDashoffset: dasharray });
        gsap.to(circle,  { strokeDashoffset: offset, duration: 1.2, ease: 'power2.out', delay: 0.5 });
      }

      gsap.from('[data-comment]', { y: 10, opacity: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out', delay: 0.35 });
    }, pageRef.current!);

    return () => ctx.revert();
  }, [loading, apiPost]);

  const handleBack = () => navigate(-1);

  return { apiPost, loading, notFound, resolvedId, pageRef, handleBack };
}
