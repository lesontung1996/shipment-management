"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { fetchShipment, fetchShipments, PAGE_SIZE, patchShipment } from "@/lib/api";
import { shipmentKeys } from "@/lib/query-keys";
import type { Shipment, ShipmentStatus, ShipmentUpdate } from "@/types/shipments";
import type { PaginatedResponse } from "@/types";

export function useShipments(status: ShipmentStatus, q: string) {
  return useInfiniteQuery({
    queryKey: shipmentKeys.list(status, q),
    queryFn: ({ pageParam }) =>
      fetchShipments({
        status,
        q,
        page: pageParam,
        perPage: PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
  });
}

export function useShipment(id: string | null) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: shipmentKeys.detail(id ?? ""),
    queryFn: () => fetchShipment(id!),
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
      patchShipment(id, update),
    onSuccess: (shipment) => {
      queryClient.setQueryData(shipmentKeys.detail(shipment.id), shipment);
      void queryClient.invalidateQueries({ queryKey: shipmentKeys.lists() });
    },
  });
}
