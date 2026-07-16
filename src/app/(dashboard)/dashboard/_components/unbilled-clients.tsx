"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bike, AlertCircle } from "lucide-react";
import type { UnbilledClient } from "../_types/dashboardSchema";

type UnbilledClientsProps = {
  data: UnbilledClient[];
};

const UnbilledClients = ({ data }: UnbilledClientsProps) => {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sem Faturamento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Todos os clientes estão com faturamento registrado.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sem Faturamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((client) => (
            <div
              key={client.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2.5 dark:border-amber-900 dark:bg-amber-950/30"
            >
              <div className="flex items-center gap-3 min-w-0">
                <AlertCircle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {client.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {client.city} • {client.sellersName}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="gap-1 shrink-0">
                <Bike className="size-3" />
                {client.motorcycleCount}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { UnbilledClients };
