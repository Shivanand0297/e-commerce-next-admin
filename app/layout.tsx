import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import ModalProvider from "@/providers/ModalProvider";
import ReduxProvider from "@/store/ReduxProvider";
import ToastProvider from "@/providers/toastProvider";

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
            <ToastProvider/>
            <ModalProvider />
            {children}
          </body>
        </html>
      </ReduxProvider>
    </ClerkProvider>
  );
}
