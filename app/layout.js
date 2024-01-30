import { Montserrat } from "next/font/google";
import "@/app/globals.css";
import MainComponent from "@/components/MainComponent";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Paperass AI",
  description: "Votre assistant administratif",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.className}`}>
        <MainComponent children={children} />
      </body>
    </html>
  );
}
