import { useMemo, useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { subscriptions } from '../data/subscriptions';
import { cancellationDeadline, internalReminder, formatLong } from '../lib/dates';
import { ArrowLeftIcon, CalendarIcon, UploadIcon, CloseIcon } from '../components/icons';

const categories = ['Software', 'IT', 'Compliance', 'Marketing', 'Finance'];
const departments = ['IT', 'Engineering', 'Finance', 'Marketing', 'Compliance'];
const owners = ['Sarah Hall', 'IT Team', 'James Cole', 'Marketing', 'Finance Team'];
const noticeOptions = [30, 60, 90];

function toInputDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function AddSubscription() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const editing = useMemo(() => subscriptions.find((s) => s.id === editId) ?? null, [editId]);

  const [name, setName] = useState(editing?.name ?? 'Autodesk Construction Cloud');
  const [supplier, setSupplier] = useState(editing?.supplier ?? 'Autodesk');
  const [category, setCategory] = useState(editing?.category ?? 'Software');
  const [department, setDepartment] = useState(editing?.department ?? 'Engineering');
  const [owner, setOwner] = useState(editing?.owner ?? 'Sarah Hall');
  const [annualCost, setAnnualCost] = useState(String(editing?.annualCost ?? 12400));
  const [startDate, setStartDate] = useState(toInputDate(editing?.startDate ?? new Date(2025, 10, 14)));
  const [renewalDate, setRenewalDate] = useState(toInputDate(editing?.renewalDate ?? new Date(2026, 10, 14)));
  const [noticeDays, setNoticeDays] = useState(editing?.noticeDays ?? 60);
  const [recipients, setRecipients] = useState<string[]>(['Sarah Hall', 'Finance Team', 'IT Team']);
  const [recipientInput, setRecipientInput] = useState('');
  const [notes, setNotes] = useState(editing?.notes ?? '');

  const renewal = useMemo(() => {
    const [y, m, d] = renewalDate.split('-').map(Number);
    return new Date(y, m - 1, d);
  }, [renewalDate]);

  const deadline = useMemo(() => cancellationDeadline(renewal, noticeDays), [renewal, noticeDays]);
  const reminder = useMemo(() => internalReminder(deadline), [deadline]);

  function removeRecipient(name: string) {
    setRecipients((r) => r.filter((x) => x !== name));
  }

  function addRecipient() {
    const value = recipientInput.trim();
    if (value && !recipients.includes(value)) {
      setRecipients((r) => [...r, value]);
    }
    setRecipientInput('');
  }

  function handleSave() {
    navigate('/subscriptions');
  }

  return (
    <div className="mx-auto max-w-[1200px] px-8 py-7">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-md p-1 text-[var(--color-ink-muted)] hover:bg-[#f3f2ed]"
              aria-label="Back"
            >
              <ArrowLeftIcon width={17} height={17} />
            </button>
            <h1 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)]">Add subscription</h1>
          </div>
          <p className="mt-1 pl-9 text-[13.5px] text-[var(--color-ink-muted)]">
            Add the contract details and we&apos;ll calculate the important dates automatically.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-md border border-[var(--color-border-strong)] px-3 py-1.5 text-[12.5px] font-medium text-[var(--color-ink)] hover:bg-[#f6f5f1]"
        >
          <UploadIcon width={14} height={14} />
          Import from Excel
        </button>
      </div>

      <div className="mt-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr_260px]">
          <div>
            <h2 className="text-[13px] font-semibold text-[var(--color-ink)]">Subscription</h2>
            <div className="mt-4 flex flex-col gap-4">
              <Field label="Subscription name">
                <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Supplier">
                <input value={supplier} onChange={(e) => setSupplier(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Category">
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Department">
                <select value={department} onChange={(e) => setDepartment(e.target.value)} className={inputClass}>
                  {departments.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </Field>
              <Field label="Subscription owner">
                <select value={owner} onChange={(e) => setOwner(e.target.value)} className={inputClass}>
                  {owners.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          <div>
            <h2 className="text-[13px] font-semibold text-[var(--color-ink)]">Cost &amp; contract</h2>
            <div className="mt-4 flex flex-col gap-4">
              <Field label="Annual cost">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--color-ink-muted)]">
                    £
                  </span>
                  <input
                    value={annualCost}
                    onChange={(e) => setAnnualCost(e.target.value.replace(/[^0-9]/g, ''))}
                    className={`${inputClass} pl-6`}
                  />
                </div>
              </Field>
              <Field label="Start date">
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Renewal date">
                <input type="date" value={renewalDate} onChange={(e) => setRenewalDate(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Cancellation notice period">
                <select
                  value={noticeDays}
                  onChange={(e) => setNoticeDays(Number(e.target.value))}
                  className={inputClass}
                >
                  {noticeOptions.map((n) => (
                    <option key={n} value={n}>
                      {n} days before renewal
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          <div>
            <div className="rounded-lg border border-[var(--color-green-100)] bg-[var(--color-green-50)] p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white">
                <CalendarIcon width={16} height={16} className="text-[var(--color-green-700)]" />
              </span>
              <div className="mt-3">
                <p className="text-[12px] text-[var(--color-ink-muted)]">Cancellation deadline</p>
                <p className="mt-0.5 text-[16px] font-semibold text-[var(--color-red-600)]">{formatLong(deadline)}</p>
              </div>
              <div className="mt-3">
                <p className="text-[12px] text-[var(--color-ink-muted)]">Internal reminder</p>
                <p className="mt-0.5 text-[16px] font-semibold text-[var(--color-amber-600)]">{formatLong(reminder)}</p>
              </div>
              <p className="mt-3 text-[12px] leading-snug text-[var(--color-ink-muted)]">
                We&apos;ll alert the team 30 days before the cancellation deadline.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--color-border)] pt-6">
          <Field label="Notification recipients">
            <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-[var(--color-border-strong)] px-2 py-1.5">
              {recipients.map((r) => (
                <span
                  key={r}
                  className="flex items-center gap-1 rounded-full bg-[#f1f0ec] px-2.5 py-1 text-[12px] font-medium text-[var(--color-ink)]"
                >
                  {r}
                  <button type="button" onClick={() => removeRecipient(r)} aria-label={`Remove ${r}`}>
                    <CloseIcon width={11} height={11} />
                  </button>
                </span>
              ))}
              <input
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    addRecipient();
                  }
                }}
                onBlur={addRecipient}
                placeholder="Add recipient..."
                className="min-w-[120px] flex-1 border-none bg-transparent text-[12.5px] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)]"
              />
            </div>
          </Field>

          <div className="mt-4">
            <Field label="Notes (optional)">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes about this subscription..."
                rows={3}
                className={`${inputClass} resize-none py-2`}
              />
            </Field>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5 border-t border-[var(--color-border)] pt-5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md border border-[var(--color-border-strong)] px-4 py-2 text-[13px] font-medium text-[var(--color-ink)] hover:bg-[#f6f5f1]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-[var(--color-green-700)] px-4 py-2 text-[13px] font-medium text-white hover:bg-[var(--color-green-900)]"
          >
            Save subscription
          </button>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  'w-full rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 py-2 text-[13px] text-[var(--color-ink)] outline-none focus:border-[var(--color-green-600)]';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-medium text-[var(--color-ink-muted)]">{label}</span>
      {children}
    </label>
  );
}
