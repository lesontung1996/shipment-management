"use client";

import { Badge } from "@/components/ui/badge";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { AssignmentRow } from "@/components/assignments/assignments-list/assignment-row";
import { useAssignmentQueryParams } from "@/hooks/use-shipment-query-params";
import { formatStatus } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Assignment, AssignmentStatus } from "@/types/shipments";

type AssignmentStatusGroupProps = {
  status: AssignmentStatus;
  assignments: Assignment[];
};

export function AssignmentStatusGroup({
  status,
  assignments,
}: AssignmentStatusGroupProps) {
  const { params, setParams } = useAssignmentQueryParams();
  const selectedAssignmentId = params.assignmentId;

  return (
    <div className="flex min-h-0 flex-col overflow-hidden">
      <div className="flex w-full shrink-0 items-center gap-2 px-3 py-2">
        <span className="text-sm font-medium capitalize">
          {formatStatus(status).toLowerCase()}
        </span>
        <Badge variant="secondary">{assignments.length}</Badge>
      </div>
      {assignments.length === 0 ? (
        <Empty className="border-0 py-4">
          <EmptyHeader>
            <EmptyTitle>No assignments</EmptyTitle>
            <EmptyDescription>
              No {formatStatus(status).toLowerCase()} assignments match this search.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="flex flex-col">
          {assignments.map((assignment) => (
            <li key={assignment.id} className={cn("min-h-14")}>
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
      )}
    </div>
  );
}
