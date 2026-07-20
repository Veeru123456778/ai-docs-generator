import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-slate-100">
        <main>{children}</main>
        {/* Global Sonner Toaster */}
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}