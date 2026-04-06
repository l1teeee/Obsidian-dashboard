import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import * as postsService from '../services/posts.service';
import type { ApiPost, ApiPostMetrics } from '../services/posts.service';

export function usePostDetail() {
  const navigate   = useNavigate();
  const { id }     = useParams<{ id: string }>();
  const pageRef    = useRef<HTMLDivElement>(null);
  const resolvedId = id ?? '';

  const [apiPost,        setApiPost]        = useState<ApiPost | null>(null);
  const [metrics,        setMetrics]        = useState<ApiPostMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [loading,        setLoading]        = useState(true);
  const [notFound,       setNotFound]       = useState(false);

  // Load post
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

  // Load metrics once post is loaded — backend returns 0s for non-published/non-facebook posts
  useEffect(() => {
    if (!apiPost) return;
    let cancelled = false;
    setMetricsLoading(true);
    postsService.getMetrics(resolvedId)
      .then(m  => { if (!cancelled) setMetrics(m); })
      .catch(() => { if (!cancelled) setMetrics({ likes: 0, comments: 0, shares: 0, reach: null, impressions: null, clicks: null, dev_mode: false }); })
      .finally(() => { if (!cancelled) setMetricsLoading(false); });
    return () => { cancelled = true; };
  }, [apiPost, resolvedId]);

  // GSAP entrance
  useEffect(() => {
    if (loading || !apiPost) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-post-img]',  { scale: 1.04, opacity: 0, duration: 0.7, ease: 'power3.out' });
      gsap.from('[data-metric]',    { y: 16, opacity: 0, duration: 0.45, stagger: 0.07, ease: 'power2.out', delay: 0.2 });
    }, pageRef.current!);
    return () => ctx.revert();
  }, [loading, apiPost]);

  const handleBack = () => navigate(-1);

  return { apiPost, metrics, metricsLoading, loading, notFound, resolvedId, pageRef, handleBack };
}
