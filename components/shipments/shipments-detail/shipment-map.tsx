"use client";

import dynamic from "next/dynamic";
import type { MapPoint } from "@/components/common/map";
import { Skeleton } from "@/components/ui/skeleton";
import { isValidCoordinate } from "@/lib/utils";

const Map = dynamic(() => import("@/components/common/map"), {
  ssr: false,
  loading: () => <Skeleton className="h-64 w-full rounded-lg" />,
});

type ShipmentMapProps = {
  /** Selected shipment location (always required for centering). */
  lat: number;
  lng: number;
  label?: string;
  shipmentId: string;
  /**
   * Other shipments on the same assignment route.
   * When provided, all valid points are shown and connected by lines.
   */
  routePoints?: MapPoint[];
};

export function ShipmentMap({
  lat,
  lng,
  label,
  shipmentId,
  routePoints,
}: ShipmentMapProps) {
  const points: MapPoint[] =
    routePoints && routePoints.length > 0
      ? routePoints.filter((point) => isValidCoordinate(point.lat, point.lng))
      : isValidCoordinate(lat, lng)
        ? [{ id: shipmentId, lat, lng, label }]
        : [];

  if (points.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border bg-muted/30 text-sm text-muted-foreground">
        Location is unavailable for this shipment.
      </div>
    );
  }

  const hasRoute = Boolean(routePoints && routePoints.length > 1);

  return (
    <Map
      points={points}
      centerId={shipmentId}
      connect={hasRoute}
    />
  );
}
