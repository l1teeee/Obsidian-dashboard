import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { getProfile, updateProfile, getPlatforms, getUserActivity } from '../services/users.service';
import type { UserProfile, PlatformSummary, ActivityItem } from '../services/users.service';
import { MockProfileRepository } from '../infrastructure/repositories/MockProfileRepository';
import { PLATFORM_REGISTRY } from '../domain/entities/Platform';
import type { ProfileData, NotificationPref, ConnectedPlatformEntry, ActivityEntry } from '../domain/entities/Profile';

const repo = new MockProfileRepository();

function toProfileData(u: UserProfile): ProfileData {
  const date = u.created_at ? new Date(u.created_at) : null;
  return {
    name:       u.name      ?? '',
    email:      u.email,
    role:       u.role      ?? '',
    country:    u.country   ?? '',
    timezone:   'UTC−6 (Mexico City)',
    plan:       u.plan,
    avatar_url: u.avatar_url ?? null,
    created_at: date
      ? date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : undefined,
  };
}

function mapPlatform(p: PlatformSummary): ConnectedPlatformEntry {
  const reg = PLATFORM_REGISTRY[p.platform];
  const expired = p.token_expires_at ? new Date(p.token_expires_at) < new Date() : false;
  return {
    platformId: p.platform,
    name:       reg.name,
    handle:     p.account_name,
    status:     expired ? 'needs-reauth' : 'connected',
    color:      reg.color,
    icon:       reg.icon,
  };
}

function mapActivity(a: ActivityItem): ActivityEntry {
  return { action: a.action, detail: a.detail, time: a.time, icon: a.icon, color: a.color };
}

export function useProfile() {
  const pageRef = useRef<HTMLDivElement>(null);

  const [profile,            setProfile]            = useState<ProfileData | null>(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState<ConnectedPlatformEntry[]>([]);
  const [activity,           setActivity]           = useState<ActivityEntry[]>([]);
  const [notifPrefs,         setNotifPrefs]         = useState<NotificationPref[]>(repo.getNotificationPrefs());
  const [editOpen,           setEditOpen]           = useState(false);
  const [avatarOpen,         setAvatarOpen]         = useState(false);
  const [passwordOpen,       setPasswordOpen]       = useState(false);

  useEffect(() => {
    getProfile()
      .then(u => setProfile(toProfileData(u)))
      .catch(() => setProfile(repo.getProfile()));

    getPlatforms()
      .then(list => setConnectedPlatforms(list.map(mapPlatform)))
      .catch(() => {});

    getUserActivity()
      .then(list => setActivity(list.map(mapActivity)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!profile) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-hero]',     { y: 20, opacity: 0, duration: 0.5,  ease: 'power3.out', delay: 0.05 });
      gsap.from('[data-stat]',     { y: 16, opacity: 0, duration: 0.4,  ease: 'power2.out', delay: 0.2, stagger: 0.07 });
      gsap.from('[data-section]',  { y: 20, opacity: 0, duration: 0.45, ease: 'power2.out', delay: 0.3, stagger: 0.1 });
      gsap.from('[data-activity]', { x: -12, opacity: 0, duration: 0.35, ease: 'power2.out', delay: 0.4, stagger: 0.07 });
    }, pageRef.current ?? undefined);
    return () => ctx.revert();
  }, [profile]);

  const saveProfile = useCallback(async (d: ProfileData) => {
    const updated = await updateProfile({
      name:    d.name    || undefined,
      role:    d.role    || undefined,
      country: d.country || undefined,
    });
    setProfile(prev => ({
      ...toProfileData(updated),
      timezone:   d.timezone,
      created_at: prev?.created_at,
    }));
  }, []);

  const onAvatarUpdated = useCallback((url: string) => {
    setProfile(prev => prev ? { ...prev, avatar_url: url } : prev);
  }, []);

  return {
    profile,
    connectedPlatforms,
    activity,
    notifPrefs,
    setNotifPrefs,
    editOpen,
    setEditOpen,
    avatarOpen,
    setAvatarOpen,
    passwordOpen,
    setPasswordOpen,
    saveProfile,
    onAvatarUpdated,
    pageRef,
  };
}
