import { Montserrat } from "next/font/google";
import "@/app/globals.css";
import MainComponent from "@/components/MainComponent";
import { GoogleAnalytics } from "@next/third-parties/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Paperass AI",
  description: "Votre assistant administratif",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.className}`}>
        <MainComponent>{children}</MainComponent>
      </body>
      <GoogleAnalytics gaId="G-FSCDE7ECFQ" />
    </html>
  );
}
