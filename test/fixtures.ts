import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createElement } from "react";
import type { Assignment, Shipment, ShipmentStatus } from "@/types/shipments";
import type { ShipmentFormValues } from "@/hooks/use-shipment-form";

export function makeShipment(
  overrides: Partial<Shipment> = {}
): Shipment {
  return {
    id: "shp_test01",
    client_name: "Acme Logistics",
    label: "Dallas inbound",
    status: "OPEN",
    arrival_date: "2026-08-19T15:00:00.000Z",
    delivery_by_date: "2026-08-21T15:00:00.000Z",
    eta: "2026-08-21T15:00:00.000Z",
    warehouse_id: "581",
    assignment_id: null,
    lat: 32.8,
    lng: -96.95,
    ...overrides,
  };
}

export function makeAssignment(
  overrides: Partial<Assignment> = {}
): Assignment {
  return {
    id: "asn_1",
    label: "Route 1",
    status: "OPEN",
    clients: ["Acme Logistics"],
    shipment_count: 1,
    ...overrides,
  };
}

export function validFormValues(
  overrides: Partial<ShipmentFormValues> = {}
): ShipmentFormValues {
  return {
    client_name: "Acme Logistics",
    label: "Dallas inbound",
    arrival_date: "2026-08-19T10:00",
    warehouse_id: "581",
    delivery_by_date: "2026-08-21T10:00",
    lat: "32.8",
    lng: "-96.95",
    status: "OPEN" as ShipmentStatus,
    assignment_id: "",
    ...overrides,
  };
}

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

export function createQueryWrapper(client = createTestQueryClient()) {
  return function QueryWrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client }, children);
  };
}
