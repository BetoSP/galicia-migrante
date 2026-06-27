import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/admin', '/dashboard', '/traductor'];
const ADMIN_ROLES = ['admin_general'];
const TRANSLATOR_ROLES = ['admin_general', 'traductor_delegado'];

// Cookie que cachea los roles del usuario para evitar una query a BD en cada request.
// TTL de 5 minutos — valor bajo para que un cambio de rol se refleje rápido.
const ROLES_CACHE_COOKIE = 'gm_roles_cache';
const ROLES_CACHE_TTL_S = 300;

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
    // Intentar leer roles desde la cookie caché antes de ir a BD.
    let roleNames = null;
    const cached = request.cookies.get(ROLES_CACHE_COOKIE)?.value;
    if (cached) {
      try {
        const { uid, roles: cachedRoles } = JSON.parse(cached);
        // La caché solo es válida si corresponde al mismo usuario.
        if (uid === user.id) roleNames = cachedRoles;
      } catch {}
    }

    if (!roleNames) {
      const { data: userRoles } = await supabase
        .from('usuarios_roles')
        .select('roles (nombre)')
        .eq('usuario_id', user.id);

      roleNames = (userRoles || []).map((ur) => ur.roles?.nombre).filter(Boolean);

      // Persistir en cookie HttpOnly para los próximos requests del mismo usuario.
      response.cookies.set(ROLES_CACHE_COOKIE, JSON.stringify({ uid: user.id, roles: roleNames }), {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: ROLES_CACHE_TTL_S,
      });
    }

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
