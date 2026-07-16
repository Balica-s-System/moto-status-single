import { z } from "zod";

const searchSchema = z.object({
  cpf: z.string().min(1, "Digite um CPF ou CNPJ"),
});

type SearchSchema = z.infer<typeof searchSchema>;

type MotorcycleSearchResult = {
  id: string;
  chassi: string;
  model: string;
  forecastArrivalStatus: string;
  registrationStatus: string | null;
};

type ClientSearchResult = {
  id: string;
  name: string;
  cpf: string;
  city: string;
  sellersName: string;
  motorcycles: MotorcycleSearchResult[];
};

export type { SearchSchema, ClientSearchResult, MotorcycleSearchResult };
export { searchSchema };
