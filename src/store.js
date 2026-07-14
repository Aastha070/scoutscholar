import { create } from "zustand";

const initialFormData = {
  degree: "",
  institution: "",
  major: "",
  cgpa: "",
  year_of_graduation: "",
  destination: "",
  target_programs: [],
  target_intake: "",
  test_score: { taken: null, type: "", score: null },
};

export const useStore = create((set) => ({
  formData: initialFormData,
  setFormField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),

  results: null,
  setResults: (results) => set({ results }),

  status: "idle",
  setStatus: (status) => set({ status }),
}));
