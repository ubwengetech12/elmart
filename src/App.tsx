import { AdminStoreProvider } from './admin/useAdminStore';
import AppContent from './AppContent';

export default function App() {
  return (
    <AdminStoreProvider>
      <AppContent />
    </AdminStoreProvider>
  );
}