import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/admin', '/dashboard', '/traductor'];
const ADMIN_ROLES = ['admin_general'];
const TRANSLATOR_ROLES = ['admin_general', 'traductor_delegado'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  if (!isProtected) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  const isAdminRoute = pathname.startsWith('/admin');
  const isTranslatorRoute = pathname.startsWith('/traductor');

  if (isAdminRoute || isTranslatorRoute) {
    const { data: userRoles } = await supabase
      .from('usuarios_roles')
      .select('roles (nombre)')
      .eq('usuario_id', user.id);

    const roleNames = (userRoles || []).map((ur) => ur.roles?.nombre).filter(Boolean);

    const requiredRoles = isAdminRoute ? ADMIN_ROLES : TRANSLATOR_ROLES;
    const hasAccess = roleNames.some((r) => requiredRoles.includes(r));

    if (!hasAccess) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/traductor/:path*'],
};
