"use client";

import Link from "next/link";
import {
  useOverviewStats,
  useArrivalStatusCounts,
  useSalesByMonth,
  useAvgMotorcyclesPerClient,
  useDaysSinceLastSale,
} from "../_services/use-dashboard-queries";
import {
  AlertTriangle,
  Clock,
  DollarSign,
  Bike,
  Timer,
  TrendingUp,
} from "lucide-react";

const AlertBar = () => {
  const { data: overview } = useOverviewStats();
  const { data: arrivalCounts } = useArrivalStatusCounts();
  const { data: salesData } = useSalesByMonth(3);
  const { data: avgMotos } = useAvgMotorcyclesPerClient();
  const { data: daysSinceLastSale } = useDaysSinceLastSale();

  const delayed =
    arrivalCounts?.find((a) => a.status === "DELAYED")?.count ?? 0;
  const lastMonthSales = salesData?.length
    ? salesData[salesData.length - 1].count
    : 0;
  const totalMotos = overview?.totalMotorcycles ?? 0;
  const motosComCliente = overview?.motorcyclesWithClient ?? 0;
  const conversao =
    totalMotos > 0
      ? Math.round((motosComCliente / totalMotos) * 100)
      : 0;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Link
        href="/management/inventory?forecastArrivalStatus=DELAYED"
        className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 transition-colors hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:hover:bg-red-900/50"
      >
        <AlertTriangle className="size-5 shrink-0 text-red-600 dark:text-red-400" />
        <div className="min-w-0">
          <p className="text-xs text-red-600 dark:text-red-400">
            Atrasadas
          </p>
          <p className="text-lg font-bold text-red-700 dark:text-red-300">
            {delayed}
          </p>
        </div>
      </Link>
      <Link
        href="/management/inventory"
        className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 transition-colors hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950 dark:hover:bg-amber-900/50"
      >
        <Clock className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="min-w-0">
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Motos Estoque
          </p>
          <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
            {overview?.motorcyclesWithoutClient ?? 0}
          </p>
        </div>
      </Link>
      <Link
        href="/dashboard/sales"
        className="flex items-center gap-3 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 transition-colors hover:bg-purple-100 dark:border-purple-900 dark:bg-purple-950 dark:hover:bg-purple-900/50"
      >
        <Timer className="size-5 shrink-0 text-purple-600 dark:text-purple-400" />
        <div className="min-w-0">
          <p className="text-xs text-purple-600 dark:text-purple-400">
            Última venda
          </p>
          <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
            {daysSinceLastSale !== null && daysSinceLastSale !== undefined
              ? `${daysSinceLastSale}d`
              : "—"}
          </p>
        </div>
      </Link>
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950">
        <TrendingUp className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <div className="min-w-0">
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            Conversão
          </p>
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
            {conversao}%
          </p>
        </div>
      </div>
    </div>
  );
};

export { AlertBar };
