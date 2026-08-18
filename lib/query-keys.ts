import type { ShipmentStatus } from "@/types/shipments";

export const shipmentKeys = {
  all: ["shipments"] as const,
  lists: () => [...shipmentKeys.all, "list"] as const,
  list: (status: ShipmentStatus, q: string) =>
    [...shipmentKeys.lists(), status, q] as const,
  details: () => [...shipmentKeys.all, "detail"] as const,
  detail: (id: string) => [...shipmentKeys.details(), id] as const,
};
