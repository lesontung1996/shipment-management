import type { ListShipmentsParams } from "@/types/shipments";

export const PAGE_SIZE = 50;

export function buildListUrl({
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

export async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}
