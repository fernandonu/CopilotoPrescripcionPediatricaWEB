"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <nav className="main-navbar">
        <div className="nav-container">
          <span className="nav-logo">Copilotos Garrahan</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="main-navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          Copilotos Garrahan
        </Link>
        <div className="nav-links">
          {session ? (
            <>
              {(session.user.role === 'ADMIN' || session.user.role === 'PRESCRIPTION') && (
                <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
                  Prescripción
                </Link>
              )}
              
              {(session.user.role === 'ADMIN' || session.user.role === 'ADMISSION') && (
                <Link href="/ingreso" className={`nav-link ${pathname === '/ingreso' ? 'active' : ''}`}>
                  Ingreso Clínico
                </Link>
              )}

              {session.user.role === 'ADMIN' && (
                <Link href="/admin" className={`nav-link ${pathname === '/admin' ? 'active' : ''}`}>
                  Panel Admin
                </Link>
              )}

              <div className="nav-user">
                <span className="user-name">{session.user.name || session.user.username}</span>
                <button onClick={() => signOut({ callbackUrl: '/login' })} className="logout-btn">
                  Salir
                </button>
              </div>
            </>
          ) : (
            <Link href="/login" className={`nav-link ${pathname === '/login' ? 'active' : ''}`}>
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
