/**
 * Confirmation Dialog Component
 * Reusable dialog for confirming destructive actions
 */

'use client';

interface ConfirmDialogProps {
  /** Dialog title */
  title: string;
  /** Dialog message */
  message: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm button color (danger, warning, info) */
  confirmType?: 'danger' | 'warning' | 'info';
  /** Callback when confirmed */
  onConfirm: () => void;
  /** Callback when cancelled */
  onCancel: () => void;
  /** Whether dialog is open */
  isOpen: boolean;
}

export default function ConfirmDialog({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmType = 'danger',
  onConfirm,
  onCancel,
  isOpen,
}: ConfirmDialogProps) {
  if (!isOpen) {
    return null;
  }

  const confirmButtonStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded transition-colors ${confirmButtonStyles[confirmType]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
