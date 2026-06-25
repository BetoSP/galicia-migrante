import './components/App.css';
import './components/PersonModal.css';
import './components/ProfileDrawer.css';

export const metadata = {
  title: 'Árbol Genealógico | Galicia Migrante',
  description: 'Explora y construye tu árbol genealógico familiar de la diáspora gallega.',
};

export default function ArbolLayout({ children }) {
  return (
    <div className="arbol-module">
      {children}
    </div>
  );
}
