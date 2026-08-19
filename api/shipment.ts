import type {
  Assignment,
  Shipment,
  ShipmentCreate,
  ShipmentUpdate,
  ListShipmentsParams,
} from "@/types/shipments";
import type { PaginatedResponse } from "@/types";
import { parseJson, buildListUrl } from "@/lib/api";

export async function getShipments(
  params: ListShipmentsParams
): Promise<PaginatedResponse<Shipment>> {
  return parseJson<PaginatedResponse<Shipment>>(
    await fetch(buildListUrl(params))
  );
}

export async function getShipment(id: string): Promise<Shipment> {
  return parseJson<Shipment>(await fetch(`/api/shipments/${id}`));
}

export async function updateShipment(
  id: string,
  update: ShipmentUpdate
): Promise<Shipment> {
  return parseJson<Shipment>(
    await fetch(`/api/shipments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    })
  );
}

export async function createShipment(shipment: ShipmentCreate): Promise<Shipment> {
  return parseJson<Shipment>(
    await fetch("/api/shipments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(shipment),
    })
  );
}

export async function deleteShipment(id: string): Promise<void> {
  const response = await fetch(`/api/shipments/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
}

export async function getAssignments(): Promise<Assignment[]> {
  const res = await fetch("/api/assignments");
  return parseJson<Assignment[]>(res);
}