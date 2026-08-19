import type { ShipmentStatus } from "@/types/shipments";

export const shipmentStatusColorClass = {
  OPEN: {
    solid:
      "border-transparent bg-zinc-200 text-zinc-800",
    outline:
      "border-zinc-300 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-800",
  },
  IN_TRANSIT: {
    solid:
      "border-transparent bg-blue-200 text-blue-900",
    outline:
      "border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800",
  },
  DELIVERED: {
    solid:
      "border-transparent bg-green-200 text-green-900",
    outline:
      "border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800",
  },
} as const satisfies Record<
  ShipmentStatus,
  { solid: string; outline: string }
>;

export function shipmentStatusClassName(
  status: ShipmentStatus,
  appearance: "solid" | "outline" = "solid"
) {
  return shipmentStatusColorClass[status][appearance];
}

const TRANSITIONS: Record<ShipmentStatus, readonly ShipmentStatus[]> = {
  OPEN: ["IN_TRANSIT"],
  IN_TRANSIT: ["OPEN", "DELIVERED"],
  DELIVERED: [],
};

export function getStatusOptions(current: ShipmentStatus): ShipmentStatus[] {
  return [current, ...TRANSITIONS[current]];
}
