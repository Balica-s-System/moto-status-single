import { createStore } from "@/lib/createStore";
import {
  motorcycleFiltersDefaultValues,
  MotorcycleFiltersSchema,
} from "../_types/motorcycleFilterSchema";

type State = {
  selectedMotorcycleId: string | null;
  inventoryDialogOpen: boolean;
  motorcycleFilters: MotorcycleFiltersSchema;
};

type Actions = {
  updateMotorcycleId: (id: State["selectedMotorcycleId"]) => void;
  updateInventoryDialogOpen: (is: State["inventoryDialogOpen"]) => void;
  updateMotorcycleFiltersPage: (action: "next" | "prev" | number) => void;
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
    motorcycleFilters: motorcycleFiltersDefaultValues,
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
  }),
  {
    name: "inventory-store",
  },
);

export { useInventoryStore };
