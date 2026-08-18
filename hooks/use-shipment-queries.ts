"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { getShipment, getShipments, updateShipment } from "@/api/shipment";
import type { Shipment, ShipmentStatus, ShipmentUpdate } from "@/types/shipments";
import type { PaginatedResponse } from "@/types";

export const shipmentKeys = {
  all: ["shipments"] as const,
  lists: () => [...shipmentKeys.all, "list"] as const,
  list: (status: ShipmentStatus, q: string) =>
    [...shipmentKeys.lists(), status, q] as const,
  details: () => [...shipmentKeys.all, "detail"] as const,
  detail: (id: string) => [...shipmentKeys.details(), id] as const,
};

export function useShipments(status: ShipmentStatus, q: string) {
  return useInfiniteQuery({
    queryKey: shipmentKeys.list(status, q),
    queryFn: ({ pageParam }) =>
      getShipments({
        status,
        q,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
  });
}

export function useShipment(id: string | null) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: shipmentKeys.detail(id ?? ""),
    queryFn: () => getShipment(id!),
    enabled: Boolean(id),
    placeholderData: () => {
      if (!id) return undefined;
      const lists = queryClient.getQueriesData<
        InfiniteData<PaginatedResponse<Shipment>>
      >({ queryKey: shipmentKeys.lists() });
      for (const [, data] of lists) {
        const match = data?.pages
          .flatMap((page) => page.data)
          .find((shipment) => shipment.id === id);
        if (match) return match;
      }
      return undefined;
    },
  });
}

export function useUpdateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, update }: { id: string; update: ShipmentUpdate }) =>
      updateShipment(id, update),
    onSuccess: (shipment) => {
      queryClient.setQueryData(shipmentKeys.detail(shipment.id), shipment);
      void queryClient.invalidateQueries({ queryKey: shipmentKeys.lists() });
    },
  });
}
