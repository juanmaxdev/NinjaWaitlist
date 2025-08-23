import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IniciativaNinja Waitlist',
  description: 'Página dedicada al waitlist de IniciativaNinja. Regístrate y sé el primero en enterarte.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/fav/favicon.png" type="png" />
        <meta httpEquiv="Permissions-Policy" content="geolocation=(), microphone=(), camera=()" />
        <meta httpEquiv="Referrer-Policy" content="no-referrer" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      </head>
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
