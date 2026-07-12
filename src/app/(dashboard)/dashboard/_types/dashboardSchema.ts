type OverviewStats = {
  totalClients: number;
  totalMotorcycles: number;
  motorcyclesWithClient: number;
  motorcyclesWithoutClient: number;
};

type ArrivalStatusCount = {
  status: string;
  label: string;
  count: number;
};

type RegistrationStatusCount = {
  status: string;
  label: string;
  count: number;
};

type SalesByMonth = {
  month: string;
  count: number;
};

export type {
  OverviewStats,
  ArrivalStatusCount,
  RegistrationStatusCount,
  SalesByMonth,
};
