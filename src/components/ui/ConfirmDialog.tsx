import * as AlertDialog from '@radix-ui/react-alert-dialog';

interface Props { open: boolean; onOpenChange: (o: boolean) => void; title: string; description: string; confirmLabel?: string; variant?: 'danger' | 'default'; onConfirm: () => void; }

export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = 'Confirm', variant = 'default', onConfirm }: Props) {
  const btn = variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white';
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-full max-w-md shadow-xl z-50">
          <AlertDialog.Title className="text-lg font-semibold text-gray-900">{title}</AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-gray-500 mt-2">{description}</AlertDialog.Description>
          <div className="flex justify-end gap-3 mt-6">
            <AlertDialog.Cancel className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</AlertDialog.Cancel>
            <AlertDialog.Action onClick={onConfirm} className={`px-4 py-2 text-sm font-medium rounded-lg ${btn}`}>{confirmLabel}</AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
