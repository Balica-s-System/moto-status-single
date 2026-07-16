"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bike } from "lucide-react";

type AvgMotorcyclesCardProps = {
  value: number;
};

const AvgMotorcyclesCard = ({ value }: AvgMotorcyclesCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Média Motos/Cliente
        </CardTitle>
        <Bike className="size-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
};

export { AvgMotorcyclesCard };
