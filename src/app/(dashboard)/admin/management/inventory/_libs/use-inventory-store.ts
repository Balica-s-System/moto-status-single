import { createStore } from "@/lib/createStore";

type State = {
  motorcycleId: string | null;
  inventoryDialogOpen: boolean;
};

type Actions = {
  updateMotorcycleId: (id: State["motorcycleId"]) => void;
  updateInventoryDialogOpen: (is: State["inventoryDialogOpen"]) => void;
};

type Store = State & Actions;

const useInventoryStore = createStore<Store>(
  (set) => ({
    motorcycleId: null,
    updateMotorcycleId: (id) =>
      set((state) => {
        state.motorcycleId = id;
      }),
    inventoryDialogOpen: false,
    updateInventoryDialogOpen: (is) =>
      set((state) => {
        state.inventoryDialogOpen = is;
      }),
  }),
  {
    name: "inventory-store",
  },
);

export { useInventoryStore };
