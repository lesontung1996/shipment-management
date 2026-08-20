"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  createShipment,
  deleteShipment,
  getAssignments,
  getShipment,
  getShipments,
  updateShipment,
} from "@/api/shipment";
import type { Shipment, ShipmentCreate, ShipmentStatus, ShipmentUpdate } from "@/types/shipments";
import type { PaginatedResponse } from "@/types";

export const shipmentKeys = {
  all: ["shipments"] as const,
  lists: () => [...shipmentKeys.all, "list"] as const,
  list: (status: ShipmentStatus, q: string) =>
    [...shipmentKeys.lists(), status, q] as const,
  byAssignment: (assignmentId: string) =>
    [...shipmentKeys.lists(), "assignment", assignmentId] as const,
  details: () => [...shipmentKeys.all, "detail"] as const,
  detail: (id: string) => [...shipmentKeys.details(), id] as const,
};

export function useShipmentsQuery(status: ShipmentStatus, q: string) {
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

export function useShipmentsByAssignmentQuery(assignmentId: string | null) {
  return useQuery({
    queryKey: shipmentKeys.byAssignment(assignmentId ?? ""),
    queryFn: () =>
      getShipments({
        assignmentId: assignmentId!,
        page: 1,
        perPage: 100,
      }),
    enabled: Boolean(assignmentId),
    select: (response) => response.data,
  });
}

export function useShipmentQuery(id: string | null) {
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
        if (!data || !Array.isArray(data.pages)) continue;
        const match = data.pages
          .flatMap((page) => page.data)
          .find((shipment) => shipment.id === id);
        if (match) return match;
      }

      const byAssignment = queryClient.getQueriesData<
        PaginatedResponse<Shipment>
      >({
        queryKey: [...shipmentKeys.lists(), "assignment"],
      });
      for (const [, data] of byAssignment) {
        if (!data || !Array.isArray(data.data)) continue;
        const match = data.data.find((shipment) => shipment.id === id);
        if (match) return match;
      }

      return undefined;
    },
  });
}

export function useAssignmentsQuery() {
  return useQuery({
    queryKey: ["assignments"],
    queryFn: getAssignments,
  });
}

export function useCreateShipmentQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shipment: ShipmentCreate) => createShipment(shipment),
    onSuccess: (shipment) => {
      queryClient.setQueryData(shipmentKeys.detail(shipment.id), shipment);
      queryClient.invalidateQueries({ queryKey: shipmentKeys.lists() });
    },
  });
}

export function useUpdateShipmentQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, update }: { id: string; update: ShipmentUpdate }) =>
      updateShipment(id, update),
    onSuccess: (shipment) => {
      queryClient.setQueryData(shipmentKeys.detail(shipment.id), shipment);
      queryClient.invalidateQueries({ queryKey: shipmentKeys.lists() });
    },
  });
}

export function useDeleteShipmentQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteShipment(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: shipmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: shipmentKeys.lists() });
    },
  });
}
