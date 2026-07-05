import { createStore } from "@/lib/createStore";

type State = {
  selectedMotorcycleId: string | null;
};

type Actions = {
  updateSelectedMotorcycleId: (id: State["selectedMotorcycleId"]) => void;
};

type Store = State & Actions;

const useInventoryStore = createStore<Store>(
  (set) => ({
    selectedMotorcycleId: null,
    updateSelectedMotorcycleId: (id) =>
      set((state) => {
        state.selectedMotorcycleId = id;
      }),
  }),
  {
    name: "inventory-store",
  },
);

export { useInventoryStore };
