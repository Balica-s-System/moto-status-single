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
import type { SalesByCity } from "../_types/dashboardSchema";

type CitiesChartProps = {
  data: SalesByCity[];
};

const CitiesChart = ({ data }: CitiesChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas por Cidade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" className="text-muted-foreground" />
              <YAxis
                type="category"
                dataKey="city"
                width={100}
                tick={{ fontSize: 13 }}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                }}
                formatter={(value) => [`${value} clientes`, "Clientes"]}
              />
              <Bar
                dataKey="count"
                fill="var(--chart-2)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export { CitiesChart };
