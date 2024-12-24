import {Noto_Sans} from "next/font/google"
import "./globals.css";

export const metadata = {
  title: "Instinctive studio",
};

const notoSans = Noto_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${notoSans.className}`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <main className="grow">
          {children}
        </main>
      </body>
    </html>
  );
}
