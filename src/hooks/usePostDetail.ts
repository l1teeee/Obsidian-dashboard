import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { MockPostRepository } from '../infrastructure/repositories/MockPostRepository';
import type { PostRecord } from '../domain/entities/Post';

export function usePostDetail() {
  const navigate = useNavigate();
  const { id }   = useParams<{ id: string }>();
  const pageRef  = useRef<HTMLDivElement>(null);

  const repo:       MockPostRepository = new MockPostRepository();
  const post:       PostRecord         = repo.getById(id ?? '') ?? (repo.getById('88291') as PostRecord);
  const resolvedId: string             = id ?? '88291';

  useEffect(() => {
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
  }, [id]);

  const handleBack = () => navigate(-1);

  return { post, resolvedId, pageRef, handleBack };
}
