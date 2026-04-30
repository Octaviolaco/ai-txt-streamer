import "./globals.css";
import { Public_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";

const publicSans = Public_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Mon Chatbot NestJS",
  description: "Chatbot propulsé par WebSockets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${publicSans.className} h-screen flex flex-col bg-background text-foreground`}>
        <AuthProvider>
          <header className="p-4 flex items-center justify-center border-b border-border bg-card">
            <h1 className="text-lg font-semibold flex items-center gap-2">
              <span>🤖</span> Mon Assistant Bot
            </h1>
          </header>

        {/* Zone du Chat qui prend le reste de l'écran */}
        <main className="flex-1 relative overflow-hidden bg-background">
          {children}
        </main>

        <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}