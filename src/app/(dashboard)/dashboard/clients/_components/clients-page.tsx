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
import { UnbilledClients } from "../../_components/unbilled-clients";
import {
  useClientAcquisition,
  useRecentClients,
  useAvgMotorcyclesPerClient,
  useUnbilledClients,
} from "../../_services/use-dashboard-queries";

const ClientsPageSkeleton = () => (
  <div className="min-h-[850px] space-y-6">
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
    <Card>
      <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </CardContent>
    </Card>
  </div>
);

const ClientsPage = () => {
  const acquisitionQuery = useClientAcquisition(6);
  const recentQuery = useRecentClients(5);
  const avgQuery = useAvgMotorcyclesPerClient();
  const unbilledQuery = useUnbilledClients(5);

  if (
    acquisitionQuery.isLoading ||
    recentQuery.isLoading ||
    avgQuery.isLoading ||
    unbilledQuery.isLoading
  ) {
    return <ClientsPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AvgMotorcyclesCard value={avgQuery.data ?? 0} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ClientAcquisitionChart data={acquisitionQuery.data ?? []} />
        <RecentClients data={recentQuery.data ?? []} />
      </div>
      <UnbilledClients data={unbilledQuery.data ?? []} />
    </div>
  );
};

export default ClientsPage;
