import { Link, useNavigate } from 'react-router-dom';
import {
  AnalyticsIcon,
  UserIcon,
  CancelIcon,
  FlagIcon,
  PlusCircleIcon,
} from '../components/icons';
import KpiCard from '../components/KpiCard';
import { AttentionStatusPill } from '../components/StatusPill';
import {
  attentionList,
  departmentSpend,
  getDeadline,
  kpis,
  subscriptions,
} from '../data/subscriptions';
import { daysUntil, formatCurrency, formatShort, dayOfMonth, monthShort } from '../lib/dates';

const upcoming = subscriptions
  .filter((s) => s.status !== 'cancelled')
  .map((s) => ({ sub: s, deadline: getDeadline(s) }))
  .filter(({ deadline }) => daysUntil(deadline) >= 0 && daysUntil(deadline) <= 90)
  .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
  .slice(0, 3);

const maxSpend = Math.max(...departmentSpend.map((d) => d.amount));

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-[1400px] px-8 py-7">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)]">
            Subscription Management
          </h1>
          <p className="mt-1 text-[13.5px] text-[var(--color-ink-muted)]">
            Monitor renewals, cancellation deadlines and annual subscription spend.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/subscriptions/new')}
          className="flex items-center gap-1.5 rounded-lg bg-[var(--color-green-700)] px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[var(--color-green-900)]"
        >
          <PlusCircleIcon width={15} height={15} />
          Add subscription
        </button>
      </div>

      <div className="mt-6 flex gap-4">
        <KpiCard
          label="Annual Subscription Cost"
          value={formatCurrency(kpis.annualCost)}
          icon={<AnalyticsIcon width={17} height={17} className="text-[var(--color-green-700)]" />}
          iconBg="bg-[var(--color-green-50)]"
        />
        <KpiCard
          label="Active Subscriptions"
          value={String(kpis.activeSubscriptions)}
          icon={<UserIcon width={17} height={17} className="text-[var(--color-green-700)]" />}
          iconBg="bg-[var(--color-green-50)]"
        />
        <KpiCard
          label="Cancelled This Year"
          value={String(kpis.cancelledThisYear)}
          icon={<CancelIcon width={17} height={17} className="text-[var(--color-ink-muted)]" />}
          iconBg="bg-[#f1f0ec]"
        />
        <KpiCard
          label="Decisions Required"
          value={String(kpis.decisionsRequired)}
          icon={<FlagIcon width={17} height={17} className="text-[var(--color-amber-600)]" />}
          iconBg="bg-[var(--color-amber-50)]"
        />
      </div>

      <div className="mt-6 flex items-start gap-5">
        <div className="min-w-0 flex-[3]">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="border-b border-[var(--color-border)] px-5 py-4">
              <h2 className="text-[14.5px] font-semibold text-[var(--color-ink)]">Needs your attention</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
                <thead>
                  <tr className="text-[11.5px] uppercase tracking-wide text-[var(--color-ink-faint)]">
                    <th className="px-5 py-2.5 font-medium">Subscription</th>
                    <th className="px-3 py-2.5 font-medium">Owner</th>
                    <th className="px-3 py-2.5 font-medium">Annual Cost</th>
                    <th className="px-3 py-2.5 font-medium">Renewal</th>
                    <th className="px-3 py-2.5 font-medium">Cancellation Deadline</th>
                    <th className="px-3 py-2.5 font-medium">Status</th>
                    <th className="px-5 py-2.5 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attentionList.map((sub) => {
                    const deadline = getDeadline(sub);
                    const urgent = daysUntil(deadline) <= 45;
                    return (
                      <tr key={sub.id} className="border-t border-[var(--color-border)]">
                        <td className="px-5 py-3 font-medium text-[var(--color-ink)]">{sub.name}</td>
                        <td className="px-3 py-3 text-[var(--color-ink-muted)]">{sub.owner}</td>
                        <td className="px-3 py-3 text-[var(--color-ink-muted)]">{formatCurrency(sub.annualCost)}</td>
                        <td className="px-3 py-3 text-[var(--color-ink-muted)]">{formatShort(sub.renewalDate)}</td>
                        <td
                          className={`px-3 py-3 font-medium ${
                            urgent ? 'text-[var(--color-red-600)]' : 'text-[var(--color-amber-600)]'
                          }`}
                        >
                          {formatShort(deadline)}
                        </td>
                        <td className="px-3 py-3">
                          {sub.attentionStatus && <AttentionStatusPill status={sub.attentionStatus} />}
                        </td>
                        <td className="px-5 py-3">
                          <Link
                            to={`/subscriptions?open=${sub.id}`}
                            className="inline-flex items-center rounded-md border border-[var(--color-border-strong)] px-3 py-1.5 text-[12px] font-medium text-[var(--color-ink)] transition-colors hover:bg-[#f6f5f1]"
                          >
                            {sub.status === 'active' || sub.status === 'cancelling' ? 'View' : 'Review'}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="border-t border-[var(--color-border)] px-5 py-3.5">
              <Link
                to="/subscriptions"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-[var(--color-green-700)] hover:text-[var(--color-green-900)]"
              >
                View all subscriptions
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4">
            <h2 className="text-[14.5px] font-semibold text-[var(--color-ink)]">
              Annual subscription spend by department
            </h2>
            <div className="mt-4 flex flex-col gap-3">
              {departmentSpend.map((row) => (
                <div key={row.department} className="flex items-center gap-3">
                  <span className="w-[90px] shrink-0 text-[12.5px] text-[var(--color-ink-muted)]">
                    {row.department}
                  </span>
                  <div className="h-4 flex-1 overflow-hidden rounded-sm bg-[#f1f0ec]">
                    <div
                      className="h-full rounded-sm bg-[var(--color-green-600)]"
                      style={{ width: `${(row.amount / maxSpend) * 100}%` }}
                    />
                  </div>
                  <span className="w-[70px] shrink-0 text-right text-[12.5px] font-medium text-[var(--color-ink)]">
                    {formatCurrency(row.amount)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-[var(--color-border)] pt-2 text-[11px] text-[var(--color-ink-faint)]">
              <span>£0</span>
              <span>£25K</span>
              <span>£50K</span>
              <span>£75K</span>
              <span>£100K</span>
            </div>
          </div>
        </div>

        <div className="w-[300px] shrink-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4">
          <h2 className="text-[14.5px] font-semibold text-[var(--color-ink)]">Upcoming deadlines</h2>
          <p className="mt-0.5 text-[12px] text-[var(--color-ink-muted)]">Next 90 days</p>

          <div className="relative mt-5 flex flex-col gap-6 pl-1">
            <div className="absolute bottom-2 left-[15px] top-2 w-px bg-[var(--color-border)]" />
            {upcoming.map(({ sub, deadline }) => {
              const remaining = daysUntil(deadline);
              const urgent = remaining <= 45;
              return (
                <div key={sub.id} className="relative flex gap-3.5">
                  <div className="relative z-10 flex w-[30px] shrink-0 flex-col items-center">
                    <span
                      className={`text-[15px] font-semibold leading-none ${
                        urgent ? 'text-[var(--color-red-600)]' : 'text-[var(--color-amber-600)]'
                      }`}
                    >
                      {dayOfMonth(deadline)}
                    </span>
                    <span className="mt-0.5 text-[10px] font-medium uppercase text-[var(--color-ink-faint)]">
                      {monthShort(deadline)}
                    </span>
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="truncate text-[13px] font-medium text-[var(--color-ink)]">{sub.name}</p>
                    <p
                      className={`mt-0.5 text-[12px] ${
                        urgent ? 'text-[var(--color-red-600)]' : 'text-[var(--color-amber-600)]'
                      }`}
                    >
                      {remaining} days remaining
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2 border-t border-[var(--color-border)] pt-3">
            <Link
              to="/subscriptions"
              className="inline-flex items-center gap-1 text-[13px] font-medium text-[var(--color-green-700)] hover:text-[var(--color-green-900)]"
            >
              View all upcoming
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
