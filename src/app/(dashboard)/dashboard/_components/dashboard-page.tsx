"use client";

import Link from "next/link";
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
import { ActivityTimeline } from "./activity-timeline";
import { AttentionSection } from "./attention-section";
import { DashboardPageSkeleton } from "./dashboard-page-skeleton";
import {
  useOverviewStats,
  useArrivalStatusCounts,
  useRegistrationStatusCounts,
  useSalesByMonth,
  useRecentActivity,
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
  const activityQuery = useRecentActivity(10);

  if (
    overviewQuery.isLoading ||
    arrivalQuery.isLoading ||
    registrationQuery.isLoading ||
    salesQuery.isLoading ||
    activityQuery.isLoading
  ) {
    return <DashboardPageSkeleton />;
  }

  const overview = overviewQuery.data;
  const arrivalCounts = arrivalQuery.data ?? [];
  const registrationCounts = registrationQuery.data ?? [];
  const salesData = salesQuery.data ?? [];
  const activities = activityQuery.data ?? [];

  return (
    <div className="space-y-6">
      <AttentionSection />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/management/clients">
          <StatsCard
            title="Total Clientes"
            value={overview?.totalClients ?? 0}
            icon={Users}
          />
        </Link>
        <Link href="/management/inventory">
          <StatsCard
            title="Total Motos"
            value={overview?.totalMotorcycles ?? 0}
            icon={Bike}
          />
        </Link>
        <Link href="/management/clients">
          <StatsCard
            title="Motos com Cliente"
            value={overview?.motorcyclesWithClient ?? 0}
            icon={CheckCircle}
          />
        </Link>
        <Link href="/management/inventory">
          <StatsCard
            title="Motos sem Cliente"
            value={overview?.motorcyclesWithoutClient ?? 0}
            icon={XCircle}
          />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/management/inventory">
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
                  <Badge
                    variant={arrivalStatusVariants[item.status] ?? "secondary"}
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
        </Link>

        <Link href="/management/inventory">
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
                    variant={
                      registrationStatusVariants[item.status] ?? "outline"
                    }
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
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SalesChart data={salesData} />
        <ActivityTimeline data={activities} />
      </div>
    </div>
  );
};

export default DashboardPage;
