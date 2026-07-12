import { useQuery } from "@tanstack/react-query";
import {
  getOverviewStats,
  getArrivalStatusCounts,
  getRegistrationStatusCounts,
  getSalesByMonth,
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

export {
  useOverviewStats,
  useArrivalStatusCounts,
  useRegistrationStatusCounts,
  useSalesByMonth,
};
