import { NextuiProvider } from "./nextuiProvider";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextuiProvider>
        <NextThemesProvider attribute="class" defaultTheme="light">
          {children}
        </NextThemesProvider>
      </NextuiProvider>
    </>
  );
}
