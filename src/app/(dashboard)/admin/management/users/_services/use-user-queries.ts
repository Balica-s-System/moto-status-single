import { useQuery } from "@tanstack/react-query";
import { getUsers, getUser } from "./userQueries";

type UserFilters = {
  searchTerm?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

const useGetUsers = (filters: UserFilters) => {
  return useQuery({
    queryKey: ["user", filters],
    queryFn: () => getUsers(filters),
  });
};

const useUserById = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });
};

export { useGetUsers, useUserById };
