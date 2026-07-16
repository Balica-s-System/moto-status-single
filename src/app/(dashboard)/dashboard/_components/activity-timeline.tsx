"use client";

import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, UserPlus, BadgeCheck } from "lucide-react";
import type { Activity } from "../_types/dashboardSchema";

type ActivityTimelineProps = {
  data: Activity[];
};

const typeConfig = {
  sale: {
    icon: DollarSign,
    bg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  },
  client_created: {
    icon: UserPlus,
    bg: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  registered: {
    icon: BadgeCheck,
    bg: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
};

const groupByDate = (activities: Activity[]) => {
  const groups: Record<string, Activity[]> = {};
  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(
    new Date(Date.now() - 86400000),
    "yyyy-MM-dd",
  );

  for (const item of activities) {
    const dateKey = format(new Date(item.date), "yyyy-MM-dd");
    let label: string;

    if (dateKey === today) {
      label = "Hoje";
    } else if (dateKey === yesterday) {
      label = "Ontem";
    } else {
      label = format(new Date(item.date), "dd 'de' MMM", { locale: ptBR });
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  }

  return groups;
};

const ActivityTimeline = ({ data }: ActivityTimelineProps) => {
  const groups = groupByDate(data);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nenhuma atividade registrada.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groups).map(([label, items]) => (
            <div key={label}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
              <div className="space-y-2">
                {items.map((item) => {
                  const config = typeConfig[item.type];
                  const Icon = config.icon;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-lg border px-3 py-2"
                    >
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${config.bg}`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">
                          {item.description}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(item.date), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { ActivityTimeline };
