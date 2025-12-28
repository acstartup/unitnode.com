import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { GridBackground } from "@/components/grid-background";
import { ModalProvider } from "@/components/modal-provider";
import { UserProvider } from "@/contexts/UserContext";

export const metadata: Metadata = {
  title: "UnitNode.com",
  description: "Automating tasks for real estate property mangagement",
  icons: {
    icon: '/unitnode-icon.svg',
    apple: '/unitnode-icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // change to "system" at full production aka when we have more than light mode
          enableSystem
          disableTransitionOnChange
        >
          <GridBackground />
          <UserProvider>
            <ModalProvider>
              {children}
            </ModalProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}