import "./globals.css";
import { inter } from "@/app/font";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg" sizes="32x32" />
      </head>
      <body suppressHydrationWarning={true} className="bg-zinc-50">
        {children}
      </body>
    </html>
  );
}
