"use client";

import { useState } from "react";
import { NewShipmentDialog } from "@/components/shipments/shipments-list/new-shipment-dialog";
import { ShipmentSearch } from "@/components/shipments/shipments-list/shipment-search";
import { ShipmentStatusFilters } from "@/components/shipments/shipments-list/shipment-status-filters";
import { ShipmentStatusGroup } from "@/components/shipments/shipments-list/shipment-status-group";
import { Separator } from "@/components/ui/separator";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { SHIPMENT_STATUSES, type ShipmentStatus } from "@/types/shipments";

export function ShipmentListPanel() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ShipmentStatus>(SHIPMENT_STATUSES[0]);
  const q = useDebouncedValue(search.trim(), 300);

  return (
    <aside className="flex min-h-0 flex-col border-r bg-background">
      <div className="flex shrink-0 flex-col gap-3 p-3">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-base font-semibold tracking-tight">Shipments</h1>
          <NewShipmentDialog />
        </div>
        <ShipmentSearch value={search} onChange={setSearch} />
        <ShipmentStatusFilters value={status} onChange={setStatus} />
      </div>
      <Separator />
      <div className="flex min-h-0 flex-1 flex-col">
        <ShipmentStatusGroup key={status} status={status} q={q} />
      </div>
    </aside>
  );
}
