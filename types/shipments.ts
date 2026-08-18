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

export type ShipmentUpdate = Pick<Shipment, "delivery_by_date" | "lat" | "lng">;

export type ListShipmentsParams = {
  status: ShipmentStatus;
  q?: string;
  page: number;
  perPage?: number;
};
