"use client";

import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bike, User } from "lucide-react";
import type { RecentClient } from "../_types/dashboardSchema";

type RecentClientsProps = {
  data: RecentClient[];
};

const RecentClients = ({ data }: RecentClientsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimos Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((client) => (
            <div
              key={client.id}
              className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                  <User className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{client.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {client.city} • {client.sellersName}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Bike className="size-3" />
                  {client.motorcycleCount}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(client.createdAt), "dd/MM")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { RecentClients };
