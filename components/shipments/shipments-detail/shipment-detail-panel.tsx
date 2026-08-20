"use client";

import { ShipmentDetailView } from "@/components/shipments/shipments-detail/shipment-detail-view";
import { useShipmentQueryParams } from "@/hooks/use-query-params";

export function ShipmentDetailPanel() {
  const { params } = useShipmentQueryParams();

  return <ShipmentDetailView shipmentId={params.shipmentId} />;
}
