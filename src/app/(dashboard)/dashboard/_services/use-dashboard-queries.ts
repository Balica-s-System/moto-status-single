import { useQuery } from "@tanstack/react-query";
import {
  getOverviewStats,
  getArrivalStatusCounts,
  getRegistrationStatusCounts,
  getSalesByMonth,
  getSalesBySeller,
  getSalesByCity,
  getForecastArrivals,
  getTopModels,
  getStalledMotorcycles,
  getClientAcquisition,
  getRecentClients,
  getAvgMotorcyclesPerClient,
  getDaysSinceLastSale,
  getUnbilledClients,
  getRecentActivity,
} from "./dashboardQueries";

const useOverviewStats = () => {
  return useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: getOverviewStats,
  });
};

const useArrivalStatusCounts = () => {
  return useQuery({
    queryKey: ["dashboard", "arrivalStatus"],
    queryFn: getArrivalStatusCounts,
  });
};

const useRegistrationStatusCounts = () => {
  return useQuery({
    queryKey: ["dashboard", "registrationStatus"],
    queryFn: getRegistrationStatusCounts,
  });
};

const useSalesByMonth = (months = 3) => {
  return useQuery({
    queryKey: ["dashboard", "sales", months],
    queryFn: () => getSalesByMonth(months),
  });
};

const useSalesBySeller = () => {
  return useQuery({
    queryKey: ["dashboard", "salesBySeller"],
    queryFn: getSalesBySeller,
  });
};

const useSalesByCity = () => {
  return useQuery({
    queryKey: ["dashboard", "salesByCity"],
    queryFn: getSalesByCity,
  });
};

const useForecastArrivals = (months = 3) => {
  return useQuery({
    queryKey: ["dashboard", "forecastArrivals", months],
    queryFn: () => getForecastArrivals(months),
  });
};

const useTopModels = (limit = 5) => {
  return useQuery({
    queryKey: ["dashboard", "topModels", limit],
    queryFn: () => getTopModels(limit),
  });
};

const useStalledMotorcycles = (days = 30, limit = 5) => {
  return useQuery({
    queryKey: ["dashboard", "stalled", days, limit],
    queryFn: () => getStalledMotorcycles(days, limit),
  });
};

const useClientAcquisition = (months = 6) => {
  return useQuery({
    queryKey: ["dashboard", "clientAcquisition", months],
    queryFn: () => getClientAcquisition(months),
  });
};

const useRecentClients = (limit = 5) => {
  return useQuery({
    queryKey: ["dashboard", "recentClients", limit],
    queryFn: () => getRecentClients(limit),
  });
};

const useAvgMotorcyclesPerClient = () => {
  return useQuery({
    queryKey: ["dashboard", "avgMotorcyclesPerClient"],
    queryFn: getAvgMotorcyclesPerClient,
  });
};

const useDaysSinceLastSale = () => {
  return useQuery({
    queryKey: ["dashboard", "daysSinceLastSale"],
    queryFn: getDaysSinceLastSale,
  });
};

const useUnbilledClients = (limit = 5) => {
  return useQuery({
    queryKey: ["dashboard", "unbilledClients", limit],
    queryFn: () => getUnbilledClients(limit),
  });
};

const useRecentActivity = (limit = 10) => {
  return useQuery({
    queryKey: ["dashboard", "recentActivity", limit],
    queryFn: () => getRecentActivity(limit),
  });
};

export {
  useOverviewStats,
  useArrivalStatusCounts,
  useRegistrationStatusCounts,
  useSalesByMonth,
  useSalesBySeller,
  useSalesByCity,
  useForecastArrivals,
  useTopModels,
  useStalledMotorcycles,
  useClientAcquisition,
  useRecentClients,
  useAvgMotorcyclesPerClient,
  useDaysSinceLastSale,
  useUnbilledClients,
  useRecentActivity,
};
