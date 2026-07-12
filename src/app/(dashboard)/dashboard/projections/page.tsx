"use client";

import { Banknote, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { StatsCard } from "../_components/stats-card";
import { ProjectionStatsCard } from "../_components/projection-stats-card";
import { StockVsSoldBar } from "../_components/stock-vs-sold-bar";
import { useProjectionStats } from "../_services/use-dashboard-queries";

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const ProjectionsPage = () => {
  const { data, isLoading } = useProjectionStats();

  if (isLoading) {
    return (
      <div className="min-h-[850px] space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-28" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <>
      <PageHeader
        title="Projeções"
        description="Projeções financeiras baseadas no inventário"
      />
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ProjectionStatsCard
          title="Valor em Estoque"
          value={data.stockValue}
          subtitle={`${data.stockCount} motos sem cliente`}
        />
        <ProjectionStatsCard
          title="Valor Vendido"
          value={data.soldValue}
          subtitle={`${data.soldCount} motos vendidas`}
        />
        <ProjectionStatsCard
          title="Valor Total"
          value={data.totalValue}
        />
        <StatsCard
          title="Preço Médio"
          value={Math.round(data.avgPrice)}
          icon={Banknote}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StockVsSoldBar
          stockValue={data.stockValue}
          soldValue={data.soldValue}
          stockCount={data.stockCount}
          soldCount={data.soldCount}
        />

        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <BarChart3 className="size-4" />
              Distribuição por Ano
            </h3>
            <div className="space-y-3">
              {data.yearDistribution.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhuma moto com ano cadastrado.
                </p>
              )}
              {data.yearDistribution.map((item) => (
                <div
                  key={item.year}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium">{item.year}</span>
                  <span className="text-lg font-bold tabular-nums">
                    {item.count} {item.count === 1 ? "moto" : "motos"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProjectionsPage;
