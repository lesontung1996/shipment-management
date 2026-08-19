import { create } from "zustand";

type ShipmentState = {
  selectedShipmentId: string | null;
  setSelectedShipmentId: (id: string | null) => void;
};

export const useShipmentStore = create<ShipmentState>((set) => ({
  selectedShipmentId: null,
  setSelectedShipmentId: (id) => set({ selectedShipmentId: id }),
}));
