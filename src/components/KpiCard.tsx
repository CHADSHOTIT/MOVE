import type { ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  iconBg: string;
}

export default function KpiCard({ label, value, icon, iconBg }: KpiCardProps) {
  return (
    <div className="flex flex-1 items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5">
      <div>
        <p className="text-[12.5px] text-[var(--color-ink-muted)]">{label}</p>
        <p className="mt-1.5 text-[22px] font-semibold leading-none text-[var(--color-ink)]">{value}</p>
      </div>
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
        {icon}
      </span>
    </div>
  );
}
