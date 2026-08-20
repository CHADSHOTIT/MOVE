import { useNavigate } from 'react-router-dom';
import type { Subscription } from '../data/subscriptions';
import { getDeadline, getReminder } from '../data/subscriptions';
import { formatCurrency, formatLong } from '../lib/dates';
import { SubStatusPill } from './StatusPill';
import { CloseIcon } from './icons';

interface SubscriptionDrawerProps {
  subscription: Subscription;
  onClose: () => void;
}

function Row({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--color-border)] py-2.5 text-[13px]">
      <span className="text-[var(--color-ink-muted)]">{label}</span>
      <span className={`font-medium text-[var(--color-ink)] ${valueClassName ?? ''}`}>{value}</span>
    </div>
  );
}

export default function SubscriptionDrawer({ subscription, onClose }: SubscriptionDrawerProps) {
  const navigate = useNavigate();
  const deadline = getDeadline(subscription);
  const reminder = getReminder(subscription);

  return (
    <aside className="flex h-full w-[360px] shrink-0 flex-col border-l border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex items-start justify-between border-b border-[var(--color-border)] px-5 py-4">
        <div>
          <h2 className="text-[15px] font-semibold text-[var(--color-ink)]">{subscription.name}</h2>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-[13px] text-[var(--color-ink-muted)]">
              {formatCurrency(subscription.annualCost)} / year
            </span>
            <SubStatusPill status={subscription.status} />
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-[var(--color-ink-muted)] hover:bg-[#f3f2ed]"
          aria-label="Close"
        >
          <CloseIcon width={16} height={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <Row label="Owner" value={subscription.owner} />
        <Row label="Department" value={subscription.department} />
        <Row label="Renewal" value={formatLong(subscription.renewalDate)} />
        <Row label="Cancellation notice" value={`${subscription.noticeDays} days`} />
        <Row label="Cancellation deadline" value={formatLong(deadline)} valueClassName="text-[var(--color-red-600)]" />
        <Row label="Internal decision required" value={formatLong(reminder)} valueClassName="text-[var(--color-amber-600)]" />

        <div className="mt-4 flex gap-2.5">
          <button
            type="button"
            className="flex-1 rounded-lg bg-[var(--color-green-700)] px-3 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[var(--color-green-900)]"
          >
            Renew
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg border border-[var(--color-green-700)] px-3 py-2 text-[13px] font-medium text-[var(--color-green-700)] transition-colors hover:bg-[var(--color-green-50)]"
          >
            Start cancellation
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-[13px] font-semibold text-[var(--color-ink)]">Activity</h3>
          <div className="relative mt-3 flex flex-col gap-4 pl-1">
            <div className="absolute bottom-2 left-[3.5px] top-2 w-px bg-[var(--color-border)]" />
            {subscription.activity.map((entry, i) => (
              <div key={i} className="relative flex items-start gap-3">
                <span className="relative z-10 mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-green-600)]" />
                <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                  <span className="text-[13px] text-[var(--color-ink)]">{entry.label}</span>
                  <span className="shrink-0 text-[12px] text-[var(--color-ink-muted)]">{entry.date ?? '–'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] px-5 py-3">
        <button
          type="button"
          onClick={() => navigate(`/subscriptions/new?edit=${subscription.id}`)}
          className="w-full rounded-lg border border-[var(--color-border-strong)] px-3 py-2 text-[13px] font-medium text-[var(--color-ink)] transition-colors hover:bg-[#f6f5f1]"
        >
          Edit subscription
        </button>
      </div>
    </aside>
  );
}
