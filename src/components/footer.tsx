"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const Footer = () => {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="mt-auto">
      <Separator />
      <div className="flex items-center justify-center gap-4 px-6 py-4">
        <p className="text-xs text-muted-foreground">
          {year
            ? `\u00A9 ${year} Balica's System. Todos os direitos reservados.`
            : "\u00A0"}
        </p>
        <span className="text-xs text-muted-foreground/40">|</span>
        <Link
          href="/terms"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Termos de Uso
        </Link>
        <span className="text-xs text-muted-foreground/40">|</span>
        <Link
          href="/privacy"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Privacidade
        </Link>
      </div>
    </footer>
  );
};

export { Footer };
