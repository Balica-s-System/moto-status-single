import { createStore } from "@/lib/createStore";
import {
  clientFiltersDefaultValues,
  ClientFiltersSchema,
} from "../_types/clientFilterSchema";

type State = {
  selectedClientId: string | null;
  clientDialogOpen: boolean;
  clientPreviewOpen: boolean;
  clientFilters: ClientFiltersSchema;
  clientFiltersDrawerOpen: boolean;
};

type Actions = {
  updateClientId: (id: State["selectedClientId"]) => void;
  updateClientDialogOpen: (is: State["clientDialogOpen"]) => void;
  updateClientPreviewOpen: (is: State["clientPreviewOpen"]) => void;
  updateClientFilters: (filters: State["clientFilters"]) => void;
  updateClientFiltersPage: (action: "next" | "prev" | number) => void;
  updateClientFiltersDrawerOpen: (
    is: State["clientFiltersDrawerOpen"],
  ) => void;
  updateClientSearchTerm: (
    str: State["clientFilters"]["searchTerm"],
  ) => void;
};

type Store = State & Actions;

const useClientStore = createStore<Store>(
  (set) => ({
    selectedClientId: null,
    updateClientId: (id) =>
      set((state) => {
        state.selectedClientId = id;
      }),
    clientDialogOpen: false,
    updateClientDialogOpen: (is) =>
      set((state) => {
        state.clientDialogOpen = is;
      }),
    clientPreviewOpen: false,
    updateClientPreviewOpen: (is) =>
      set((state) => {
        state.clientPreviewOpen = is;
      }),
    updateClientFilters: (filters) =>
      set((state) => {
        state.clientFilters = filters;
      }),
    updateClientFiltersDrawerOpen: (is) =>
      set((state) => {
        state.clientFiltersDrawerOpen = is;
      }),
    clientFilters: clientFiltersDefaultValues,
    clientFiltersDrawerOpen: false,
    updateClientFiltersPage: (action) =>
      set((state) => {
        const currentPage = state.clientFilters.page;
        let newPage = currentPage;

        if (action === "next") {
          newPage = currentPage + 1;
        } else if (action === "prev") {
          newPage = Math.max(currentPage - 1, 1);
        } else if (typeof action === "number") {
          newPage = action;
        }

        state.clientFilters.page = newPage;
      }),
    updateClientSearchTerm: (searchTerm) =>
      set((state) => {
        state.clientFilters.searchTerm = searchTerm;
      }),
  }),
  {
    name: "clients-store",
    excludeFromPersist: ["clientFilters"],
  },
);

export { useClientStore };
