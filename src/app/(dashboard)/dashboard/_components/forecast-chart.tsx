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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ForecastArrival } from "../_types/dashboardSchema";

type ForecastChartProps = {
  data: ForecastArrival[];
};

const formatMonth = (month: string) => {
  const [y, m] = month.split("-");
  const months = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ];
  return `${months[Number(m) - 1]}/${y.slice(2)}`;
};

const ForecastChart = ({ data }: ForecastChartProps) => {
  const chartData = data.map((item) => ({
    ...item,
    label: formatMonth(item.month),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previsão de Chegadas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
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
                formatter={(value) => [`${value} motos`, "Previstas"]}
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

export { ForecastChart };
