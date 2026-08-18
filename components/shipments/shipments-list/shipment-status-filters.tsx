"use client";

import { Button } from "@/components/ui/button";
import { formatStatus } from "@/lib/format";
import { shipmentStatusClassName } from "@/lib/shipment-status";
import { cn } from "@/lib/utils";
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
    <div
      role="radiogroup"
      aria-label="Filter shipments by status"
      className="grid grid-cols-3 gap-1.5"
    >
      {SHIPMENT_STATUSES.map((status) => {
        const selected = status === value;
        return (
          <Button
            key={status}
            type="button"
            size="sm"
            variant="outline"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(status)}
            className={cn(
              "px-1.5 text-[0.7rem] capitalize",
              shipmentStatusClassName(status, selected ? "solid" : "outline")
            )}
          >
            {formatStatus(status).toLowerCase()}
          </Button>
        );
      })}
    </div>
  );
}
