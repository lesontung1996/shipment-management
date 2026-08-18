import type {
  Shipment,
  ShipmentStatus,
  ShipmentUpdate,
} from "@/types/shipments";
import type { PaginatedResponse } from "@/types";

export const PAGE_SIZE = 20;

type ListShipmentsParams = {
  status: ShipmentStatus;
  q?: string;
  page: number;
  perPage?: number;
};

function buildListUrl({
  status,
  q,
  page,
  perPage = PAGE_SIZE,
}: ListShipmentsParams) {
  const params = new URLSearchParams({
    _page: String(page),
    _per_page: String(perPage),
  });

  const trimmed = q?.trim();
  if (trimmed) {
    params.set(
      "_where",
      JSON.stringify({
        status: { eq: status },
        or: [
          { label: { contains: trimmed } },
          { client_name: { contains: trimmed } },
        ],
      })
    );
  } else {
    params.set("status", status);
  }

  return `/api/shipments?${params.toString()}`;
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchShipments(
  params: ListShipmentsParams
): Promise<PaginatedResponse<Shipment>> {
  return parseJson<PaginatedResponse<Shipment>>(
    await fetch(buildListUrl(params))
  );
}

export async function fetchShipment(id: string): Promise<Shipment> {
  return parseJson<Shipment>(await fetch(`/api/shipments/${id}`));
}

export async function patchShipment(
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
