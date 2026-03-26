import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { MockProfileRepository } from '../infrastructure/repositories/MockProfileRepository';
import type { ProfileData, NotificationPref } from '../domain/entities/Profile';

export function useProfile() {
  const pageRef = useRef<HTMLDivElement>(null);
  const repo    = new MockProfileRepository();

  const [editOpen,    setEditOpen]    = useState(false);
  const [profile,     setProfile]     = useState<ProfileData>(repo.getProfile());
  const [notifPrefs,  setNotifPrefs]  = useState<NotificationPref[]>(repo.getNotificationPrefs());

  const stats             = repo.getStats();
  const connectedPlatforms = repo.getConnectedPlatforms();
  const activity          = repo.getActivity();

  const saveProfile = (d: ProfileData) => {
    repo.saveProfile(d);
    setProfile(d);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-hero]',     { y: 20, opacity: 0, duration: 0.5,  ease: 'power3.out', delay: 0.05 });
      gsap.from('[data-stat]',     { y: 16, opacity: 0, duration: 0.4,  ease: 'power2.out', delay: 0.2, stagger: 0.07 });
      gsap.from('[data-section]',  { y: 20, opacity: 0, duration: 0.45, ease: 'power2.out', delay: 0.3, stagger: 0.1 });
      gsap.from('[data-activity]', { x: -12, opacity: 0, duration: 0.35, ease: 'power2.out', delay: 0.4, stagger: 0.07 });
    }, pageRef.current!);
    return () => ctx.revert();
  }, []);

  return {
    profile,
    stats,
    connectedPlatforms,
    activity,
    notifPrefs,
    setNotifPrefs,
    editOpen,
    setEditOpen,
    saveProfile,
    pageRef,
  };
}
