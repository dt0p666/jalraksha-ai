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
            <div className="p-2 bg-[#D9534F]/20 text-[#D9534F] rounded-lg shrink-0 mt-0.5">
              <AlertTriangle size={22} />
            </div>
          )}
          <p className="text-[#9FB0C9] text-sm leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#425B9A]/30">
          <button
            ref={cancelBtnRef}
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg text-[#EAF1F8] bg-[#1D2A52] hover:bg-[#425B9A]/40 border border-[#425B9A]/40 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-sm font-semibold rounded-lg text-white transition-colors ${
              isDestructive
                ? 'bg-[#D9534F] hover:bg-[#c4413d]'
                : 'bg-[#425B9A] hover:bg-[#4f6cb6]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
