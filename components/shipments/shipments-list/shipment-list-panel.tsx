"use client";

import { useEffect, useState } from "react";
import { NewShipmentDialog } from "@/components/shipments/ui/new-shipment-dialog";
import { SearchForm } from "@/components/common/search-form";
import { ShipmentStatusFilters } from "@/components/shipments/shipments-list/shipment-status-filters";
import { ShipmentStatusGroup } from "@/components/shipments/shipments-list/shipment-status-group";
import { Separator } from "@/components/ui/separator";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useShipmentQueryParams } from "@/hooks/use-shipment-query-params";
import type { ShipmentStatus } from "@/types/shipments";

export function ShipmentListPanel() {
  const { params, setParams } = useShipmentQueryParams();
  const [search, setSearch] = useState(params.q);
  const debouncedSearch = useDebouncedValue(search.trim(), 300);

  useEffect(() => {
    setSearch(params.q);
  }, [params.q]);

  useEffect(() => {
    if (debouncedSearch === params.q) return;
    setParams({ q: debouncedSearch });
  }, [debouncedSearch, params.q, setParams]);

  return (
    <aside className="flex min-h-0 flex-col border-r bg-background">
      <div className="flex shrink-0 flex-col gap-3 p-3">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-base font-semibold tracking-tight">Shipments</h1>
          <NewShipmentDialog />
        </div>
        <SearchForm
          value={search}
          onChange={setSearch}
          placeholder="Search by label or client"
          aria-label="Search shipments by label or client name"
        />
        <ShipmentStatusFilters
          value={params.status}
          onChange={(status: ShipmentStatus) => setParams({ status })}
        />
      </div>
      <Separator />
      <div className="flex min-h-0 flex-1 flex-col">
        <ShipmentStatusGroup key={params.status} status={params.status} q={params.q} />
      </div>
    </aside>
  );
}
