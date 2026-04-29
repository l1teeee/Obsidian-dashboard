import { useState } from 'react';
import Modal from '../shared/Modal';
import type { SocialConnection } from '../../types/platforms.types';

interface FacebookPageSelectModalProps {
  open:     boolean;
  pages:    SocialConnection[];
  onSelect: (pageId: string, pageName: string) => void;
  onClose:  () => void;
}

export default function FacebookPageSelectModal({ open, pages, onSelect, onClose }: FacebookPageSelectModalProps) {
  const [selectedId, setSelectedId] = useState<string>(() => pages[0]?.page_id ?? '');

  const selectedPage = pages.find(p => p.page_id === selectedId);

  function handleConfirm() {
    if (!selectedId || !selectedPage) return;
    onSelect(selectedId, selectedPage.page_name || selectedPage.account_name);
  }

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-[#1877F2] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-white leading-none">Select Facebook Page</h2>
            <p className="text-[11px] text-[#988d9c] mt-0.5">Choose which page to publish this post to</p>
          </div>
        </div>

        <div className="my-5 h-px bg-[#4c4450]/20" />

        {/* Pages list */}
        <div className="space-y-2.5 mb-6">
          {pages.map(page => {
            const isSelected = selectedId === page.page_id;
            return (
              <button
                key={page.id}
                onClick={() => setSelectedId(page.page_id ?? '')}
                className={[
                  'w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left',
                  isSelected
                    ? 'border-[#1877F2]/50 bg-[#1877F2]/8'
                    : 'border-[#4c4450]/20 bg-[#1c1b1b] hover:border-[#4c4450]/40',
                ].join(' ')}
              >
                {/* Avatar */}
                {page.account_picture ? (
                  <img
                    src={page.account_picture}
                    alt={page.account_name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center shrink-0 text-white text-sm font-bold">
                    {(page.page_name?.[0] ?? page.account_name?.[0] ?? 'F').toUpperCase()}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate leading-none mb-1">
                    {page.page_name || page.account_name}
                  </p>
                  {page.page_name && page.account_name && page.page_name !== page.account_name && (
                    <p className="text-[10px] text-[#988d9c] truncate leading-none">{page.account_name}</p>
                  )}
                  {page.page_id && (
                    <p className="font-mono text-[9px] text-[#4c4450] mt-0.5">ID: {page.page_id}</p>
                  )}
                </div>

                {/* Radio indicator */}
                <div
                  className={[
                    'w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all',
                    isSelected ? 'border-[#1877F2]' : 'border-[#4c4450]/40',
                  ].join(' ')}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-[#1877F2]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[#4c4450]/30 text-sm text-[#988d9c] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedId}
            className="flex-1 py-2.5 rounded-xl bg-[#1877F2] text-white text-sm font-semibold hover:bg-[#1877F2]/90 transition-all active:scale-[0.98] disabled:opacity-50 truncate px-3"
          >
            Publish to {selectedPage?.page_name || selectedPage?.account_name || 'Page'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
