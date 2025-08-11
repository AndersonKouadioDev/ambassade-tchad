// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Blinker, Geist, Geist_Mono, Mulish, Poppins } from "next/font/google";
import "@/app/globals.css";
import localFont from "next/font/local";
import Head from "@/components/home/navbar/navbar";
import Footer from "@/components/home/footer/footer";
import rtlDetect from "rtl-detect-intl";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import NextAuthSessionProvider from "@/providers/NextAuthSessionProvider";
import { Providers } from "@/providers/providers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import QueryProvider from "@/providers/query-provider";
import getQueryClient from "@/lib/get-query-client";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const poppins = Poppins({
  variable: "--poppins",
  subsets: ["latin"],
  weight: ["500"],
});
const mulish = Mulish({
  variable: "--mulish",
  subsets: ["latin"],
  weight: ["500"],
});
const blinker = Blinker({
  variable: "--blinker",
  subsets: ["latin"],
  weight: ["400"],
});
const signature = localFont({
  src: "../fonts/maddison_signature/Maddison_Signature_DEMO.ttf",
  variable: "--font-signature",
});

export const metadata: Metadata = {
  title: "Ambassade du Tchad",
  description: "Site web officiel de l'ambassade du Tchad",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`@/messages/${locale}.json`)).default;
  const langDir = rtlDetect.getLangDir(locale);

  const queryClient = getQueryClient();

  return (
    <html lang={locale} dir={langDir} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${signature.variable} ${mulish.variable} ${blinker.variable} antialiased`}
      >
        <div className="font-blinker w-full">
          <Providers>
            <QueryProvider>
              <HydrationBoundary state={dehydrate(queryClient)}>
                <NextAuthSessionProvider>
                  <NextIntlClientProvider locale={locale} messages={messages}>
                    <ClientLayoutWrapper>
                      <Head />
                      {children}
                      <Toaster />
                      <Footer />
                    </ClientLayoutWrapper>
                  </NextIntlClientProvider>
                </NextAuthSessionProvider>
              </HydrationBoundary>
            </QueryProvider>
          </Providers>
        </div>
      </body>
    </html>
  );
}
