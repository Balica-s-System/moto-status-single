import { QueryClient } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from 'react'
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";

type ProvidersProps = {
  children: ReactNode
}

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (e) => {
        if (e.message === "NEXT_REDIRECT") return;
        toast.error(e.message);
      },
      onSuccess: () => {
        toast.success("Operation was successful.")
      }
    }
  }
})

const Providers = ({ children }: ProvidersProps) => {
  return (
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster/>
        {children}
    </NextThemesProvider>
  )
}

export { Providers }