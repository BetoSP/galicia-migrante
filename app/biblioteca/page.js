import Link from 'next/link';

export const metadata = {
  title: 'Biblioteca Digital',
  description: 'Sección en desarrollo — Próximamente disponible.',
};

export default function BibliotecaPage() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '80px 24px',
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <div style={{
        background: 'var(--color-bg-soft, #f8fafc)',
        border: '1px solid var(--color-border-light, #e2e8f0)',
        borderRadius: '16px',
        padding: '48px 32px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
      }}>
        <span style={{ fontSize: '64px', marginBottom: '24px', display: 'block' }}>📚</span>
        <h1 style={{
          fontFamily: 'var(--font-display, serif)',
          fontSize: '32px',
          fontWeight: '700',
          color: 'var(--color-text-primary, #1e293b)',
          marginBottom: '16px'
        }}>
          Biblioteca Digital de la Diáspora
        </h1>
        <p style={{
          fontSize: '16px',
          color: 'var(--color-text-secondary, #64748b)',
          maxWidth: '500px',
          margin: '0 auto 32px auto',
          lineHeight: '1.6'
        }}>
          Estamos recopilando actas históricas, cartas de emigrantes, mapas antiguos y documentos literarios para digitalizarlos. Esta sección estará disponible próximamente.
        </p>
        <Link href="/" style={{
          background: 'var(--color-secondary, #c8a96e)',
          color: '#1a1a2e',
          padding: '12px 28px',
          borderRadius: '9999px',
          fontWeight: '700',
          textDecoration: 'none',
          display: 'inline-block',
          boxShadow: '0 4px 10px rgba(200, 169, 110, 0.2)',
          transition: 'transform 0.2s'
        }}>
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
