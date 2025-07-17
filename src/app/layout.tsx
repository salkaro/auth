import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Script from "next/script";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <Script
                    src="https://www.google.com/recaptcha/enterprise.js"
                    strategy="beforeInteractive"
                    async
                    defer
                />
            </head>
            <body
                suppressHydrationWarning
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Providers>
                    <main>{children}</main>
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
