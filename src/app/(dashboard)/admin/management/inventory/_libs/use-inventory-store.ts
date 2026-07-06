import { createStore } from "@/lib/createStore";

type State = {
  selectedMotorcycleId: string | null;
  inventoryDialogOpen: boolean;
};

type Actions = {
  updateMotorcycleId: (id: State["selectedMotorcycleId"]) => void;
  updateInventoryDialogOpen: (is: State["inventoryDialogOpen"]) => void;
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
  }),
  {
    name: "inventory-store",
  },
);

export { useInventoryStore };
