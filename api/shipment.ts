import type {
  Assignment,
  Shipment,
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

export async function getAssignments(): Promise<Assignment[]> {
  const res = await fetch("/api/assignments");
  return parseJson<Assignment[]>(res);
}