import { z } from "zod";

const motorcycleFiltersSchema = z.object({
  page: z.number(),
  pageSize: z.number().max(100),
});

type MotorcycleFiltersSchema = z.infer<typeof motorcycleFiltersSchema>;

const motorcycleFiltersDefaultValues: MotorcycleFiltersSchema = {
  pageSize: 12,
  page: 1,
};

export {
  type MotorcycleFiltersSchema,
  motorcycleFiltersDefaultValues,
  motorcycleFiltersSchema,
};
