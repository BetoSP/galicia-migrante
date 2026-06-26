# ESTADO — Galicia Migrante
### Estado del desarrollo del ecosistema
**Versión:** 1.3 — 26 de junio de 2026
**Mantenimiento:** actualizar después de cada sesión de trabajo significativa.

---

## Arquitectura Unificada (Next.js App Router)

Toda la funcionalidad (Portal, Blog, Árbol Genealógico y placeholders de módulos) se consolidó en una única aplicación Next.js.

```
Portal Galicia Migrante/            ← Next.js App
├── app/                            ← Rutas del Portal y Módulos
│   ├── admin/                      ← Panel de administración centralizado
│   ├── api/                        ← Endpoints de API (traducción dinámica, etc.)
│   ├── arbol/                      ← Módulo Árbol Genealógico
│   ├── asociaciones/               ← Micrositios de asociaciones y listado general
│   ├── blog/                       ← Módulo Blog dinámico
│   ├── lugar-galicia/              ← Módulo "Tu lugar en Galicia"
│   ├── quienes-somos/              ← Quiénes somos
│   ├── xunta/                      ← Trámites Xunta
│   └── ...                         ← Layouts, estilos y páginas globales
├── components/                     ← Componentes compartidos del portal (Navbar, Footer, etc.)
├── locales/                        ← Archivos de internacionalización (GL, ES, EN)
├── docs/                           ← Documentación centralizada
├── database/                       ← Migraciones de base de datos y scripts de control
└── package.json                    ← Dependencias consolidadas (Next.js 16 + React 19 + Supabase + MDX)
```

---

## ✅ TAREAS COMPLETADAS RECIENTEMENTE

### 1. Autenticación y Seguridad
- **Eliminación de Bypasses:** Se eliminó el login ficticio `admin/admin` y se configuró un flujo de autenticación 100% funcional y real conectado a Supabase Auth.
- **Administrador General Único:** Se depuró la base de datos de otros usuarios existentes. Las credenciales válidas y únicas del administrador son:
  - **Email:** `administrador@galiciamigrante.com`
  - **Contraseña:** `Bmr2!091410` (cumple con las políticas de complejidad reforzadas).
- **Validación Estricta de Contraseña Compleja:** Formulario de registro configurado con validación regex robusta en el cliente: mínimo 10 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales, o inicio de sesión integrado con Google.

### 2. Internacionalización y Traducción Automática (Trilingüe)
- **Localización Completa:** Traducción dinámica al Español (es-AR), Gallego (gl) e Inglés (en) de las etiquetas de UI de todas las páginas y módulos de la aplicación mediante la unificación de los diccionarios en `/locales/`.
- **Integración con MyMemory Translate API:** Configurada API real de traducción automática con fallback local y uso de un correo registrado (`galiciamigrante2026@gmail.com`) para evitar bloqueos por límite de peticiones (aumentando a 50,000 caracteres diarios).
- **Control Fino de Edición Manual:** Creada la migración de base de datos (`019_traduccion_automatica_control.sql`) y tablas asociadas para manejar las banderas `_manual_gl` y `_manual_en`. Si un administrador edita manualmente un campo traducido, este se bloquea para evitar ser sobreescrito por la traducción automática. Si el texto en español original cambia, las banderas se resetean automáticamente para regenerar la traducción al vuelo.

---

## 📋 PLAN DE PRÓXIMOS PASOS (Tras reingreso por reinicio de PC)

1. **Validación de Login de Administrador (`/auth` y `/admin`):**
   - Iniciar sesión en el portal local usando `administrador@galiciamigrante.com` y `Bmr2!091410` para validar que el Dashboard Administrativo cargue correctamente y reconozca el rol de `admin_general`.
2. **Prueba de Edición de Contenidos y Banderas `_manual`:**
   - Realizar una edición manual de un campo en gallego o inglés desde el panel de administración.
   - Verificar en Supabase que la bandera `_manual_gl` o `_manual_en` se active para esa fila de datos.
   - Modificar la versión original en español y validar que el backend o la base de datos resetee la bandera y gatille la autotraducción.
3. **Auditoría de Navegación del Árbol Genealógico (`/arbol`):**
   - Asegurar que la persistencia del estado en el árbol genealógico funcione sin problemas bajo el nuevo esquema de sesión.
4. **Verificación de Performance de Traducción:**
   - Monitorear la respuesta de la API MyMemory en producción y confirmar que los fallbacks locales se activan de forma transparente si la llamada a la API falla o excede los tiempos de espera.

---

*Documento actualizado y certificado el 26/06/2026 antes del reinicio del sistema por el agente de desarrollo.*

