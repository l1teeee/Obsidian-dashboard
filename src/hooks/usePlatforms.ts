import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { sileo } from 'sileo';
import * as platformsService from '../services/platforms.service';
import type { SocialConnection } from '../services/platforms.service';

export type { SocialConnection };

export function usePlatforms() {
  const pageRef   = useRef<HTMLDivElement>(null);
  const location  = useLocation();
  const navigate  = useNavigate();

  const [connections,  setConnections]  = useState<SocialConnection[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [connecting,   setConnecting]   = useState(false);
  const [disconnecting, setDisconnecting] = useState<string | null>(null); // id being disconnected

  // ── Load connections ────────────────────────────────────────────────────────
  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await platformsService.listConnections();
      setConnections(data);
    } catch {
      sileo.error({ title: 'Could not load connections', description: 'Check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  // ── Handle OAuth redirect-back params ───────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const connected = params.get('connected');
    const error     = params.get('error');

    if (connected === 'success') {
      sileo.success({ title: 'Account connected!', description: 'Your social account is now linked.' });
      reload();
      navigate('/platforms', { replace: true });
    } else if (error) {
      sileo.error({ title: 'Connection failed', description: decodeURIComponent(error) });
      navigate('/platforms', { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── GSAP entrance ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-header-section]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' });
      gsap.fromTo('[data-platform-card]',  { scale: 0.96, y: 20, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(1.4)', delay: 0.15 });
      gsap.fromTo('[data-add-card]',       { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.2)', delay: 0.5 });
    }, pageRef.current!);
    return () => ctx.revert();
  }, [loading]);

  // ── Connect Facebook (starts OAuth flow) ───────────────────────────────────
  const handleConnect = useCallback(async (platform: 'facebook' | 'instagram') => {
    if (platform === 'facebook' || platform === 'instagram') {
      setConnecting(true);
      try {
        await platformsService.startFacebookOAuth();
        // window.location.href is set inside startFacebookOAuth — page will navigate away
      } catch {
        sileo.error({ title: 'Could not start OAuth', description: 'Check your connection and try again.' });
        setConnecting(false);
      }
    }
  }, []);

  // ── Connect Instagram (uses existing FB page tokens, falls back to OAuth) ───
  const handleConnectInstagram = useCallback(async () => {
    setConnecting(true);
    try {
      await platformsService.connectInstagramFromPages();
      sileo.success({ title: 'Instagram connected!', description: 'Your Instagram account is now linked.' });
      await reload();
      setConnecting(false);
    } catch (err: unknown) {
      const apiErr = err as { code?: string };
      if (apiErr?.code === 'NO_IG_FOUND') {
        // No IG linked to existing pages — fall back to full Facebook OAuth
        try {
          await platformsService.startFacebookOAuth();
          // Browser navigates away — connecting stays true
        } catch {
          sileo.error({ title: 'Could not start OAuth', description: 'Check your connection and try again.' });
          setConnecting(false);
        }
      } else {
        sileo.error({ title: 'Could not connect Instagram', description: 'Try again in a moment.' });
        setConnecting(false);
      }
    }
  }, [reload]);

  // ── Disconnect ──────────────────────────────────────────────────────────────
  const handleDisconnect = useCallback(async (id: string, name: string) => {
    setDisconnecting(id);
    try {
      await platformsService.deleteConnection(id);
      sileo.success({ title: 'Disconnected', description: `${name} has been unlinked.` });
      setConnections(prev => prev.filter(c => c.id !== id));
    } catch {
      sileo.error({ title: 'Could not disconnect', description: 'Try again in a moment.' });
    } finally {
      setDisconnecting(null);
    }
  }, []);

  return {
    connections, loading, connecting, disconnecting,
    handleConnect, handleConnectInstagram, handleDisconnect, reload,
    pageRef,
  };
}
