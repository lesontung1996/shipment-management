"use client";

import { ShipmentDetailPanel } from "@/components/shipments/shipments-detail/shipment-detail-panel";
import { ShipmentListPanel } from "@/components/shipments/shipments-list/shipment-list-panel";

export function ShipmentManagementPage() {
  return (
    <div className="grid h-full grid-cols-1 grid-rows-2 overflow-hidden md:grid-cols-[minmax(280px,380px)_1fr] md:grid-rows-1">
      <ShipmentListPanel />
      <ShipmentDetailPanel />
    </div>
  );
}
