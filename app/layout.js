import { AuthContextProvider } from "../_utils/auth";
import { TokenProvider } from "@/_utils/token-context";
import { AlbumProvider } from "../_utils/album-context";
import Header from "./components/header/header";
import localFont from "next/font/local";
import "./globals.css";
import { UserContextProvider } from "@/_utils/user-context";
import Image from "next/image";

const geistSans = localFont({
    src: "/fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});

const geistMono = localFont({
    src: "/fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata = {
    title: "EchoRate",
    description: "Generated by create next app",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="h-screen flex flex-col bg-vinyl">
                <AuthContextProvider>
                    <UserContextProvider>
                        <TokenProvider>
                            <AlbumProvider>
                                <Header />
                                <main className="flex-grow w-7/12 my-0 mx-auto py-10">
                                    {children}
                                </main>
                                <footer className="sticky flex justify-center items-center gap-4 w-full text-center py-2 bg-black bg-opacity-10 text-white">
                                    <p>Data and images provided by Spotify</p>
                                    <Image 
                                        width={100}
                                        height={27}
                                        src="/images/spotify-logo.png" 
                                        alt="Spotify Logo" 
                                        className="m"
                                    />
                                </footer>
                            </AlbumProvider>
                        </TokenProvider>
                    </UserContextProvider>
                </AuthContextProvider>
            </body>
        </html>
    );
}
