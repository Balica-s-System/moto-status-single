"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useArrivalStatusCounts,
  useStalledMotorcycles,
  useRegistrationStatusCounts,
} from "../_services/use-dashboard-queries";
import {
  AlertTriangle,
  Clock,
  FileWarning,
  PackageOpen,
} from "lucide-react";

const AttentionSection = () => {
  const { data: arrivalCounts } = useArrivalStatusCounts();
  const { data: registrationCounts } = useRegistrationStatusCounts();
  const { data: stalled } = useStalledMotorcycles(90, 5);

  const delayed =
    arrivalCounts?.find((a) => a.status === "DELAYED")?.count ?? 0;
  const plating =
    registrationCounts?.find((a) => a.status === "PLATING")?.count ?? 0;

  const items = [];

  if (delayed > 0) {
    items.push({
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950/50",
      border: "border-red-200 dark:border-red-900",
      label: `${delayed} moto${delayed > 1 ? "s" : ""} atrasada${delayed > 1 ? "s" : ""}`,
      href: "/management/inventory?forecastArrivalStatus=DELAYED",
    });
  }

  if (plating > 0) {
    items.push({
      icon: Clock,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-950/50",
      border: "border-orange-200 dark:border-orange-900",
      label: `${plating} em emplacamento`,
      href: "/management/inventory",
    });
  }

  if (stalled && stalled.length > 0) {
    items.push({
      icon: PackageOpen,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/50",
      border: "border-amber-200 dark:border-amber-900",
      label: `${stalled.length} moto${stalled.length > 1 ? "s" : ""} parada${stalled.length > 1 ? "s" : ""} há +90 dias`,
      href: "/management/inventory",
    });
  }

  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileWarning className="size-5 text-destructive" />
          <CardTitle>Precisa de Atenção</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors hover:bg-muted/50 ${item.bg} ${item.border}`}
            >
              <Icon className={`size-5 shrink-0 ${item.color}`} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
};

export { AttentionSection };
