import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // Check if the route is an admin route (but not the login page)
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  // If not an admin route, just continue
  if (!isAdminRoute) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Get the user - this also refreshes the session if needed
    const { data: { user } } = await supabase.auth.getUser();

    // If on an admin route (not login) and not authenticated, redirect to login
    if (!isLoginPage && !user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    // If authenticated and on login page, redirect to admin dashboard
    if (isLoginPage && user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/recipes';
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, redirect to login for safety
    if (!isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }
}
