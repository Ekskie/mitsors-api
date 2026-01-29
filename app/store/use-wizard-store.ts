import { create } from 'zustand';

// B-3 Alignment: These keys must match your Drizzle schema in users.ts
interface WizardData {
  firstName: string;
  lastName: string;
  region: string;
  city: string;
  userRoles: string[];
}

interface WizardState {
  step: number;
  data: WizardData;
  setStep: (step: number) => void;
  updateData: (updates: Partial<WizardData>) => void;
  completeWizard: () => void;
  reset: () => void;
}

// Remove 'persist' wrapper to stop redundant saving
export const useWizardStore = create<WizardState>((set, get) => ({
  step: 1,
  data: {
    firstName: '',
    lastName: '',
    region: '',
    city: '',
    userRoles: [],
  },

  setStep: (step) => set({ step }),

  updateData: (updates) =>
    set((state) => ({
      data: { ...state.data, ...updates },
    })),

  completeWizard: () => {
    const { data } = get();
    // This is the ONLY persistence needed for B-3 Sync
    localStorage.setItem('mitsors-wizard-data', JSON.stringify(data));
  },

  reset: () =>
    set({
      step: 1,
      data: { firstName: '', lastName: '', region: '', city: '', userRoles: [] },
    }),
}));