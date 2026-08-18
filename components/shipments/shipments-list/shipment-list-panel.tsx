"use client";

import { useState } from "react";
import { ShipmentSearch } from "@/components/shipments/shipments-list/shipment-search";
import { ShipmentStatusGroup } from "@/components/shipments/shipments-list/shipment-status-group";
import { Separator } from "@/components/ui/separator";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { SHIPMENT_STATUSES } from "@/types/shipments";

export function ShipmentListPanel() {
  const [search, setSearch] = useState("");
  const q = useDebouncedValue(search.trim(), 300);

  return (
    <aside className="flex min-h-0 flex-col border-r bg-background">
      <div className="flex shrink-0 flex-col gap-3 p-3">
        <h1 className="text-base font-semibold tracking-tight">Shipments</h1>
        <ShipmentSearch value={search} onChange={setSearch} />
      </div>
      <Separator />
      <div className="flex min-h-0 flex-1 flex-col">
        {SHIPMENT_STATUSES.map((status) => (
          <ShipmentStatusGroup key={status} status={status} q={q} />
        ))}
      </div>
    </aside>
  );
}
