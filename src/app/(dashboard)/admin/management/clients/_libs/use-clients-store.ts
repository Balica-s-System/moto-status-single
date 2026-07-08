import { createStore } from "@/lib/createStore";

type State = {
  selectedClientId: string | null;
  clientDialogOpen: boolean;
  clientPreviewOpen: boolean;
};

type Actions = {
  updateClientId: (id: State["selectedClientId"]) => void;
  updateClientDialogOpen: (is: State["clientDialogOpen"]) => void;
  updateInventoryPreviewOpen: (is: State["clientPreviewOpen"]) => void;
};

type Store = State & Actions;

const useClientStore = createStore<Store>(
  (set) => ({
    selectedClientId: null,
    updateClientId: (is) => set((state) => (state.selectedClientId = is)),
    clientDialogOpen: false,
    updateClientDialogOpen: (is) =>
      set((state) => (state.clientDialogOpen = is)),
    clientPreviewOpen: false,
    updateInventoryPreviewOpen: (is) =>
      set((state) => {
        state.clientPreviewOpen = is;
      }),
  }),
  {
    name: "clients-store",
  },
);

export { useClientStore };
