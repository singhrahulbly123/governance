import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "DIA Thrive Administration", description: "Academic governance ERP administration workspace." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <html lang="en"><body>{children}</body></html>;
}
