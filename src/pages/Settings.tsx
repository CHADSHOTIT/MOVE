export default function Settings() {
  return (
    <div className="mx-auto max-w-[1400px] px-8 py-7">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)]">Settings</h1>
      <p className="mt-1 text-[13.5px] text-[var(--color-ink-muted)]">
        Manage workspace preferences and notification defaults.
      </p>

      <div className="mt-6 max-w-[560px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] py-3">
          <div>
            <p className="text-[13px] font-medium text-[var(--color-ink)]">Reminder window</p>
            <p className="text-[12px] text-[var(--color-ink-muted)]">
              Notify the team this many days before a cancellation deadline.
            </p>
          </div>
          <span className="text-[13px] font-medium text-[var(--color-ink)]">30 days</span>
        </div>
        <div className="flex items-center justify-between border-b border-[var(--color-border)] py-3">
          <div>
            <p className="text-[13px] font-medium text-[var(--color-ink)]">Default notice period</p>
            <p className="text-[12px] text-[var(--color-ink-muted)]">Used when adding a new subscription.</p>
          </div>
          <span className="text-[13px] font-medium text-[var(--color-ink)]">60 days</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-[13px] font-medium text-[var(--color-ink)]">Currency</p>
            <p className="text-[12px] text-[var(--color-ink-muted)]">Used across dashboards and exports.</p>
          </div>
          <span className="text-[13px] font-medium text-[var(--color-ink)]">GBP (£)</span>
        </div>
      </div>
    </div>
  );
}
