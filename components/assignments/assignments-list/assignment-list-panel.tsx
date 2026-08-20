"use client";

import { useEffect, useMemo, useState } from "react";
import { AssignmentStatusFilters } from "@/components/assignments/assignments-list/assignment-status-filters";
import { AssignmentStatusGroup } from "@/components/assignments/assignments-list/assignment-status-group";
import { SearchForm } from "@/components/common/search-form";
import { Separator } from "@/components/ui/separator";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useAssignmentsQuery } from "@/hooks/use-shipment-queries";
import { useAssignmentQueryParams } from "@/hooks/use-query-params";
import type { AssignmentStatus } from "@/types/assignments";

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
    return assignments.filter((assignment) => {
      if (assignment.status !== params.status) return false;
      if (!q) return true;
      return assignment.label.toLowerCase().includes(q);
    });
  }, [assignments, params.q, params.status]);

  return (
    <aside className="flex min-h-0 flex-col border-r bg-background">
      <div className="flex shrink-0 flex-col gap-3 p-3">
        <h1 className="text-base font-semibold tracking-tight">Assignments</h1>
        <SearchForm
          value={search}
          onChange={setSearch}
          placeholder="Search by label"
          aria-label="Search assignments by label"
        />
        <AssignmentStatusFilters
          value={params.status}
          onChange={(status: AssignmentStatus) => setParams({ status })}
        />
      </div>
      <Separator />
      <div className="flex min-h-0 flex-1 flex-col">
        <AssignmentStatusGroup
          key={params.status}
          status={params.status}
          assignments={filtered}
          isPending={isPending}
          isError={isError}
          q={params.q}
        />
      </div>
    </aside>
  );
}
