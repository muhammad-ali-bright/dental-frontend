// src/components/ui/ConfirmDialog.tsx
import React from 'react';

interface ConfirmDialogProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    message,
    onConfirm,
    onCancel,
    isLoading = false,
}) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
                <button
                    onClick={onCancel}
                    disabled={isLoading}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                    ✕
                </button>
            </div>
            <div className="px-6 py-4 text-gray-700 whitespace-pre-line">{message}</div>
            <div className="px-6 py-4 flex justify-end space-x-3">
                <button
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                >
                    {isLoading ? 'Deleting…' : 'Delete'}
                </button>
            </div>
        </div>
    </div>
);

export default ConfirmDialog;
