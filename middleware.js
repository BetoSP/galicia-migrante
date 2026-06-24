import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Solo interceptar rutas de administración y dashboard
  const isAdminRoute = pathname.startsWith('/admin');
  const isDashboardRoute = pathname.startsWith('/dashboard');

  if (!isAdminRoute && !isDashboardRoute) {
    return NextResponse.next();
  }

  // Obtener los tokens de acceso y refresh desde las cookies
  const accessToken = request.cookies.get('sb-access-token')?.value;

  if (!accessToken) {
    // Si no está autenticado, redirigir a /auth con el destino original para posterior redirección
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  try {
    // Instanciar un cliente ligero de Supabase para verificar el token
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Validar el token contra Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      throw new Error('Sesión inválida o expirada');
    }

    // Si es ruta de administración, verificar roles administrativos
    if (isAdminRoute) {
      // Consultar roles en la tabla usuarios_roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('usuarios_roles')
        .select('rol_id, roles (nombre, es_admin)')
        .eq('usuario_id', user.id);

      if (rolesError || !userRoles) {
        throw new Error('Error al validar roles');
      }

      // Comprobar si tiene algún rol administrativo o con es_admin = true
      const hasAdminAccess = userRoles.some(
        (ur) => ur.roles && (ur.roles.es_admin || ur.roles.nombre.startsWith('admin_'))
      );

      if (!hasAdminAccess) {
        // Redirigir a una página de no autorizado o al inicio
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    }

    // Permitir continuar si todo es válido
    return NextResponse.next();
  } catch (err) {
    console.error('Middleware Auth Error:', err.message);
    // Limpiar cookies e ir a /auth en caso de fallo
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(url);
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    return response;
  }
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
