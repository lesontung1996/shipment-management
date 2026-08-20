"use client";

import { useQueryParams } from "@/hooks/use-query-params";
import {
  enumParam,
  stringParam,
  optionalStringParam,
  type InferQueryParams,
} from "@/lib/query-params";
import { ASSIGNMENT_STATUSES, SHIPMENT_STATUSES } from "@/types/shipments";

/**
 * Shipment page URL state: `q`, `status`, `shipmentId`.
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

/**
 * Assignment page URL state: `q`, `status`, `assignmentId`, `shipmentId`.
 */
export const assignmentQueryParamSchema = {
  q: stringParam(),
  status: enumParam(ASSIGNMENT_STATUSES, ASSIGNMENT_STATUSES[0]),
  assignmentId: optionalStringParam(),
  shipmentId: optionalStringParam(),
};

export type AssignmentQueryParams = InferQueryParams<typeof assignmentQueryParamSchema>;

export function useAssignmentQueryParams() {
  return useQueryParams(assignmentQueryParamSchema);
}
