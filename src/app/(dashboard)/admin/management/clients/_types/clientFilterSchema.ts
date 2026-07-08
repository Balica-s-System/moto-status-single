import { z } from "zod";

const clientFiltersSchema = z.object({
  searchTerm: z.string(),
  sortBy: z.enum(["name", "cpf", "city", "sellersName", "billingDate"]),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number(),
  pageSize: z.number().max(100),
});

type ClientFiltersSchema = z.infer<typeof clientFiltersSchema>;

const clientFiltersDefaultValues: ClientFiltersSchema = {
  searchTerm: "",
  sortBy: "name",
  sortOrder: "desc",
  pageSize: 12,
  page: 1,
};

export {
  type ClientFiltersSchema,
  clientFiltersDefaultValues,
  clientFiltersSchema,
};
