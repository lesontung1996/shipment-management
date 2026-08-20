"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  applyQueryParamUpdates,
  buildPathWithQuery,
  readQueryParams,
  type InferQueryParams,
  type QueryParamSchema,
} from "@/lib/query-params";

export type SetQueryParamsOptions = {
  /** Defaults to `replace` so filter changes do not clutter history. */
  history?: "push" | "replace";
};

/**
 * Generic hook for typed URL search-param state.
 *
 * Define a schema once (codecs + keys), then reuse or extend it per page:
 *
 * ```ts
 * const shipmentSchema = {
 *   q: stringParam(""),
 *   status: enumParam(SHIPMENT_STATUSES, "OPEN"),
 *   shipmentId: optionalStringParam(),
 * };
 *
 * const assignmentSchema = {
 *   ...shipmentSchema,
 *   assignmentId: optionalStringParam(),
 * };
 * ```
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
