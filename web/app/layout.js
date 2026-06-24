import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import NextAuthProvider from "./components/SessionProvider";

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
        <NextAuthProvider>
          <Navbar />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
