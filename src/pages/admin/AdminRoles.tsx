import { useEffect, useState, useCallback } from 'react';
import { sileo } from 'sileo';
import {
  getRoles, createRole, updateRole, deleteRole,
  getRoleUsers, assignUserToRole, removeUserFromRole,
  getUsers,
} from '../../services/admin.service';
import type { CustomRole, RoleUser, SystemPermission } from '../../types/admin.types';
import { getPermissions } from '../../services/admin.service';
import Modal from '../../components/shared/Modal';

const PRESET_COLORS = ['#6366f1', '#f87171', '#34d399', '#fbbf24', '#60a5fa', '#a78bfa', '#f472b6', '#2dd4bf'];

function groupByCategory(perms: SystemPermission[]): [string, SystemPermission[]][] {
  const map = new Map<string, SystemPermission[]>();
  for (const p of perms) {
    if (!map.has(p.category)) map.set(p.category, []);
    map.get(p.category)!.push(p);
  }
  return Array.from(map.entries());
}

interface RoleFormState {
  name:        string;
  description: string;
  color:       string;
  permissions: string[];
}

const DEFAULT_FORM: RoleFormState = { name: '', description: '', color: '#6366f1', permissions: [] };

export default function AdminRoles() {
  const [roles,        setRoles]        = useState<CustomRole[]>([]);
  const [system,       setSystem]       = useState<SystemPermission[]>([]);
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [isCreating,   setIsCreating]   = useState(false);
  const [form,         setForm]         = useState<RoleFormState>(DEFAULT_FORM);
  const [roleUsers,    setRoleUsers]    = useState<RoleUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [deleteModal,  setDeleteModal]  = useState(false);

  // User search for assignment
  const [userSearch,   setUserSearch]   = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; email: string; name: string | null }[]>([]);
  const [searching,    setSearching]    = useState(false);

  useEffect(() => {
    Promise.all([getRoles(), getPermissions()])
      .then(([r, p]) => { setRoles(r); setSystem(p.system); })
      .catch(() => sileo.error({ title: 'Failed to load roles' }))
      .finally(() => setLoading(false));
  }, []);

  const selectedRole = roles.find(r => r.id === selectedId) ?? null;

  const selectRole = useCallback((role: CustomRole) => {
    setSelectedId(role.id);
    setIsCreating(false);
    setForm({ name: role.name, description: role.description ?? '', color: role.color ?? '#6366f1', permissions: role.permissions });
    setRoleUsers([]);
    setLoadingUsers(true);
    getRoleUsers(role.id)
      .then(u => setRoleUsers(u))
      .catch(() => sileo.error({ title: 'Failed to load users' }))
      .finally(() => setLoadingUsers(false));
  }, []);

  const startCreate = () => {
    setSelectedId(null);
    setIsCreating(true);
    setForm(DEFAULT_FORM);
    setRoleUsers([]);
  };

  const togglePermission = (key: string) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(key)
        ? prev.permissions.filter(k => k !== key)
        : [...prev.permissions, key],
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) { sileo.error({ title: 'Name is required' }); return; }
    setSaving(true);
    try {
      if (isCreating) {
        const newRole = await createRole({ name: form.name, description: form.description || undefined, color: form.color, permissions: form.permissions });
        setRoles(prev => [newRole, ...prev]);
        setIsCreating(false);
        setSelectedId(newRole.id);
        sileo.success({ title: 'Role created' });
      } else if (selectedId) {
        await updateRole(selectedId, { name: form.name, description: form.description || undefined, color: form.color, permissions: form.permissions });
        setRoles(prev => prev.map(r => r.id === selectedId ? { ...r, ...form, description: form.description || null, color: form.color } : r));
        sileo.success({ title: 'Role updated' });
      }
    } catch {
      sileo.error({ title: 'Failed to save role' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteRole(selectedId);
      setRoles(prev => prev.filter(r => r.id !== selectedId));
      setSelectedId(null);
      setIsCreating(false);
      setForm(DEFAULT_FORM);
      sileo.success({ title: 'Role deleted' });
    } catch {
      sileo.error({ title: 'Failed to delete role' });
    } finally {
      setDeleteModal(false);
    }
  };

  const searchUsers = async (q: string) => {
    if (!q.trim()) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await getUsers({ search: q, limit: 8, page: 1 });
      const assignedIds = new Set(roleUsers.map(u => u.id));
      setSearchResults(res.users.filter(u => !assignedIds.has(u.id)).map(u => ({ id: u.id, email: u.email, name: u.name })));
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const assignUser = async (user: { id: string; email: string; name: string | null }) => {
    if (!selectedId) return;
    try {
      await assignUserToRole(selectedId, user.id);
      setRoleUsers(prev => [...prev, { id: user.id, email: user.email, name: user.name, plan: '', assigned_at: new Date().toISOString() }]);
      setRoles(prev => prev.map(r => r.id === selectedId ? { ...r, user_count: r.user_count + 1 } : r));
      setSearchResults([]);
      setUserSearch('');
      sileo.success({ title: `${user.email} assigned` });
    } catch {
      sileo.error({ title: 'Failed to assign user' });
    }
  };

  const unassignUser = async (userId: string) => {
    if (!selectedId) return;
    try {
      await removeUserFromRole(selectedId, userId);
      setRoleUsers(prev => prev.filter(u => u.id !== userId));
      setRoles(prev => prev.map(r => r.id === selectedId ? { ...r, user_count: Math.max(0, r.user_count - 1) } : r));
      sileo.success({ title: 'User removed from role' });
    } catch {
      sileo.error({ title: 'Failed to remove user' });
    }
  };

  const groups = groupByCategory(system);
  const showPanel = isCreating || selectedId !== null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-headline font-extrabold text-white tracking-tight mb-1">Custom Roles</h1>
          <p className="text-sm text-[#988d9c]">Create roles with specific permissions and assign them to users.</p>
        </div>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f87171]/10 border border-[#f87171]/20 text-[#f87171] text-sm font-bold hover:bg-[#f87171]/15 transition-all"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
          New Role
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <span className="material-symbols-outlined text-[#4c4450] animate-spin" style={{ fontSize: 28 }}>progress_activity</span>
        </div>
      ) : (
        <div className="flex gap-5 items-start">
          {/* Left: role list */}
          <div className="w-64 shrink-0 flex flex-col gap-2">
            {roles.length === 0 && !isCreating && (
              <div className="rounded-2xl border border-[#4c4450]/15 bg-[#0e0e0e] p-5 text-center">
                <span className="material-symbols-outlined text-[#4c4450] block mb-2" style={{ fontSize: 28 }}>badge</span>
                <p className="text-sm text-[#4c4450]">No roles yet.</p>
                <p className="text-xs text-[#4c4450]/60 mt-1">Click "New Role" to create one.</p>
              </div>
            )}
            {roles.map(role => {
              const active = selectedId === role.id && !isCreating;
              return (
                <button
                  key={role.id}
                  onClick={() => selectRole(role)}
                  className={[
                    'w-full text-left rounded-xl border px-4 py-3 transition-all',
                    active
                      ? 'border-[#f87171]/25 bg-[#f87171]/08'
                      : 'border-[#4c4450]/15 bg-[#0e0e0e] hover:border-[#4c4450]/30 hover:bg-white/[0.02]',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: role.color ?? '#6366f1' }} />
                    <span className="text-sm font-semibold text-white truncate">{role.name}</span>
                  </div>
                  <div className="flex items-center justify-between pl-5">
                    <span className="text-xs text-[#4c4450] truncate">{role.description ?? 'No description'}</span>
                    <span className="text-xs text-[#988d9c] shrink-0 ml-2">{role.user_count} users</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: editor panel */}
          {!showPanel ? (
            <div className="flex-1 rounded-2xl border border-[#4c4450]/10 bg-[#0e0e0e] flex flex-col items-center justify-center h-64">
              <span className="material-symbols-outlined text-[#2a2a2a] mb-3" style={{ fontSize: 40 }}>manage_accounts</span>
              <p className="text-sm text-[#4c4450]">Select a role to edit or create a new one.</p>
            </div>
          ) : (
            <div className="flex-1 rounded-2xl border border-[#4c4450]/15 bg-[#0e0e0e] overflow-hidden">
              {/* Panel header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#4c4450]/15">
                <h2 className="text-base font-headline font-bold text-white">
                  {isCreating ? 'Create Role' : 'Edit Role'}
                </h2>
                {!isCreating && (
                  <button
                    onClick={() => setDeleteModal(true)}
                    className="flex items-center gap-1.5 text-xs text-[#f87171]/60 hover:text-[#f87171] transition-colors px-2 py-1 rounded-lg hover:bg-[#f87171]/08"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                    Delete Role
                  </button>
                )}
              </div>

              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-220px)]">
                {/* Name + Description */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#988d9c] mb-2 uppercase tracking-wider">Name</label>
                    <input
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Content Manager"
                      className="w-full bg-[#111] border border-[#4c4450]/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#4c4450] focus:outline-none focus:border-[#f87171]/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#988d9c] mb-2 uppercase tracking-wider">Description</label>
                    <input
                      value={form.description}
                      onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                      placeholder="Optional description"
                      className="w-full bg-[#111] border border-[#4c4450]/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#4c4450] focus:outline-none focus:border-[#f87171]/40 transition-colors"
                    />
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-xs font-semibold text-[#988d9c] mb-2 uppercase tracking-wider">Color</label>
                  <div className="flex items-center gap-2">
                    {PRESET_COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => setForm(p => ({ ...p, color: c }))}
                        className="w-6 h-6 rounded-full transition-all"
                        style={{
                          backgroundColor: c,
                          outline: form.color === c ? `2px solid ${c}` : 'none',
                          outlineOffset: '2px',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <label className="block text-xs font-semibold text-[#988d9c] mb-3 uppercase tracking-wider">Permissions</label>
                  <div className="space-y-3">
                    {groups.map(([category, perms]) => (
                      <div key={category} className="rounded-xl border border-[#4c4450]/12 overflow-hidden">
                        <div className="px-4 py-2 bg-[#111]/50 flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4c4450]">{category}</span>
                          <button
                            onClick={() => {
                              const keys = perms.map(p => p.key);
                              const allOn = keys.every(k => form.permissions.includes(k));
                              setForm(prev => ({
                                ...prev,
                                permissions: allOn
                                  ? prev.permissions.filter(k => !keys.includes(k))
                                  : [...new Set([...prev.permissions, ...keys])],
                              }));
                            }}
                            className="text-[10px] text-[#4c4450] hover:text-[#988d9c] transition-colors"
                          >
                            {perms.every(p => form.permissions.includes(p.key)) ? 'Uncheck all' : 'Check all'}
                          </button>
                        </div>
                        <div className="divide-y divide-[#4c4450]/08">
                          {perms.map(perm => {
                            const checked = form.permissions.includes(perm.key);
                            return (
                              <label
                                key={perm.key}
                                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-white/[0.015] transition-colors"
                              >
                                <span
                                  onClick={() => togglePermission(perm.key)}
                                  className={[
                                    'w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all cursor-pointer',
                                    checked
                                      ? 'bg-[#f87171]/20 border-[#f87171]/50'
                                      : 'border-[#4c4450]/30 hover:border-[#4c4450]/60',
                                  ].join(' ')}
                                >
                                  {checked && <span className="material-symbols-outlined text-[#f87171]" style={{ fontSize: 11, fontVariationSettings: "'FILL' 1" }}>check</span>}
                                </span>
                                <span className="text-sm text-[#cfc2d2]">{perm.name}</span>
                                <span className="text-xs text-[#4c4450] ml-auto font-mono">{perm.key}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assigned users (only in edit mode) */}
                {!isCreating && selectedId && (
                  <div>
                    <label className="block text-xs font-semibold text-[#988d9c] mb-3 uppercase tracking-wider">
                      Assigned Users
                      {roleUsers.length > 0 && <span className="ml-2 text-[#4c4450]">({roleUsers.length})</span>}
                    </label>

                    {/* Search */}
                    <div className="relative mb-3">
                      <input
                        value={userSearch}
                        onChange={e => {
                          setUserSearch(e.target.value);
                          void searchUsers(e.target.value);
                        }}
                        placeholder="Search users by name or email..."
                        className="w-full bg-[#111] border border-[#4c4450]/20 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-[#4c4450] focus:outline-none focus:border-[#f87171]/40 transition-colors"
                      />
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4c4450]" style={{ fontSize: 16 }}>
                        {searching ? 'progress_activity' : 'search'}
                      </span>
                      {searchResults.length > 0 && (
                        <div className="absolute top-full mt-1.5 left-0 right-0 bg-[#161616] border border-[#4c4450]/20 rounded-xl shadow-2xl z-20 overflow-hidden">
                          {searchResults.map(u => (
                            <button
                              key={u.id}
                              onClick={() => { void assignUser(u); }}
                              className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors border-b border-[#4c4450]/10 last:border-0"
                            >
                              <div className="w-7 h-7 rounded-full bg-[#4c4450]/20 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-[#988d9c]">{(u.name ?? u.email)[0].toUpperCase()}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm text-white truncate">{u.name ?? u.email}</p>
                                {u.name && <p className="text-xs text-[#4c4450] truncate">{u.email}</p>}
                              </div>
                              <span className="material-symbols-outlined text-[#4c4450] ml-auto shrink-0" style={{ fontSize: 16 }}>person_add</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* User list */}
                    {loadingUsers ? (
                      <div className="h-10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#4c4450] animate-spin" style={{ fontSize: 20 }}>progress_activity</span>
                      </div>
                    ) : roleUsers.length === 0 ? (
                      <p className="text-sm text-[#4c4450] text-center py-4">No users assigned yet.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {roleUsers.map(u => (
                          <div
                            key={u.id}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#111] border border-[#4c4450]/12"
                          >
                            <div className="w-7 h-7 rounded-full bg-[#4c4450]/20 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-[#988d9c]">{(u.name ?? u.email)[0].toUpperCase()}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-white truncate">{u.name ?? u.email}</p>
                              {u.name && <p className="text-xs text-[#4c4450] truncate">{u.email}</p>}
                            </div>
                            <span className={[
                              'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md',
                              u.plan === 'pro' ? 'bg-[#a78bfa]/15 text-[#a78bfa]' :
                              u.plan === 'enterprise' ? 'bg-[#f87171]/15 text-[#f87171]' :
                              'bg-[#4c4450]/20 text-[#988d9c]',
                            ].join(' ')}>{u.plan || 'starter'}</span>
                            <button
                              onClick={() => { void unassignUser(u.id); }}
                              className="text-[#4c4450] hover:text-[#f87171] transition-colors ml-1"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Save */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => { void handleSave(); }}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f87171] text-white text-sm font-bold hover:bg-[#fca5a5] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {saving && <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>progress_activity</span>}
                    {isCreating ? 'Create Role' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal open={deleteModal} onClose={() => setDeleteModal(false)} maxWidth="max-w-sm">
        <div className="p-7">
          <div className="w-11 h-11 rounded-2xl bg-[#f87171]/10 border border-[#f87171]/20 flex items-center justify-center mb-5">
            <span className="material-symbols-outlined text-[#f87171]" style={{ fontSize: 20 }}>delete</span>
          </div>
          <h2 className="text-lg font-headline font-extrabold text-white mb-1">Delete Role?</h2>
          <p className="text-sm text-[#988d9c] mb-6">
            This will delete <strong className="text-white">{selectedRole?.name}</strong> and remove it from all assigned users. This cannot be undone.
          </p>
          <div className="flex flex-col gap-2.5">
            <button onClick={() => { void handleDelete(); }} className="w-full py-3 rounded-xl bg-[#f87171] text-white font-bold text-sm hover:bg-[#fca5a5] transition-all">
              Yes, delete role
            </button>
            <button onClick={() => setDeleteModal(false)} className="w-full py-3 rounded-xl border border-[#4c4450]/20 text-sm font-semibold text-[#cfc2d2] hover:bg-[#201f1f] hover:text-white transition-all">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
