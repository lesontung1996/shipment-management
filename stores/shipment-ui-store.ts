import { create } from "zustand";

type ShipmentUiState = {
  selectedShipmentId: string | null;
  setSelectedShipmentId: (id: string | null) => void;
};

export const useShipmentUiStore = create<ShipmentUiState>((set) => ({
  selectedShipmentId: null,
  setSelectedShipmentId: (id) => set({ selectedShipmentId: id }),
}));
