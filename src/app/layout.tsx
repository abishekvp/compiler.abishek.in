import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Web Compiler Studio — HTML, CSS, JS Live Playground & IDE | abishek.in',
  description: 'Professional fullscreen HTML, CSS, and JavaScript compiler & live playground with sandboxed execution, real-time dev console, CDN manager, responsive simulator, and export tools.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💻</text></svg>" />
      </head>
      <body className="bg-surface-darker text-slate-100 antialiased overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
