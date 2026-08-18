"use client";

import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Shipment } from "@/types/shipments";

type ShipmentRowProps = {
  shipment: Shipment;
  selected: boolean;
  onSelect: (id: string) => void;
};

export function ShipmentRow({ shipment, selected, onSelect }: ShipmentRowProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(shipment.id)}
      aria-pressed={selected}
      className={cn(
        "flex h-full w-full flex-col justify-center gap-0.5 px-3 text-left transition-colors",
        "hover:bg-muted/70 focus-visible:bg-muted/70 focus-visible:outline-none",
        selected && "bg-muted"
      )}
    >
      <span className="truncate text-sm font-medium">{shipment.client_name}</span>
      <span className="truncate text-xs text-muted-foreground">{shipment.label}</span>
      <span className="text-xs text-muted-foreground">
        <b>Arrival:</b> {formatDate(shipment.arrival_date)}
      </span>
    </button>
  );
}
