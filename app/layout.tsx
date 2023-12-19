import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import ReduxProvider from "@/store/ReduxProvider";
import ModalProvider from "@/providers/ModalProvider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "E-Commerce Admin Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <ClerkProvider>
      <ReduxProvider>
        <html lang="en">
          <body className={inter.className}>
            <ModalProvider />
            {children}
          </body>
        </html>
      </ReduxProvider>
    </ClerkProvider>
  );
}
