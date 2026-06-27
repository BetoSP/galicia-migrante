import AdminSidebar from './components/AdminSidebar';
import styles from './components/admin.module.css';

export const metadata = {
  title: 'Panel de Administración — Galicia Migrante',
  description: 'Consola de gestión administrativa del Portal Galicia Migrante',
};

export default function AdminLayout({ children }) {
  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
