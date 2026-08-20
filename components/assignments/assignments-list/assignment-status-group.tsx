"use client";

import { StatusGroupShell } from "@/components/common/status-group-shell";
import { AssignmentRow } from "@/components/assignments/assignments-list/assignment-row";
import { useAssignmentQueryParams } from "@/hooks/use-shipment-query-params";
import { formatStatus } from "@/lib/format";
import type { Assignment, AssignmentStatus } from "@/types/shipments";

type AssignmentStatusGroupProps = {
  status: AssignmentStatus;
  assignments: Assignment[];
  isPending?: boolean;
  isError?: boolean;
  q?: string;
};

export function AssignmentStatusGroup({
  status,
  assignments,
  isPending = false,
  isError = false,
  q = "",
}: AssignmentStatusGroupProps) {
  const { params, setParams } = useAssignmentQueryParams();
  const selectedAssignmentId = params.assignmentId;

  return (
    <StatusGroupShell
      statusLabel={formatStatus(status).toLowerCase()}
      count={isPending ? "…" : assignments.length}
      isPending={isPending}
      isError={isError}
      errorMessage={`Could not load ${formatStatus(status).toLowerCase()} assignments.`}
      isEmpty={assignments.length === 0}
      emptyTitle="No assignments"
      emptyDescription={
        q
          ? "Nothing matches this search in this status."
          : "No assignments in this status."
      }
    >
      <ul className="min-h-0 flex-1 overflow-auto">
        {assignments.map((assignment) => (
          <li key={assignment.id} className="min-h-14">
            <AssignmentRow
              assignment={assignment}
              selected={assignment.id === selectedAssignmentId}
              onSelect={(id) =>
                setParams(
                  { assignmentId: id, shipmentId: null },
                  { history: "push" }
                )
              }
            />
          </li>
        ))}
      </ul>
    </StatusGroupShell>
  );
}
