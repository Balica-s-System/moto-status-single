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

type SalesBySeller = {
  seller: string;
  count: number;
};

type SalesByCity = {
  city: string;
  count: number;
};

type ForecastArrival = {
  month: string;
  count: number;
};

type TopModel = {
  model: string;
  count: number;
};

type StalledMotorcycle = {
  id: string;
  chassi: string;
  model: string;
  daysInStock: number;
};

type ClientAcquisition = {
  month: string;
  count: number;
};

type RecentClient = {
  id: string;
  name: string;
  city: string;
  sellersName: string;
  createdAt: string;
  motorcycleCount: number;
};

export type {
  OverviewStats,
  ArrivalStatusCount,
  RegistrationStatusCount,
  SalesByMonth,
  SalesBySeller,
  SalesByCity,
  ForecastArrival,
  TopModel,
  StalledMotorcycle,
  ClientAcquisition,
  RecentClient,
};
