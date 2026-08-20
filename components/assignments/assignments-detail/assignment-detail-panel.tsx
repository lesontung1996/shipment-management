"use client";

import { Route } from "lucide-react";
import { ShipmentRow } from "@/components/shipments/shipments-list/shipment-row";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAssignmentsQuery,
  useShipmentsByAssignmentQuery,
} from "@/hooks/use-shipment-queries";
import { useAssignmentQueryParams } from "@/hooks/use-query-params";
import { formatStatus } from "@/lib/format";

export function AssignmentDetailPanel() {
  const { params, setParams } = useAssignmentQueryParams();
  const assignmentId = params.assignmentId;
  const selectedShipmentId = params.shipmentId;

  const { data: assignments = [], isPending: isAssignmentsPending } =
    useAssignmentsQuery();
  const assignment = assignments.find((item) => item.id === assignmentId);

  const {
    data: shipments = [],
    isPending: isShipmentsPending,
    isError: isShipmentsError,
  } = useShipmentsByAssignmentQuery(assignmentId);

  if (!assignmentId) {
    return (
      <section className="flex min-h-0 flex-col border-r bg-background">
        <Empty className="h-full border-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Route />
            </EmptyMedia>
            <EmptyTitle>No assignment selected</EmptyTitle>
            <EmptyDescription>
              Choose an assignment from the list to view its details.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </section>
    );
  }

  if (isAssignmentsPending && !assignment) {
    return (
      <section className="flex min-h-0 flex-col gap-4 border-r p-4">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-24 w-full" />
      </section>
    );
  }

  if (!assignment) {
    return (
      <section className="flex min-h-0 items-center justify-center border-r p-6">
        <p className="text-sm text-destructive">Could not find this assignment.</p>
      </section>
    );
  }

  return (
    <section className="flex min-h-0 flex-col border-r bg-background">
      <div className="flex shrink-0 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold tracking-tight">
              {assignment.label}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">{assignment.id}</p>
          </div>
          <Badge variant="outline">{formatStatus(assignment.status)}</Badge>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Shipments</dt>
            <dd className="font-medium">{assignment.shipment_count}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-muted-foreground">Clients</dt>
            <dd className="font-medium">
              {assignment.clients.length > 0
                ? assignment.clients.join(", ")
                : "—"}
            </dd>
          </div>
        </dl>
      </div>
      <Separator />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center gap-2 px-3 py-2">
          <span className="text-sm font-medium">Shipments</span>
          <Badge variant="secondary">
            {isShipmentsPending ? "…" : shipments.length}
          </Badge>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          {isShipmentsPending ? (
            <div className="flex flex-col gap-2 px-3 py-2">
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} className="h-14 w-full" />
              ))}
            </div>
          ) : isShipmentsError ? (
            <p className="px-3 py-2 text-sm text-destructive">
              Could not load shipments for this assignment.
            </p>
          ) : shipments.length === 0 ? (
            <Empty className="border-0 py-4">
              <EmptyHeader>
                <EmptyTitle>No shipments</EmptyTitle>
                <EmptyDescription>
                  This assignment has no shipments yet.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="flex flex-col">
              {shipments.map((shipment) => (
                <li key={shipment.id} className="h-16">
                  <ShipmentRow
                    shipment={shipment}
                    selected={shipment.id === selectedShipmentId}
                    onSelect={(id) =>
                      setParams({ shipmentId: id }, { history: "push" })
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
