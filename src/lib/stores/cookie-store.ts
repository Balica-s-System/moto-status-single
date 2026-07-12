import { createStore } from "@/lib/createStore";

type CookieConsent = {
  analytics: boolean;
  marketing: boolean;
};

type CookieStore = {
  consent: CookieConsent | null;
  acceptAll: () => void;
  rejectAll: () => void;
  setConsent: (partial: Partial<CookieConsent>) => void;
};

const useCookieStore = createStore<CookieStore>(
  (set) => ({
    consent: null,
    acceptAll: () =>
      set((state) => {
        state.consent = { analytics: true, marketing: true };
      }),
    rejectAll: () =>
      set((state) => {
        state.consent = { analytics: false, marketing: false };
      }),
    setConsent: (partial) =>
      set((state) => {
        if (state.consent) {
          Object.assign(state.consent, partial);
        }
      }),
  }),
  {
    name: "cookie-consent",
    skipPersist: false,
  },
);

export { useCookieStore, type CookieConsent };
