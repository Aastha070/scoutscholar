import { create } from "zustand";

const initialFormData = {
  degree: "",
  institution: "",
  major: "",
  cgpa: "",
  destination: "",
  target_programs: [],
  target_intake: "",
  test_score: { type: "", score: null, status: "" },
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
