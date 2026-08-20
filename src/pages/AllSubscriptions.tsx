import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { subscriptions, getReminder, type SubStatus } from '../data/subscriptions';
import { formatCurrency, formatShort } from '../lib/dates';
import { SubStatusPill } from '../components/StatusPill';
import SubscriptionDrawer from '../components/SubscriptionDrawer';
import { SearchIcon, ChevronDownIcon, UploadIcon, DownloadIcon, PlusCircleIcon } from '../components/icons';

type TabKey = 'all' | SubStatus;

const tabs: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'review_required', label: 'Review required' },
  { key: 'cancelling', label: 'Cancelling' },
  { key: 'cancelled', label: 'Cancelled' },
];

function FilterSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="relative">
      <select className="h-9 appearance-none rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] pl-3 pr-8 text-[12.5px] text-[var(--color-ink)] outline-none">
        <option>{label}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDownIcon width={13} height={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
    </div>
  );
}

export default function AllSubscriptions() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<TabKey>('all');
  const [search, setSearch] = useState('');

  const openId = searchParams.get('open');
  const selected = subscriptions.find((s) => s.id === openId) ?? null;

  const counts = useMemo(() => {
    const c: Record<TabKey, number> = { all: subscriptions.length, active: 0, review_required: 0, cancelling: 0, cancelled: 0 };
    for (const s of subscriptions) c[s.status]++;
    return c;
  }, []);

  const filtered = useMemo(() => {
    return subscriptions.filter((s) => {
      if (tab !== 'all' && s.status !== tab) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [tab, search]);

  function openDrawer(id: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('open', id);
      return next;
    });
  }

  function closeDrawer() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('open');
      return next;
    });
  }

  function exportCsv() {
    const header = ['Subscription', 'Category', 'Owner', 'Cost', 'Renewal', 'Cancellation Notice', 'Decision Date', 'Status'];
    const rows = filtered.map((s) => [
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

  return (
    <div className="flex h-full">
      <div className="min-w-0 flex-1 overflow-y-auto px-8 py-7">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)]">All subscriptions</h1>
              <p className="mt-1 text-[13.5px] text-[var(--color-ink-muted)]">
                Manage active, upcoming and cancelled subscriptions.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/subscriptions/new')}
                className="flex items-center gap-1.5 rounded-md border border-[var(--color-border-strong)] px-3 py-1.5 text-[12.5px] font-medium text-[var(--color-ink)] hover:bg-[#f6f5f1]"
              >
                <UploadIcon width={14} height={14} />
                Import Excel
              </button>
              <button
                type="button"
                onClick={exportCsv}
                className="flex items-center gap-1.5 rounded-md border border-[var(--color-border-strong)] px-3 py-1.5 text-[12.5px] font-medium text-[var(--color-ink)] hover:bg-[#f6f5f1]"
              >
                <DownloadIcon width={14} height={14} />
                Export
              </button>
              <button
                type="button"
                onClick={() => navigate('/subscriptions/new')}
                className="flex items-center gap-1.5 rounded-md bg-[var(--color-green-700)] px-3 py-1.5 text-[12.5px] font-medium text-white hover:bg-[var(--color-green-900)]"
              >
                <PlusCircleIcon width={14} height={14} />
                Add subscription
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <SearchIcon width={14} height={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subscriptions..."
                className="h-9 w-[220px] rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] pl-8 pr-3 text-[12.5px] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)]"
              />
            </div>
            <FilterSelect label="Status" options={['Active', 'Review required', 'Cancelling', 'Cancelled']} />
            <FilterSelect label="Department" options={['IT', 'Engineering', 'Finance', 'Marketing', 'Compliance']} />
            <FilterSelect label="Owner" options={['Sarah Hall', 'IT Team', 'James Cole', 'Marketing']} />
            <FilterSelect label="Renewal period" options={['Next 30 days', 'Next 90 days', 'This year']} />
          </div>

          <div className="mt-4 flex items-center gap-5 border-b border-[var(--color-border)]">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 border-b-2 pb-2.5 text-[13px] font-medium transition-colors ${
                  tab === t.key
                    ? 'border-[var(--color-green-700)] text-[var(--color-green-700)]'
                    : 'border-transparent text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
                }`}
              >
                {t.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] ${
                    tab === t.key ? 'bg-[var(--color-green-50)] text-[var(--color-green-700)]' : 'bg-[#f1f0ec] text-[var(--color-ink-muted)]'
                  }`}
                >
                  {counts[t.key]}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
            <table className="w-full min-w-[860px] border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[11.5px] uppercase tracking-wide text-[var(--color-ink-faint)]">
                  <th className="px-4 py-2.5 font-medium">Subscription</th>
                  <th className="px-3 py-2.5 font-medium">Category</th>
                  <th className="px-3 py-2.5 font-medium">Owner</th>
                  <th className="px-3 py-2.5 font-medium">Cost</th>
                  <th className="px-3 py-2.5 font-medium">Renewal</th>
                  <th className="px-3 py-2.5 font-medium">Cancellation Notice</th>
                  <th className="px-3 py-2.5 font-medium">Decision Date</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => openDrawer(s.id)}
                    className={`cursor-pointer border-b border-[var(--color-border)] last:border-b-0 hover:bg-[#f8f7f3] ${
                      s.id === openId ? 'bg-[var(--color-green-50)]' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{s.name}</td>
                    <td className="px-3 py-3 text-[var(--color-ink-muted)]">{s.category}</td>
                    <td className="px-3 py-3 text-[var(--color-ink-muted)]">{s.owner}</td>
                    <td className="px-3 py-3 text-[var(--color-ink-muted)]">{formatCurrency(s.annualCost)}</td>
                    <td className="px-3 py-3 text-[var(--color-ink-muted)]">{formatShort(s.renewalDate)}</td>
                    <td className="px-3 py-3 text-[var(--color-ink-muted)]">{s.noticeDays} days</td>
                    <td className="px-3 py-3 text-[var(--color-ink-muted)]">{formatShort(getReminder(s))}</td>
                    <td className="px-4 py-3">
                      <SubStatusPill status={s.status} />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-[13px] text-[var(--color-ink-muted)]">
                      No subscriptions match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && <SubscriptionDrawer subscription={selected} onClose={closeDrawer} />}
    </div>
  );
}
