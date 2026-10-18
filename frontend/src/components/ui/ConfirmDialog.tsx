import React, { useRef, useEffect } from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  isDestructive?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  isDestructive = false,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
}) => {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => cancelBtnRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          {isDestructive && (
            <div className="p-2 bg-[#F5E6BB]/20 text-[#F5E6BB] rounded-lg shrink-0 mt-0.5">
              <AlertTriangle size={20} />
            </div>
          )}
          <p className="text-[#F8F3EF] text-xs sm:text-sm leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#08C4E1]/20">
          <button
            ref={cancelBtnRef}
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg text-[#F8F3EF] hover:text-[#F8F3EF] bg-[#1C3C53] hover:bg-[#446882] border border-[#08C4E1]/20 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-xs font-heading font-bold rounded-lg transition-all ${
              isDestructive
                ? 'bg-[#F5E6BB] hover:bg-[#F5E6BB]/90 text-white shadow-lg shadow-[#F5E6BB]/25'
                : 'bg-[#08C4E1] hover:bg-[#08C4E1]/90 text-[#1C3C53] shadow-lg shadow-[#08C4E1]/25'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
