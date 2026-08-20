"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  applyQueryParamUpdates,
  buildPathWithQuery,
  enumParam,
  optionalStringParam,
  readQueryParams,
  stringParam,
  type InferQueryParams,
  type QueryParamSchema,
} from "@/lib/query-params";
import { ASSIGNMENT_STATUSES } from "@/types/assignments";
import { SHIPMENT_STATUSES } from "@/types/shipments";

export type SetQueryParamsOptions = {
  /** Defaults to `replace` so filter changes do not clutter history. */
  history?: "push" | "replace";
};

/**
 * Generic hook for typed URL search-param state.
 */
export function useQueryParams<T extends QueryParamSchema>(schema: T) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const params = useMemo(
    () => readQueryParams(searchParams, schema),
    [searchParams, schema]
  );

  const setParams = useCallback(
    (
      updates: Partial<InferQueryParams<T>>,
      options?: SetQueryParamsOptions
    ) => {
      const next = applyQueryParamUpdates(searchParams, schema, updates);
      const href = buildPathWithQuery(pathname, next);
      const navigate = options?.history === "push" ? router.push : router.replace;
      navigate(href, { scroll: false });
    },
    [pathname, router, schema, searchParams]
  );

  return { params, setParams };
}

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
