"use client";

import { useQueryParams } from "@/hooks/use-query-params";
import {
  enumParam,
  stringParam,
  optionalStringParam,
  type InferQueryParams,
} from "@/lib/query-params";
import { SHIPMENT_STATUSES } from "@/types/shipments";

/**
 * Shipment page URL state: `q`, `status`, `shipmentId`.
 * Extend this schema for other pages (e.g. add `assignmentId`).
 */
export const shipmentQueryParamSchema = {
  q: stringParam(),
  status: enumParam(SHIPMENT_STATUSES, SHIPMENT_STATUSES[0]),
  shipmentId: optionalStringParam(),
};

export type ShipmentQueryParams = InferQueryParams<typeof shipmentQueryParamSchema>;

export function useShipmentQueryParams() {
  return useQueryParams(shipmentQueryParamSchema);
}
