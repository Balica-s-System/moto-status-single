import { createStore } from "@/lib/createStore";

type State = {
  editingSection: "profile" | "password" | "image" | null;
  imagePreview: string | null;
};

type Actions = {
  setEditingSection: (section: State["editingSection"]) => void;
  setImagePreview: (preview: State["imagePreview"]) => void;
};

type Store = State & Actions;

const useProfileStore = createStore<Store>(
  (set) => ({
    editingSection: null,
    setEditingSection: (section) =>
      set((state) => {
        state.editingSection = section;
      }),
    imagePreview: null,
    setImagePreview: (preview) =>
      set((state) => {
        state.imagePreview = preview;
      }),
  }),
  { name: "profile-store", skipPersist: true },
);

export { useProfileStore };
