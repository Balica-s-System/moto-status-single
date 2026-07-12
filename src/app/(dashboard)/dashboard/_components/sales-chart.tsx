"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SalesByMonth } from "../_types/dashboardSchema";

type SalesChartProps = {
  data: SalesByMonth[];
};

const formatMonth = (month: string) => {
  const [year, m] = month.split("-");
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  return `${months[Number(m) - 1]}/${year.slice(2)}`;
};

const SalesChart = ({ data }: SalesChartProps) => {
  const chartData = data.map((item) => ({
    ...item,
    label: formatMonth(item.month),
  }));

  const current = data[data.length - 1]?.count ?? 0;
  const previous = data[data.length - 2]?.count ?? 0;
  const diff =
    previous > 0
      ? ((current - previous) / previous) * 100
      : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <CardTitle>Vendas (últimos 3 meses)</CardTitle>
          {chartData.length >= 2 && diff !== 0 && (
            <Badge
              variant={diff > 0 ? "default" : "destructive"}
              className="gap-1"
            >
              {diff > 0 ? "↑" : "↓"} {Math.abs(diff).toFixed(0)}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 13 }}
                className="text-muted-foreground"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 13 }}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                }}
                labelFormatter={(label) => `Mês: ${label}`}
                formatter={(value) => [`${value} motos`, "Vendas"]}
              />
              <Bar
                dataKey="count"
                fill="var(--chart-1)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export { SalesChart };
