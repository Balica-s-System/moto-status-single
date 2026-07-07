import { createStore } from "@/lib/createStore";
import {
  motorcycleFiltersDefaultValues,
  MotorcycleFiltersSchema,
} from "../_types/motorcycleFilterSchema";

type State = {
  selectedMotorcycleId: string | null;
  inventoryDialogOpen: boolean;
  motorcycleFilters: MotorcycleFiltersSchema;
  motorcycleFiltersDrawerOpen: boolean;
};

type Actions = {
  updateMotorcycleId: (id: State["selectedMotorcycleId"]) => void;
  updateInventoryDialogOpen: (is: State["inventoryDialogOpen"]) => void;
  updateMotorcycleFilters: (filters: State["motorcycleFilters"]) => void;
  updateMotorcycleFiltersPage: (action: "next" | "prev" | number) => void;
  updateMotorcycleFiltersDrawerOpen: (
    is: State["motorcycleFiltersDrawerOpen"],
  ) => void;
  updateMotorcycleSearchTerm: (
    str: State["motorcycleFilters"]["searchTerm"],
  ) => void;
};

type Store = State & Actions;

const useInventoryStore = createStore<Store>(
  (set) => ({
    selectedMotorcycleId: null,
    updateMotorcycleId: (id) =>
      set((state) => {
        state.selectedMotorcycleId = id;
      }),
    inventoryDialogOpen: false,
    updateInventoryDialogOpen: (is) =>
      set((state) => {
        state.inventoryDialogOpen = is;
      }),
    updateMotorcycleFilters: (filters) =>
      set((state) => {
        state.motorcycleFilters = filters;
      }),
    updateMotorcycleFiltersDrawerOpen: (is) =>
      set((state) => {
        state.motorcycleFiltersDrawerOpen = is;
      }),
    motorcycleFilters: motorcycleFiltersDefaultValues,
    motorcycleFiltersDrawerOpen: false,
    updateMotorcycleFiltersPage: (action) =>
      set((state) => {
        const currentPage = state.motorcycleFilters.page;
        let newPage = currentPage;

        if (action === "next") {
          newPage = currentPage + 1;
        } else if (action === "prev") {
          newPage = Math.max(currentPage - 1, 1);
        } else if (typeof action === "number") {
          newPage = action;
        }

        state.motorcycleFilters.page = newPage;
      }),
    updateMotorcycleSearchTerm: (searchTerm) =>
      set((state) => {
        state.motorcycleFilters.searchTerm = searchTerm;
      }),
  }),
  {
    name: "inventory-store",
    excludeFromPersist: ["motorcycleFilters"],
  },
);

export { useInventoryStore };
