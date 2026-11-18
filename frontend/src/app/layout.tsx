import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
    display: "swap",
    subsets: ["latin"],
    variable: "--font-poppins",
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = { title: "ERP Administration", description: "Academic governance ERP administration workspace." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <html lang="en"><body className={poppins.variable}>{children}</body></html>;
}
