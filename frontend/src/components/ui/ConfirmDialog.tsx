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
            <div className="p-2 bg-[#D9D28B]/20 text-[#D9D28B] rounded-lg shrink-0 mt-0.5">
              <AlertTriangle size={20} />
            </div>
          )}
          <p className="text-[#95BDD7] text-xs sm:text-sm leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#24B1B1]/20">
          <button
            ref={cancelBtnRef}
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg text-[#95BDD7] hover:text-[#95BDD7] bg-[#086288] hover:bg-[#007979] border border-[#24B1B1]/20 transition-colors"
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
                ? 'bg-[#D9D28B] hover:bg-[#D9D28B]/90 text-white shadow-lg shadow-[#D9D28B]/25'
                : 'bg-[#24B1B1] hover:bg-[#24B1B1]/90 text-[#086288] shadow-lg shadow-[#24B1B1]/25'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
