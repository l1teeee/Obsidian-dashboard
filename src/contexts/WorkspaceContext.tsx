import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import * as workspacesService from '../services/workspaces.service';
import { useAuth } from '../hooks/useAuth';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Workspace {
  id:        string;
  name:      string;
  createdAt: string;
}

interface WorkspaceCtx {
  workspaces:          Workspace[];
  active:              Workspace | null;
  isLoading:           boolean;
  createWorkspace:     (name: string) => Promise<Workspace>;
  switchWorkspace:     (id: string) => void;
  deleteWorkspace:     (id: string) => Promise<void>;
  updateWorkspaceName: (id: string, name: string) => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const WorkspaceContext = createContext<WorkspaceCtx | null>(null);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapWorkspace(w: workspacesService.ApiWorkspace): Workspace {
  return { id: w.id, name: w.name, createdAt: w.created_at };
}

function loadActiveId(): string | null {
  try { return JSON.parse(localStorage.getItem('obs_active_ws') ?? 'null') as string | null; }
  catch { return null; }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeId,   setActiveId]   = useState<string | null>(loadActiveId);
  const [isLoading,  setIsLoading]  = useState(true);

  const active = workspaces.find(w => w.id === activeId) ?? workspaces[0] ?? null;

  // Fetch workspaces once auth resolves. Uses a cancelled flag to
  // discard stale results if the effect re-fires before the request completes.
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setWorkspaces([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    workspacesService.getAll()
      .then(data => { if (!cancelled) setWorkspaces(data.map(mapWorkspace)); })
      .catch(() => { if (!cancelled) setWorkspaces([]); })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [isAuthenticated, authLoading]);

  const createWorkspace = useCallback(async (name: string): Promise<Workspace> => {
    const data = await workspacesService.create(name);
    const ws   = mapWorkspace(data);
    setWorkspaces(prev => [...prev, ws]);
    setActiveId(ws.id);
    localStorage.setItem('obs_active_ws', JSON.stringify(ws.id));
    return ws;
  }, []);

  const switchWorkspace = useCallback((id: string) => {
    setActiveId(id);
    localStorage.setItem('obs_active_ws', JSON.stringify(id));
  }, []);

  const deleteWorkspace = useCallback(async (id: string): Promise<void> => {
    await workspacesService.remove(id);
    setWorkspaces(prev => {
      const next = prev.filter(w => w.id !== id);
      if (activeId === id) {
        const newActive = next[0]?.id ?? null;
        setActiveId(newActive);
        localStorage.setItem('obs_active_ws', JSON.stringify(newActive));
      }
      return next;
    });
  }, [activeId]);

  const updateWorkspaceName = useCallback(async (id: string, name: string): Promise<void> => {
    await workspacesService.rename(id, name);
    setWorkspaces(prev => prev.map(w => w.id === id ? { ...w, name: name.trim() } : w));
  }, []);

  return (
    <WorkspaceContext.Provider value={{
      workspaces, active, isLoading,
      createWorkspace, switchWorkspace, deleteWorkspace, updateWorkspaceName,
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return ctx;
}
