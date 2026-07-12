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

type StockVsSoldBarProps = {
  stockValue: number;
  soldValue: number;
  stockCount: number;
  soldCount: number;
};

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const StockVsSoldBar = ({
  stockValue,
  soldValue,
  stockCount,
  soldCount,
}: StockVsSoldBarProps) => {
  const chartData = [
    {
      label: "Em Estoque",
      valor: stockValue,
      quantidade: stockCount,
    },
    {
      label: "Vendidas",
      valor: soldValue,
      quantidade: soldCount,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valor em Estoque vs Vendido</CardTitle>
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
                tick={{ fontSize: 13 }}
                className="text-muted-foreground"
                tickFormatter={formatBRL}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                }}
                formatter={(value, _name, props) => [
                  `${formatBRL(Number(value))} (${props.payload.quantidade} unidades)`,
                  props.payload.label,
                ]}
              />
              <Bar
                dataKey="valor"
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

export { StockVsSoldBar };
