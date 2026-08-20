"use client";

import { useEffect, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { StatusGroupShell } from "@/components/common/status-group-shell";
import { ShipmentRow } from "@/components/shipments/shipments-list/shipment-row";
import { useShipmentsQuery } from "@/hooks/use-shipment-queries";
import { formatStatus } from "@/lib/format";
import { shipmentStatusClassName } from "@/lib/shipment-status";
import { useShipmentQueryParams } from "@/hooks/use-query-params";
import type { ShipmentStatus } from "@/types/shipments";

const ROW_HEIGHT = 64;

type ShipmentStatusGroupProps = {
  status: ShipmentStatus;
  q: string;
};

export function ShipmentStatusGroup({ status, q }: ShipmentStatusGroupProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const { params, setParams } = useShipmentQueryParams();
  const selectedShipmentId = params.shipmentId;

  const {
    data,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useShipmentsQuery(status, q);

  const shipments = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );
  const total = data?.pages[0]?.items ?? 0;

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
    <StatusGroupShell
      statusLabel={formatStatus(status).toLowerCase()}
      count={isPending ? "…" : total}
      badgeClassName={shipmentStatusClassName(status)}
      isPending={isPending}
      isError={isError}
      errorMessage={`Could not load ${formatStatus(status).toLowerCase()} shipments.`}
      isEmpty={shipments.length === 0}
      emptyTitle="No shipments"
      emptyDescription={
        q
          ? "Nothing matches this search in this status."
          : "No shipments in this status."
      }
    >
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
                  onSelect={(id) =>
                    setParams({ shipmentId: id }, { history: "push" })
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </StatusGroupShell>
  );
}
