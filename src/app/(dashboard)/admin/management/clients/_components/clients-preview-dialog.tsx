"use client";

import { format } from "date-fns";
import { formatDocument } from "@/lib/format";
import { ClickToCopy } from "@/components/click-to-copy";
import { useClientStore } from "../_libs/use-clients-store";
import { useClient } from "../_services/use-client-queries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const ClientsPreviewDialog = () => {
  const {
    selectedClientId,
    clientPreviewOpen,
    updateClientPreviewOpen,
    updateClientId,
  } = useClientStore();

  const clientQuery = useClient();
  const item = clientQuery.data;

  const handleOpenChange = (open: boolean) => {
    updateClientPreviewOpen(open);
    if (!open) {
      updateClientId(null);
    }
  };

  return (
    <Dialog open={clientPreviewOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            Preview Cliente
            <Button
              variant="ghost"
              size="icon"
              className="size-8 ml-auto"
              type="button"
            >
              <Printer className="size-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {item ? (
          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-medium">{item.name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">CPF / CNPJ</p>
              <ClickToCopy text={item.cpf}>
                <span className="font-medium font-mono text-xs">{formatDocument(item.cpf)}</span>
              </ClickToCopy>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Cidade</p>
              <p className="font-medium">{item.city}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Vendedor</p>
              <p className="font-medium">{item.sellersName}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Data de Faturamento</p>
              <p className="font-medium">
                {item.billingDate
                  ? format(new Date(item.billingDate), "dd/MM/yyyy")
                  : "-"}
              </p>
            </div>

            <div className="space-y-1 col-span-2">
              <p className="text-sm text-muted-foreground">Motocicletas Vinculadas</p>
              {item._motorcycles && item._motorcycles.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {item._motorcycles.map((moto) => (
                    <span
                      key={moto.id}
                      className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-xs font-medium"
                    >
                      {moto.chassi} — {moto.model}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="font-medium">-</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            Carregando...
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { ClientsPreviewDialog };
