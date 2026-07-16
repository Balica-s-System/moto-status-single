"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCookieStore } from "@/lib/stores/cookie-store";

const CookieConsent = () => {
  const { consent, acceptAll, rejectAll, setConsent } = useCookieStore();
  const [mounted, setMounted] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);

  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || consent !== null) return null;

  const handleSave = () => {
    setConsent({ analytics, marketing });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
      >
        <Card className="mx-auto max-w-2xl p-6 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Configuração de Cookies</p>
              <p className="text-sm text-muted-foreground">
                Utilizamos cookies essenciais para o funcionamento do sistema.
                Você pode escolher quais cookies deseja autorizar.
              </p>
            </div>
          </div>

          <AnimatePresence>
            {showCustomize && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-3 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="necessary" className="text-sm font-medium">
                        Necessários
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Autenticação e funcionamento básico
                      </p>
                    </div>
                    <Switch id="necessary" checked disabled />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="analytics" className="text-sm font-medium">
                        Analytics
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Nos ajudam a entender como o sistema é usado
                      </p>
                    </div>
                    <Switch
                      id="analytics"
                      checked={analytics}
                      onCheckedChange={setAnalytics}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing" className="text-sm font-medium">
                        Marketing
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Para personalizar comunicações e ofertas
                      </p>
                    </div>
                    <Switch
                      id="marketing"
                      checked={marketing}
                      onCheckedChange={setMarketing}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={acceptAll}>
              Aceitar Todos
            </Button>
            <Button size="sm" variant="outline" onClick={rejectAll}>
              Rejeitar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                if (showCustomize) {
                  handleSave();
                } else {
                  setShowCustomize(true);
                }
              }}
            >
              {showCustomize ? "Salvar Preferências" : "Configurar"}
            </Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export { CookieConsent };
