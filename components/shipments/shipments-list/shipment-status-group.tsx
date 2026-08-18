"use client";

import { useEffect, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { ShipmentRow } from "@/components/shipments/shipments-list/shipment-row";
import { useShipments } from "@/hooks/use-shipment-queries";
import { formatStatus } from "@/lib/format";
import type { ShipmentStatus } from "@/types/shipments";
import { useShipmentUiStore } from "@/stores/shipment-ui-store";

const ROW_HEIGHT = 64;

type ShipmentStatusGroupProps = {
  status: ShipmentStatus;
  q: string;
};

export function ShipmentStatusGroup({ status, q }: ShipmentStatusGroupProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const selectedShipmentId = useShipmentUiStore((state) => state.selectedShipmentId);
  const setSelectedShipmentId = useShipmentUiStore(
    (state) => state.setSelectedShipmentId
  );

  const {
    data,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useShipments(status, q);

  const shipments = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );
  const total = data?.pages[0]?.items ?? 0;

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: shipments.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const lastItem = virtualItems[virtualItems.length - 1];

  useEffect(() => {
    if (lastItem == null) return;
    if (
      lastItem.index >= shipments.length - 5 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      void fetchNextPage();
    }
  }, [
    lastItem,
    shipments.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  return (
    <Collapsible
      defaultOpen
      className="group flex min-h-0 flex-col overflow-hidden border-b data-open:min-h-35 data-open:flex-1"
    >
      <CollapsibleTrigger className="flex w-full shrink-0 items-center gap-2 px-3 py-2 text-left hover:bg-muted/50">
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-data-open:rotate-180" />
        <span className="text-sm font-medium">{formatStatus(status)}</span>
        <Badge variant="secondary">{isPending ? "…" : total}</Badge>
      </CollapsibleTrigger>
      <div className="hidden min-h-0 flex-1 flex-col overflow-hidden group-data-open:flex">
        {isPending ? (
          <div className="flex flex-col gap-2 px-3 py-2">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
          </div>
        ) : isError ? (
          <p className="px-3 py-2 text-sm text-destructive">
            Could not load {formatStatus(status).toLowerCase()} shipments.
          </p>
        ) : shipments.length === 0 ? (
          <Empty className="border-0 py-4">
            <EmptyHeader>
              <EmptyTitle>No shipments</EmptyTitle>
              <EmptyDescription>
                {q
                  ? "Nothing matches this search in this status."
                  : "No shipments in this status."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div ref={parentRef} className="min-h-0 flex-1 overflow-auto">
            <div
              className="relative w-full"
              style={{ height: virtualizer.getTotalSize() }}
            >
              {virtualItems.map((item) => {
                const shipment = shipments[item.index];
                if (!shipment) return null;
                return (
                  <div
                    key={shipment.id}
                    className="absolute top-0 left-0 w-full"
                    style={{
                      height: item.size,
                      transform: `translateY(${item.start}px)`,
                    }}
                  >
                    <ShipmentRow
                      shipment={shipment}
                      selected={shipment.id === selectedShipmentId}
                      onSelect={setSelectedShipmentId}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Collapsible>
  );
}
