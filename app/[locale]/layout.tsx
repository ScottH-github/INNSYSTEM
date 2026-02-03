import type { Metadata } from "next";
import "../../globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export const metadata: Metadata = {
  title: "L'Atelier OS - Salon Management",
  description: "Sophisticated interior design and salon management system",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="app-container">
            <Sidebar />
            <div className="main-wrapper">
              <Navbar />
              <main className="content-area">
                {children}
              </main>
            </div>
          </div>
        </NextIntlClientProvider>
        <style jsx global>{`
          .app-container {
            display: flex;
            min-height: 100vh;
          }
          .main-wrapper {
            flex: 1;
            margin-left: 80px;
            display: flex;
            flex-direction: column;
          }
          .content-area {
            flex: 1;
            padding: 2rem 3.5rem;
            margin-top: 70px;
          }
          @media (max-width: 768px) {
            .main-wrapper {
              margin-left: 0;
            }
            .content-area {
              margin-bottom: 60px;
            }
          }
        `}</style>
      </body>
    </html>
  );
}
