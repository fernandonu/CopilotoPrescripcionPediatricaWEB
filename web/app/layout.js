import { Inter, Outfit } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
  title: "Copiloto para la Prescripción Pediátrica e Ingreso Clínico",
  description: "Asistente farmacoterapéutico pediátrico y de ingresos para profesionales de la salud."
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <nav className="main-navbar">
          <div className="nav-container">
            <Link href="/" className="nav-logo">
              Copilotos Garrahan
            </Link>
            <div className="nav-links">
              <Link href="/" className="nav-link">
                Prescripción
              </Link>
              <Link href="/ingreso" className="nav-link">
                Ingreso Clínico
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
