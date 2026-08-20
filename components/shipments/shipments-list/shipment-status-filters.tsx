"use client";

import { StatusFilters } from "@/components/common/status-filters";
import { shipmentStatusClassName } from "@/lib/shipment-status";
import { SHIPMENT_STATUSES, type ShipmentStatus } from "@/types/shipments";

type ShipmentStatusFiltersProps = {
  value: ShipmentStatus;
  onChange: (status: ShipmentStatus) => void;
};

export function ShipmentStatusFilters({
  value,
  onChange,
}: ShipmentStatusFiltersProps) {
  return (
    <StatusFilters
      statuses={SHIPMENT_STATUSES}
      value={value}
      onChange={onChange}
      aria-label="Filter shipments by status"
      statusClassName={shipmentStatusClassName}
    />
  );
}
