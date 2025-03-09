import "@repo/ui/globals.css";
import { ToastProvider } from "@repo/ui/components/ui/toast";
import { Toaster } from "@repo/ui/components/ui/toaster";
import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME } from "../../../../constants";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { WalletProvider } from "../context/WalletProvider";

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={newsreader.className}>
        <WalletProvider>
          <ToastProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow container max-w-4xl mx-auto">
                {children}
              </main>
              <Toaster />
              <Footer />
            </div>
          </ToastProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
