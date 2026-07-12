"use client";

import { format } from "date-fns";
import { ClickToCopy } from "@/components/click-to-copy";
import { useInventoryStore } from "../_libs/use-inventory-store";
import { useMotorcycle } from "../_services/use-inventory-queries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer } from "lucide-react";
import { Loading } from "@/app/(dashboard)/_components/loading";

const arrivalStatusLabels: Record<string, string> = {
  NO_INFORMATION: "Sem Informação",
  DELAYED: "Atrasado",
  ARRIVED: "Entregue",
};

const arrivalStatusVariants: Record<
  string,
  "default" | "destructive" | "secondary"
> = {
  NO_INFORMATION: "secondary",
  DELAYED: "destructive",
  ARRIVED: "default",
};

const registrationStatusLabels: Record<string, string> = {
  NO_PLATE: "Sem Placa",
  PLATING: "Em Emplacamento",
  PLATED: "Emplacada",
};

const registrationStatusVariants: Record<
  string,
  "default" | "secondary" | "outline"
> = {
  NO_PLATE: "outline",
  PLATING: "secondary",
  PLATED: "default",
};

const InventoryPreviewDialog = () => {
  const {
    inventoryPreviewOpen,
    updateInventoryPreviewOpen,
    updateMotorcycleId,
  } = useInventoryStore();

  const motorcycleQuery = useMotorcycle();
  const item = motorcycleQuery.data;

  const handleOpenChange = (open: boolean) => {
    updateInventoryPreviewOpen(open);
    if (!open) {
      updateMotorcycleId(null);
    }
  };

  return (
    <Dialog open={inventoryPreviewOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            Preview Motocicleta
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
              <p className="text-sm text-muted-foreground">Modelo</p>
              <p className="font-medium">{item.model}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Chassi</p>
              <ClickToCopy text={item.chassi}>
                <span className="font-medium font-mono text-xs">
                  {item.chassi}
                </span>
              </ClickToCopy>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ano</p>
              <p className="font-medium">{item.year ?? "-"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Preço</p>
              <p className="font-medium">
                {item.price
                  ? item.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  : "-"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Previsão de Chegada
              </p>
              <p className="font-medium">
                {item.forecastArrival
                  ? format(new Date(item.forecastArrival), "dd/MM/yyyy")
                  : "-"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status da Chegada</p>
              <Badge
                variant={
                  arrivalStatusVariants[item.forecastArrivalStatus] ??
                  "secondary"
                }
              >
                {arrivalStatusLabels[item.forecastArrivalStatus] ??
                  item.forecastArrivalStatus}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Status Emplacamento
              </p>
              {item.registrationStatus ? (
                <Badge
                  variant={
                    registrationStatusVariants[item.registrationStatus] ??
                    "outline"
                  }
                >
                  {registrationStatusLabels[item.registrationStatus] ??
                    item.registrationStatus}
                </Badge>
              ) : (
                <p className="font-medium">-</p>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Data Emplacamento</p>
              <p className="font-medium">
                {item.registrationDate
                  ? format(new Date(item.registrationDate), "dd/MM/yyyy")
                  : "-"}
              </p>
            </div>
          </div>
        ) : (
          <Loading />
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

export { InventoryPreviewDialog };
