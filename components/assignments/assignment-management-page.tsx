"use client";

import { AssignmentDetailPanel } from "@/components/assignments/assignments-detail/assignment-detail-panel";
import { AssignmentListPanel } from "@/components/assignments/assignments-list/assignment-list-panel";
import { ShipmentDetailView } from "@/components/shipments/shipments-detail/shipment-detail-view";
import { useAssignmentQueryParams } from "@/hooks/use-query-params";
import { useShipmentsByAssignmentQuery } from "@/hooks/use-shipment-queries";

export function AssignmentManagementPage() {
  const { params } = useAssignmentQueryParams();
  const { data: assignmentShipments = [] } = useShipmentsByAssignmentQuery(
    params.assignmentId
  );

  const routePoints = assignmentShipments.map((shipment) => ({
    id: shipment.id,
    lat: shipment.lat,
    lng: shipment.lng,
    label: shipment.label,
  }));

  return (
    <div className="grid h-full grid-cols-1 grid-rows-3 overflow-hidden md:grid-cols-[minmax(240px,320px)_minmax(280px,380px)_1fr] md:grid-rows-1">
      <AssignmentListPanel />
      <AssignmentDetailPanel />
      <ShipmentDetailView
        shipmentId={params.shipmentId}
        routePoints={routePoints}
        emptyDescription="Choose a shipment from the assignment to view its details."
      />
    </div>
  );
}
