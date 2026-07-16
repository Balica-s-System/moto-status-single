import { type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatsCardProps = {
  title: string;
  value: number | string;
  icon: LucideIcon;
};

const StatsCard = ({ title, value, icon: Icon }: StatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="size-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-xl sm:text-2xl lg:text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
};

export { StatsCard };
