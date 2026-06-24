import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Rutas de administrador
    if (pathname.startsWith('/admin')) {
      if (token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Rutas de prescripcion
    if (pathname === '/') {
      if (token.role !== 'ADMIN' && token.role !== 'PRESCRIPTION') {
        return NextResponse.redirect(new URL('/ingreso', req.url));
      }
    }

    // Rutas de ingreso
    if (pathname.startsWith('/ingreso')) {
      if (token.role !== 'ADMIN' && token.role !== 'ADMISSION') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

export const config = {
  matcher: ['/', '/ingreso/:path*', '/admin/:path*']
};
