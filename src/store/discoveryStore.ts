import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DiscoveryState {
  // Per-page found objects
  found: Record<string, boolean>;
  // Track page completion
  pageComplete: Record<string, boolean>;
  // Master unlock (all objects found across all pages)
  totalFound: number;
  totalObjects: number;
  specialEndingUnlocked: boolean;

  markFound: (id: string) => void;
  markPageComplete: (pageId: string) => void;
  isFound: (id: string) => boolean;
  resetAll: () => void;
}

const TOTAL_OBJECTS = 22;

export const useDiscoveryStore = create<DiscoveryState>()(
  persist(
    (set, get) => ({
      found: {},
      pageComplete: {},
      totalFound: 0,
      totalObjects: TOTAL_OBJECTS,
      specialEndingUnlocked: false,

      markFound: (id: string) => {
        const state = get();
        if (state.found[id]) return; // already found
        const newFound = { ...state.found, [id]: true };
        const totalFound = Object.values(newFound).filter(Boolean).length;
        set({
          found: newFound,
          totalFound,
          specialEndingUnlocked: totalFound >= TOTAL_OBJECTS,
        });
      },

      markPageComplete: (pageId: string) => {
        set((s) => ({ pageComplete: { ...s.pageComplete, [pageId]: true } }));
      },

      isFound: (id: string) => Boolean(get().found[id]),

      resetAll: () => set({
        found: {},
        pageComplete: {},
        totalFound: 0,
        specialEndingUnlocked: false,
      }),
    }),
    { name: 'enchanted-forest-shresta' }
  )
);
