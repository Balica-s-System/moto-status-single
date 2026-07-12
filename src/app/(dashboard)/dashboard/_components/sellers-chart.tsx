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
import type { SalesBySeller } from "../_types/dashboardSchema";

type SellersChartProps = {
  data: SalesBySeller[];
};

const SellersChart = ({ data }: SellersChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas por Vendedor</CardTitle>
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
                dataKey="seller"
                width={100}
                tick={{ fontSize: 13 }}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                }}
                formatter={(value) => [`${value} clientes`, "Vendas"]}
              />
              <Bar
                dataKey="count"
                fill="var(--chart-4)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export { SellersChart };
