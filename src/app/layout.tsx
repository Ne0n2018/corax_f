import type {Metadata} from "next";

import "./globals.css";
import {Montserrat, Russo_One} from "next/font/google";
import NextTopLoader from "nextjs-toploader";

const montserrat = Montserrat({
    subsets: ["latin", "cyrillic"],
    variable: "--font-montserrat",
    display: "swap",
});

const russoOne = Russo_One({
    weight: "400",
    subsets: ["latin", "cyrillic"],
    variable: "--font-russo-one",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Corax",
    description: "Corax — магазин спортивного питания",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
            <body
                className={`${montserrat.variable} ${russoOne.variable} antialiased min-h-screen flex flex-col`}
            >
                <NextTopLoader color="#de382b" height={3} showSpinner={false}
                               shadow="0 0 10px #de382b,0 0 5px #de382b"/>
                {children}
            </body>
        </html>
    );
}
