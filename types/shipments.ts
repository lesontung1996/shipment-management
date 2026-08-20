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

export type ListShipmentsParams = {
  status?: ShipmentStatus;
  assignmentId?: string;
  q?: string;
  page: number;
  perPage?: number;
};
