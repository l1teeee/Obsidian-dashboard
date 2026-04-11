/**
 * Module-level posts store — shared between PostComposer and Posts page.
 * Prevents full refetches on navigation; enables optimistic updates.
 *
 * Pattern: write-through (write to store immediately, sync to DB in the hook).
 */

import type { CalendarPost } from '../domain/entities/CalendarPost';

type Listener = () => void;

let active:   CalendarPost[] | null = null;
let inactive: CalendarPost[] | null = null;
const listeners = new Set<Listener>();

function notify() { listeners.forEach(l => l()); }

export const postsStore = {
  /** Returns cached lists, or null if not yet loaded. */
  get(): { active: CalendarPost[] | null; inactive: CalendarPost[] | null } {
    return { active, inactive };
  },

  /** Called after a successful fetch — populate the cache. */
  set(a: CalendarPost[], i: CalendarPost[]): void {
    active   = a;
    inactive = i;
    notify();
  },

  /** Add a new post to the top of the active list immediately (optimistic). */
  addOptimistic(post: CalendarPost): void {
    if (active !== null) { active = [post, ...active]; notify(); }
  },

  /** Update a post in-place (optimistic). */
  updateOptimistic(id: string, changes: Partial<CalendarPost>): void {
    if (active !== null) {
      active = active.map(p => p.id === id ? { ...p, ...changes } : p);
      notify();
    }
  },

  /** Move a post from active → inactive (optimistic). */
  deactivateOptimistic(id: string): void {
    if (active === null) return;
    const post = active.find(p => p.id === id);
    active = active.filter(p => p.id !== id);
    if (post && inactive !== null) inactive = [{ ...post, status: 'inactive' as const }, ...inactive];
    notify();
  },

  /** Remove a post entirely (optimistic). */
  removeOptimistic(id: string): void {
    if (active   !== null) active   = active.filter(p => p.id !== id);
    if (inactive !== null) inactive = inactive.filter(p => p.id !== id);
    notify();
  },

  /** Force a full refetch next time the hook mounts. */
  invalidate(): void {
    active   = null;
    inactive = null;
  },

  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
