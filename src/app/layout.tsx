import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import PageTransition from "./components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tarmim - Habit Tracker & Personal Dashboard",
  description: "Track your habits, consistency, and progress with Tarmim.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var pref = JSON.parse(localStorage.getItem('tarmim_preferences') || '{}');
                  var root = document.documentElement;
                  if (pref.theme === 'light') {
                    root.setAttribute('data-theme', 'light');
                  } else {
                    root.setAttribute('data-theme', 'dark');
                  }
                  if (pref.primaryColor) {
                    root.style.setProperty('--mint', pref.primaryColor);
                    root.style.setProperty('--mint-s', pref.primaryColor + '22');
                  }
                  if (pref.secondaryColor) {
                    root.style.setProperty('--teal', pref.secondaryColor);
                    root.style.setProperty('--teal-d', pref.secondaryColor);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <div className="layout-wrapper">
          <div className="app-container">
            <header className="sticky-nav-bar">
              <Nav />
            </header>
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </div>
      </body>
    </html>
  );
}
