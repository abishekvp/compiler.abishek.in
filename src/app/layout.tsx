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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%232563eb%22/><text x=%2250%25%22 y=%2265%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22system-ui,sans-serif%22 font-weight=%22900%22 font-size=%2244%22 fill=%22%23ffffff%22>&lt;/&gt;</text></svg>" />
      </head>
      <body className="bg-surface-darker text-slate-100 antialiased overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
