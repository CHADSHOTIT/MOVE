import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ImportExportModal from './components/ImportExportModal';
import Dashboard from './pages/Dashboard';
import AllSubscriptions from './pages/AllSubscriptions';
import AddSubscription from './pages/AddSubscription';
import Settings from './pages/Settings';

export default function App() {
  const [importExportOpen, setImportExportOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--color-page)]">
      <Sidebar onImportExportClick={() => setImportExportOpen(true)} />
      <main className="min-w-0 flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/subscriptions" element={<AllSubscriptions />} />
          <Route path="/subscriptions/new" element={<AddSubscription />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      {importExportOpen && <ImportExportModal onClose={() => setImportExportOpen(false)} />}
    </div>
  );
}
