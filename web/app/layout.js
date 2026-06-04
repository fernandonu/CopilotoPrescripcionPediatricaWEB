import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
  title: "Copiloto para la Prescripción Pediátrica",
  description: "Asistente farmacoterapéutico pediátrico para profesionales de la salud. Este asistente se ejecuta al momento de abrir la herramienta de prescripción. Genera recomendaciones en base a la información disponible en la historia clínica del paciente. Tomo como base las recomendaciones las guias, tablas, boletines y procedimientos dispobles en la intranet del hospital. OTRO ASISTENTE SE PODRIA EJECUTAR PARA VALIDAR LA PRESCRIPCION, ESTO ES UNA VEZ QUE SUCEDA EL EVENTO DE PRESCRIPCION."
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  );
}
