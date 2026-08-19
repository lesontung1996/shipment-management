export const SHIPMENT_STATUSES = ["OPEN", "IN_TRANSIT", "DELIVERED"] as const;

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

export type Shipment = {
  id: string;
  client_name: string;
  label: string;
  status: ShipmentStatus;
  arrival_date: string;
  delivery_by_date: string;
  eta: string;
  warehouse_id: string;
  assignment_id?: string | null;
  lat: number;
  lng: number;
};

export type ShipmentUpdate = Partial<
  Pick<Shipment, "delivery_by_date" | "lat" | "lng" | "status" | "assignment_id">
>;

export type ShipmentCreate = Omit<Shipment, "id"> & { id?: string };

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  OPEN: "Open",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
};

export type Assignment = {
  id: string;
  label: string;
  status: string;
  clients: string[];
  shipment_count: number;
};

/** Returns all statuses available in the dropdown for a given current status,
 *  including the current one so it is always pre-selected. */
export function getStatusOptions(current: ShipmentStatus): ShipmentStatus[] {
  switch (current) {
    case "OPEN":
      return ["OPEN", "IN_TRANSIT"];
    case "IN_TRANSIT":
      return ["OPEN", "IN_TRANSIT", "DELIVERED"];
    case "DELIVERED":
      return ["IN_TRANSIT", "DELIVERED"];
  }
}

export type ListShipmentsParams = {
  status: ShipmentStatus;
  q?: string;
  page: number;
  perPage?: number;
};
