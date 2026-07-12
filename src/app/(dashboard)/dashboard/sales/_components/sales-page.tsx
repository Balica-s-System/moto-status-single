"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { SellersChart } from "../../_components/sellers-chart";
import { CitiesChart } from "../../_components/cities-chart";
import {
  useSalesBySeller,
  useSalesByCity,
} from "../../_services/use-dashboard-queries";

const SalesPageSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2">
    {Array.from({ length: 2 }).map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const SalesPage = () => {
  const sellersQuery = useSalesBySeller();
  const citiesQuery = useSalesByCity();

  if (sellersQuery.isLoading || citiesQuery.isLoading) {
    return <SalesPageSkeleton />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SellersChart data={sellersQuery.data ?? []} />
      <CitiesChart data={citiesQuery.data ?? []} />
    </div>
  );
};

export default SalesPage;
