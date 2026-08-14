import { useQuery } from "@tanstack/react-query";
import { getTicket, getTickets, type TicketFilters } from "./ticketQueries";

const useGetTickets = (filters: TicketFilters) => {
  return useQuery({
    queryKey: ["ticket", filters],
    queryFn: () => getTickets(filters),
  });
};

const useTicketById = (id: string) => {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: () => getTicket(id),
    enabled: !!id,
  });
};

export { useGetTickets, useTicketById };
