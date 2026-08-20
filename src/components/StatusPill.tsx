import type { AttentionStatus, SubStatus } from '../data/subscriptions';

const attentionStyles: Record<AttentionStatus, { label: string; className: string }> = {
  decision_due: { label: 'Decision due', className: 'bg-[var(--color-red-50)] text-[var(--color-red-600)]' },
  review_soon: { label: 'Review soon', className: 'bg-[var(--color-amber-50)] text-[var(--color-amber-600)]' },
  approved_to_renew: { label: 'Approved to renew', className: 'bg-[var(--color-green-50)] text-[var(--color-green-700)]' },
  cancellation_requested: { label: 'Cancellation requested', className: 'bg-[var(--color-blue-50)] text-[var(--color-blue-600)]' },
};

const statusStyles: Record<SubStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-[var(--color-green-50)] text-[var(--color-green-700)]' },
  review_required: { label: 'Review required', className: 'bg-[var(--color-amber-50)] text-[var(--color-amber-600)]' },
  cancelling: { label: 'Cancelling', className: 'bg-[var(--color-blue-50)] text-[var(--color-blue-600)]' },
  cancelled: { label: 'Cancelled', className: 'bg-[#f1f0ec] text-[var(--color-ink-muted)]' },
};

function Pill({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-medium leading-none ${className}`}
    >
      {label}
    </span>
  );
}

export function AttentionStatusPill({ status }: { status: AttentionStatus }) {
  const s = attentionStyles[status];
  return <Pill label={s.label} className={s.className} />;
}

export function SubStatusPill({ status }: { status: SubStatus }) {
  const s = statusStyles[status];
  return <Pill label={s.label} className={s.className} />;
}

export function statusDotColor(status: SubStatus): string {
  switch (status) {
    case 'active':
      return 'bg-[var(--color-green-600)]';
    case 'review_required':
      return 'bg-[var(--color-amber-600)]';
    case 'cancelling':
      return 'bg-[var(--color-blue-600)]';
    case 'cancelled':
      return 'bg-[var(--color-ink-faint)]';
  }
}
