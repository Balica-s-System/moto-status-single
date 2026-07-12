"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { ForecastChart } from "../../_components/forecast-chart";
import { TopModelsChart } from "../../_components/top-models-chart";
import { StalledMotorcycles } from "../../_components/stalled-motorcycles";
import {
  useForecastArrivals,
  useTopModels,
  useStalledMotorcycles,
} from "../../_services/use-dashboard-queries";

const StockPageSkeleton = () => (
  <div className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
        <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
      </Card>
      <Card>
        <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
        <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
      </Card>
    </div>
    <Card>
      <CardHeader><Skeleton className="h-5 w-48" /></CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </CardContent>
    </Card>
  </div>
);

const StockPage = () => {
  const forecastQuery = useForecastArrivals(3);
  const topModelsQuery = useTopModels(5);
  const stalledQuery = useStalledMotorcycles(30, 5);

  if (forecastQuery.isLoading || topModelsQuery.isLoading || stalledQuery.isLoading) {
    return <StockPageSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <ForecastChart data={forecastQuery.data ?? []} />
        <TopModelsChart data={topModelsQuery.data ?? []} />
      </div>
      <StalledMotorcycles data={stalledQuery.data ?? []} />
    </div>
  );
};

export default StockPage;
