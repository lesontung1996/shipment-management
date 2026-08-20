"use client";

import { useEffect, useMemo, useState } from "react";
import { AssignmentStatusGroup } from "@/components/assignments/assignments-list/assignment-status-group";
import { ShipmentSearch } from "@/components/shipments/shipments-list/shipment-search";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useAssignmentsQuery } from "@/hooks/use-shipment-queries";
import { useAssignmentQueryParams } from "@/hooks/use-shipment-query-params";
import { ASSIGNMENT_STATUSES } from "@/types/shipments";

export function AssignmentListPanel() {
  const { params, setParams } = useAssignmentQueryParams();
  const [search, setSearch] = useState(params.q);
  const debouncedSearch = useDebouncedValue(search.trim(), 300);
  const { data: assignments = [], isPending, isError } = useAssignmentsQuery();

  useEffect(() => {
    setSearch(params.q);
  }, [params.q]);

  useEffect(() => {
    if (debouncedSearch === params.q) return;
    setParams({ q: debouncedSearch });
  }, [debouncedSearch, params.q, setParams]);

  const filtered = useMemo(() => {
    const q = params.q.trim().toLowerCase();
    if (!q) return assignments;
    return assignments.filter((assignment) =>
      assignment.label.toLowerCase().includes(q)
    );
  }, [assignments, params.q]);

  const grouped = useMemo(
    () =>
      ASSIGNMENT_STATUSES.map((status) => ({
        status,
        assignments: filtered.filter((assignment) => assignment.status === status),
      })),
    [filtered]
  );

  return (
    <aside className="flex min-h-0 flex-col border-r bg-background">
      <div className="flex shrink-0 flex-col gap-3 p-3">
        <h1 className="text-base font-semibold tracking-tight">Assignments</h1>
        <ShipmentSearch
          value={search}
          onChange={setSearch}
          placeholder="Search by label"
          aria-label="Search assignments by label"
        />
      </div>
      <Separator />
      <div className="flex min-h-0 flex-1 flex-col overflow-auto">
        {isPending ? (
          <div className="flex flex-col gap-2 px-3 py-2">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
          </div>
        ) : isError ? (
          <p className="px-3 py-2 text-sm text-destructive">
            Could not load assignments.
          </p>
        ) : (
          grouped.map(({ status, assignments: group }) => (
            <AssignmentStatusGroup
              key={status}
              status={status}
              assignments={group}
            />
          ))
        )}
      </div>
    </aside>
  );
}
