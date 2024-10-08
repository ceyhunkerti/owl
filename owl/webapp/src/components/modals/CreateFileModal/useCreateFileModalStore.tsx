import { FileType } from "@ts/enums";
import { create } from "zustand";

interface ICreateFileModalState {
  open: boolean;
  title?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  tabId?: string;
  fileType: FileType | null;
  onSave: (name: string) => void;
  showModal: (
    options: Omit<
      ICreateFileModalState,
      "showModal" | "open" | "reset" | "destroy" | "closeModal"
    >
  ) => void;
  closeModal: () => void;
  reset: () => void;
  destroy: () => void;
}

export const useCreateFileModalStore = create<ICreateFileModalState>(
  (set, get) => ({
    open: false,
    title: "Create File",
    size: "md",
    tabId: undefined,
    fileType: null,
    onSave: (name: string) => {
      throw new Error("Not Implemented");
    },
    showModal: (options) => set({ ...options, open: true }),
    closeModal: () => set({ open: false }),
    reset: () => set({ open: false, title: "Create File" }),
    destroy: () => {
      const state = get();
      state.closeModal();
      state.reset();
    },
  })
);
