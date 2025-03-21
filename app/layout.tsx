import type { Metadata } from "next";
import { Blinker, Geist, Geist_Mono, Mulish, Poppins } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";


  import { Providers } from "@/providers/providers";
import Head from "@/components/home/navbar/navbar";
import Footer from "@/components/home/footer/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins (
  {
    variable: "--poppins",
    subsets: ["latin"],
    weight: ["500"]
  }
);

const mulish = Mulish (
  {
    variable: "--mulish",
    subsets: ["latin"],
    weight: ["500"]
  }
);

const blinker = Blinker(
{
  variable: "--blinker",
  subsets: ["latin"],
  weight: ["400"]
}
);



const signature = localFont({
   src: "../public/assets/fonts/maddison_signature/Maddison_Signature_DEMO.ttf",
   variable: "--font-signature", 
  });

export const metadata: Metadata = {
  title: "Ambassade du Tchad",
  description: "Site web officiel de l'ambassade du Tchad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${signature.variable} ${mulish.variable} ${blinker.variable} antialiased`}
      >
      <div className="font-blinker max-w-screen-2xl mx-auto ">
        <Head/>
          <Providers>{children}</Providers>
        <Footer/>
      </div> 
      </body>
    </html>
  );
}


