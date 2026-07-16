import { createStore } from "@/lib/createStore";

type State = {
  searchTerm: string;
  selectedClientId: string | null;
};

type Actions = {
  updateSearchTerm: (term: string) => void;
  updateSelectedClientId: (id: string | null) => void;
};

type Store = State & Actions;

const useCpfSearchStore = createStore<Store>(
  (set) => ({
    searchTerm: "",
    selectedClientId: null,
    updateSearchTerm: (term) =>
      set((state) => {
        state.searchTerm = term;
      }),
    updateSelectedClientId: (id) =>
      set((state) => {
        state.selectedClientId = id;
      }),
  }),
  { name: "cpf-search-store", skipPersist: true },
);

export { useCpfSearchStore };
