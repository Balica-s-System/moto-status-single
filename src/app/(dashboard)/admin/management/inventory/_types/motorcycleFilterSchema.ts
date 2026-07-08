import { z } from "zod";

const motorcycleFiltersSchema = z.object({
  searchTerm: z.string(),
  sortBy: z.enum(["chassi", "model", "forecastArrival"]),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  forecastArrivalStatus: z.enum(["", "DELAYED", "ARRIVED", "NO_INFORMATION"]),
  page: z.number(),
  pageSize: z.number().max(100),
});

type MotorcycleFiltersSchema = z.infer<typeof motorcycleFiltersSchema>;

const motorcycleFiltersDefaultValues: MotorcycleFiltersSchema = {
  searchTerm: "",
  sortBy: "chassi",
  forecastArrivalStatus: "",
  sortOrder: "desc",
  pageSize: 12,
  page: 1,
};

export {
  type MotorcycleFiltersSchema,
  motorcycleFiltersDefaultValues,
  motorcycleFiltersSchema,
};
