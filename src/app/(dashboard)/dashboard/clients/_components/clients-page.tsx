"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { ClientAcquisitionChart } from "../../_components/client-acquisition-chart";
import { RecentClients } from "../../_components/recent-clients";
import { AvgMotorcyclesCard } from "../../_components/avg-motorcycles-card";
import {
  useClientAcquisition,
  useRecentClients,
  useAvgMotorcyclesPerClient,
} from "../../_services/use-dashboard-queries";

const ClientsPageSkeleton = () => (
  <div className="space-y-4">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader><Skeleton className="h-4 w-32" /></CardHeader>
        <CardContent><Skeleton className="h-9 w-16" /></CardContent>
      </Card>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
        <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
      </Card>
      <Card>
        <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

const ClientsPage = () => {
  const acquisitionQuery = useClientAcquisition(6);
  const recentQuery = useRecentClients(5);
  const avgQuery = useAvgMotorcyclesPerClient();

  if (acquisitionQuery.isLoading || recentQuery.isLoading || avgQuery.isLoading) {
    return <ClientsPageSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AvgMotorcyclesCard value={avgQuery.data ?? 0} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ClientAcquisitionChart data={acquisitionQuery.data ?? []} />
        <RecentClients data={recentQuery.data ?? []} />
      </div>
    </div>
  );
};

export default ClientsPage;
