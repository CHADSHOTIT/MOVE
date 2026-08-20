import { useRef, useState } from 'react';
import { subscriptions, getReminder } from '../data/subscriptions';
import { formatShort } from '../lib/dates';
import { CloseIcon, UploadIcon, DownloadIcon } from './icons';

interface ImportExportModalProps {
  onClose: () => void;
}

export default function ImportExportModal({ onClose }: ImportExportModalProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [imported, setImported] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    setFileName(file.name);
    setImported(true);
  }

  function exportCsv() {
    const header = ['Subscription', 'Category', 'Owner', 'Cost', 'Renewal', 'Cancellation Notice', 'Decision Date', 'Status'];
    const rows = subscriptions.map((s) => [
      s.name,
      s.category,
      s.owner,
      String(s.annualCost),
      formatShort(s.renewalDate),
      `${s.noticeDays} days`,
      formatShort(getReminder(s)),
      s.status,
    ]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscriptions.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const newRecords = 6;
  const existingRecords = subscriptions.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-[440px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <h2 className="text-[14.5px] font-semibold text-[var(--color-ink)]">Import / Export</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[var(--color-ink-muted)] hover:bg-[#f3f2ed]"
            aria-label="Close"
          >
            <CloseIcon width={16} height={16} />
          </button>
        </div>

        <div className="px-5 py-4">
          <p className="text-[12.5px] font-medium text-[var(--color-ink-muted)]">Import subscriptions</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-2 flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-[var(--color-border-strong)] px-4 py-6 text-center hover:bg-[#f8f7f3]"
          >
            <UploadIcon width={20} height={20} className="text-[var(--color-green-700)]" />
            <span className="text-[12.5px] text-[var(--color-ink)]">
              {fileName ?? 'Click to upload a .xlsx file'}
            </span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          {imported && (
            <div className="mt-3 rounded-md border border-[var(--color-border)] bg-[#f8f7f3] px-3 py-3 text-[12.5px]">
              <div className="flex justify-between py-0.5">
                <span className="text-[var(--color-ink-muted)]">Records detected</span>
                <span className="font-medium text-[var(--color-ink)]">{newRecords + existingRecords}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[var(--color-ink-muted)]">New records</span>
                <span className="font-medium text-[var(--color-green-700)]">{newRecords}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[var(--color-ink-muted)]">Existing records to update</span>
                <span className="font-medium text-[var(--color-ink)]">{existingRecords}</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full rounded-md bg-[var(--color-green-700)] px-3 py-1.5 text-[12.5px] font-medium text-white hover:bg-[var(--color-green-900)]"
              >
                Confirm import
              </button>
            </div>
          )}

          <div className="mt-5 border-t border-[var(--color-border)] pt-4">
            <p className="text-[12.5px] font-medium text-[var(--color-ink-muted)]">Export subscriptions</p>
            <button
              type="button"
              onClick={exportCsv}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-[var(--color-border-strong)] px-3 py-2 text-[12.5px] font-medium text-[var(--color-ink)] hover:bg-[#f6f5f1]"
            >
              <DownloadIcon width={14} height={14} />
              Export current table (.csv)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
