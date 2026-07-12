"use client";

import {
  useOverviewStats,
  useArrivalStatusCounts,
  useSalesByMonth,
  useAvgMotorcyclesPerClient,
} from "../_services/use-dashboard-queries";
import { AlertTriangle, Clock, DollarSign, Bike } from "lucide-react";

const AlertBar = () => {
  const { data: overview } = useOverviewStats();
  const { data: arrivalCounts } = useArrivalStatusCounts();
  const { data: salesData } = useSalesByMonth(3);
  const { data: avgMotos } = useAvgMotorcyclesPerClient();

  const delayed = arrivalCounts?.find((a) => a.status === "DELAYED")?.count ?? 0;
  const lastMonthSales = salesData?.length ? salesData[salesData.length - 1].count : 0;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950">
        <AlertTriangle className="size-5 shrink-0 text-red-600 dark:text-red-400" />
        <div className="min-w-0">
          <p className="text-xs text-red-600 dark:text-red-400">Atrasadas</p>
          <p className="text-lg font-bold text-red-700 dark:text-red-300">
            {delayed}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950">
        <Clock className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="min-w-0">
          <p className="text-xs text-amber-600 dark:text-amber-400">Motos Estoque</p>
          <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
            {overview?.motorcyclesWithoutClient ?? 0}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950">
        <DollarSign className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <div className="min-w-0">
          <p className="text-xs text-emerald-600 dark:text-emerald-400">Último mês</p>
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
            {lastMonthSales} vendas
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900 dark:bg-blue-950">
        <Bike className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
        <div className="min-w-0">
          <p className="text-xs text-blue-600 dark:text-blue-400">Média motos/cliente</p>
          <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
            {avgMotos ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export { AlertBar };
