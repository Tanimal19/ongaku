import "./globals.css";
import Script from "next/script";
import { inter } from "@/app/font";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <Script src="https://www.youtube.com/iframe_api" />
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
