'use client';

import React, { useMemo } from 'react';
import Header from "@/components/Header";
import ToastProvider from '@/components/ToastProvider';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@/styles/app.scss';
import '@/styles/style.scss';
import { auth } from '@/commons/auth';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <Layout>
            {children}
          </Layout>
      </body>
    </html>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const user = useMemo(() => {
    return auth?.getUser() || {};
  }, []);

  return (
    <>
      <ToastProvider />
      <Header user={user} />
      <main>{children}</main>
    </>
  );
};

export default RootLayout;
