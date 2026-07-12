import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProjectionStatsCardProps = {
  title: string;
  value: number;
  subtitle?: string;
};

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const ProjectionStatsCard = ({
  title,
  value,
  subtitle,
}: ProjectionStatsCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold tabular-nums">{formatBRL(value)}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};

export { ProjectionStatsCard };
