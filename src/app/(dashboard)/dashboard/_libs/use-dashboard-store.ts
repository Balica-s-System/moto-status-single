import { createStore } from "@/lib/createStore";

type State = {};

type Actions = {};

type Store = State & Actions;

const useDashboardStore = createStore<Store>(
  (set) => ({}),
  {
    name: "dashboard-store",
    skipPersist: true,
  },
);

export { useDashboardStore };
