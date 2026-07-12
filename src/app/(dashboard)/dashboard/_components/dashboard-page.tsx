"use client";

import { Users, Bike, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatsCard } from "./stats-card";
import { SalesChart } from "./sales-chart";
import { DashboardPageSkeleton } from "./dashboard-page-skeleton";
import {
  useOverviewStats,
  useArrivalStatusCounts,
  useRegistrationStatusCounts,
  useSalesByMonth,
} from "../_services/use-dashboard-queries";
import {
  arrivalStatusVariants,
  registrationStatusVariants,
} from "@/app/(dashboard)/management/inventory/_types/motorcycleStatusLabels";

const DashboardPage = () => {
  const overviewQuery = useOverviewStats();
  const arrivalQuery = useArrivalStatusCounts();
  const registrationQuery = useRegistrationStatusCounts();
  const salesQuery = useSalesByMonth(3);

  if (
    overviewQuery.isLoading ||
    arrivalQuery.isLoading ||
    registrationQuery.isLoading ||
    salesQuery.isLoading
  ) {
    return <DashboardPageSkeleton />;
  }

  const overview = overviewQuery.data;
  const arrivalCounts = arrivalQuery.data ?? [];
  const registrationCounts = registrationQuery.data ?? [];
  const salesData = salesQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Clientes"
          value={overview?.totalClients ?? 0}
          icon={Users}
        />
        <StatsCard
          title="Total Motos"
          value={overview?.totalMotorcycles ?? 0}
          icon={Bike}
        />
        <StatsCard
          title="Motos com Cliente"
          value={overview?.motorcyclesWithClient ?? 0}
          icon={CheckCircle}
        />
        <StatsCard
          title="Motos sem Cliente"
          value={overview?.motorcyclesWithoutClient ?? 0}
          icon={XCircle}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status de Chegada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {arrivalCounts.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between"
              >
                <Badge variant={arrivalStatusVariants[item.status] ?? "secondary"}>
                  {item.label}
                </Badge>
                <span className="text-lg font-bold tabular-nums">
                  {item.count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status de Emplacamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {registrationCounts.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between"
              >
                <Badge
                  variant={registrationStatusVariants[item.status] ?? "outline"}
                >
                  {item.label}
                </Badge>
                <span className="text-lg font-bold tabular-nums">
                  {item.count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <SalesChart data={salesData} />
    </div>
  );
};

export default DashboardPage;
