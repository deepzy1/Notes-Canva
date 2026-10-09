import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 flex items-start space-x-3.5">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              isDestructive ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-neutral-900">{title}</h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="px-5 py-3.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-200/60 rounded-xl transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-colors cursor-pointer ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
