# Portal Galicia Migrante

Ecosistema digital integral para preservar, reconstruir y transmitir la cultura gallega entre las comunidades de la diáspora y sus descendientes.

El portal es la puerta de entrada. La genealogía es el servicio estrella del MVP — uno de los muchos servicios que el ecosistema ofrecerá de manera integrada.

## Arquitectura Unificada (Next.js App Router)

La arquitectura basada en workspaces (`modules/` y `shared/`) ha sido unificada en una única aplicación Next.js estructurada de la siguiente manera:

```
Portal Galicia Migrante/            ← Next.js App
├── app/                            ← Rutas del Portal y Módulos
│   ├── arbol/                      ← Módulo Árbol Genealógico (Consolidado)
│   ├── biblioteca/                 ← Módulo Biblioteca (Placeholder)
│   ├── blog/                       ← Módulo Blog dinámico
│   ├── investigacion/              ← Módulo Investigación (Placeholder)
│   ├── lugar-galicia/              ← Módulo "Tu lugar en Galicia" (Placeholder)
│   ├── quienes-somos/              ← Quiénes somos
│   ├── xunta/                      ← Trámites Xunta
│   └── ...                         ← Layouts, estilos y páginas globales
├── components/                     ← Componentes compartidos del portal (Navbar, Footer, etc.)
│   └── arbol/                      ← Componentes del Árbol Genealógico
├── content/
│   └── posts/                      ← Artículos en MDX (Blog)
├── database/
│   └── migrations/                 ← Migraciones de base de datos
├── docs/                           ← Documentación centralizada
├── lib/
│   ├── arbol/                      ← Lógica, utilidades y servicios del Árbol Genealógico
│   ├── posts.js                    ← Lógica de lectura MDX
│   └── supabase.js                 ← Cliente Supabase centralizado
├── public/                         ← Activos estáticos públicos
├── locales/                        ← Archivos de internacionalización (GL, ES, EN)
└── package.json                    ← Dependencias consolidadas (Next.js 16 + React 19 + Supabase + MDX)
```

## Instalación y Desarrollo Local

Instalar dependencias y arrancar el servidor Next.js en modo desarrollo:

```bash
npm install
npm run dev
# Acceder a http://localhost:3000
```

## Construcción para Producción

Validar la correcta compilación del proyecto:

```bash
npm run build
```

## Variables de Entorno

Crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://vrtqtltkiifconviaiwf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Deploy

- **Despliegue Continuo (CI/CD):** Configurado en Vercel. Cada commit en la rama `main` dispara automáticamente un despliegue.
- **Producción URL:** https://galicia-migrante.vercel.app

## Licencia

Todos los derechos reservados — Galicia Migrante 2026
