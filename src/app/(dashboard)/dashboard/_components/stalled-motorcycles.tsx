"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { StalledMotorcycle } from "../_types/dashboardSchema";

type StalledMotorcyclesProps = {
  data: StalledMotorcycle[];
};

const StalledMotorcycles = ({ data }: StalledMotorcyclesProps) => {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Motos Paradas (+30 dias sem cliente)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nenhuma moto parada no momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Motos Paradas (+30 dias sem cliente)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((moto) => (
            <div
              key={moto.id}
              className="flex items-center justify-between rounded-lg border px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{moto.model}</p>
                <p className="font-mono text-xs text-muted-foreground truncate">
                  {moto.chassi}
                </p>
              </div>
              <span className="shrink-0 text-sm font-bold text-destructive">
                {moto.daysInStock}d
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { StalledMotorcycles };
