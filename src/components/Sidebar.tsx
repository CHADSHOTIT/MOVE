import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ListIcon,
  PlusCircleIcon,
  ImportExportIcon,
  SettingsIcon,
} from './icons';

const navItemBase =
  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors';
const navItemInactive = 'text-[var(--color-ink-muted)] hover:bg-[#f3f2ed] hover:text-[var(--color-ink)]';
const navItemActive = 'bg-[var(--color-green-50)] text-[var(--color-green-700)]';

interface SidebarProps {
  onImportExportClick: () => void;
}

export default function Sidebar({ onImportExportClick }: SidebarProps) {
  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-4">
      <div className="flex items-center gap-2 px-2 pb-6 pt-1">
        <span className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[var(--color-green-700)]">
          <span className="h-2 w-2 rounded-[2px] bg-white" />
        </span>
        <span className="text-[14.5px] font-semibold text-[var(--color-ink)]">Subscriptions</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `${navItemBase} ${isActive ? navItemActive : navItemInactive}`}
        >
          <HomeIcon width={16} height={16} />
          Dashboard
        </NavLink>
        <NavLink
          to="/subscriptions"
          className={({ isActive }) => `${navItemBase} ${isActive ? navItemActive : navItemInactive}`}
        >
          <ListIcon width={16} height={16} />
          All subscriptions
        </NavLink>
        <NavLink
          to="/subscriptions/new"
          className={({ isActive }) => `${navItemBase} ${isActive ? navItemActive : navItemInactive}`}
        >
          <PlusCircleIcon width={16} height={16} />
          Add subscription
        </NavLink>
      </nav>

      <div className="flex flex-col gap-1 border-t border-[var(--color-border)] pt-3">
        <button
          type="button"
          onClick={onImportExportClick}
          className={`${navItemBase} ${navItemInactive} w-full text-left`}
        >
          <ImportExportIcon width={16} height={16} />
          Import / Export
        </button>
        <NavLink
          to="/settings"
          className={({ isActive }) => `${navItemBase} ${isActive ? navItemActive : navItemInactive}`}
        >
          <SettingsIcon width={16} height={16} />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}
