import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import clsx from "clsx";
import {PrismicPreview} from "@prismicio/next";
import {createClient, repositoryName} from "@/prismicio";

const urban = Urbanist({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
    const client = createClient();
    const settings = await client.getSingle("settings");

    return {
        title: settings.data.meta_title,
        description: settings.data.meta_description,
    };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className=" bg-blue-950 text-slate-100">
      <body className={clsx(urban.className, "relative min-h-screen")}>
        <Header />
      {children}
        <Footer />
      <div className="absolute pointer-events-none inset-0 -z-40 h-full bg-[url('/img.png')] opacity-10 mix-blend-soft-light" />
      </body>
        <PrismicPreview repositoryName={repositoryName} />
    </html>
  );
}
