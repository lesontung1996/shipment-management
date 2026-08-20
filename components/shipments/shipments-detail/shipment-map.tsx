"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { isValidCoordinate } from "@/lib/utils";

const Map = dynamic(() => import("@/components/common/map"), {
  ssr: false,
  loading: () => <Skeleton className="h-64 w-full rounded-lg" />,
});

type ShipmentMapProps = {
  lat: number;
  lng: number;
  label?: string;
};

export function ShipmentMap({ lat, lng, label }: ShipmentMapProps) {
  if (!isValidCoordinate(lat, lng)) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border bg-muted/30 text-sm text-muted-foreground">
        Location is unavailable for this shipment.
      </div>
    );
  }

  return <Map lat={lat} lng={lng} label={label} />;
}
