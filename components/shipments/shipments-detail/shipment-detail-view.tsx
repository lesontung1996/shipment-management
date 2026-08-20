"use client";

import { Package } from "lucide-react";
import type { MapPoint } from "@/components/common/map";
import { ShipmentForm } from "@/components/shipments/shipments-detail/shipment-form";
import { ShipmentMap } from "@/components/shipments/shipments-detail/shipment-map";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useShipmentQuery } from "@/hooks/use-shipment-queries";

type ShipmentDetailViewProps = {
  shipmentId: string | null;
  emptyDescription?: string;
  /** Assignment route points for the multi-shipment map view. */
  routePoints?: MapPoint[];
};

export function ShipmentDetailView({
  shipmentId,
  emptyDescription = "Choose a shipment from the list to view its details.",
  routePoints,
}: ShipmentDetailViewProps) {
  const { data: shipment, isPending, isError, isPlaceholderData } =
    useShipmentQuery(shipmentId);

  if (!shipmentId) {
    return (
      <section className="flex min-h-0 flex-col bg-muted/20">
        <Empty className="h-full border-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Package />
            </EmptyMedia>
            <EmptyTitle>No shipment selected</EmptyTitle>
            <EmptyDescription>{emptyDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </section>
    );
  }

  if (isPending && !shipment) {
    return (
      <section className="flex min-h-0 flex-col gap-4 p-6">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-24 w-full" />
      </section>
    );
  }

  if (isError && !shipment) {
    return (
      <section className="flex min-h-0 items-center justify-center p-6">
        <p className="text-sm text-destructive">Could not load this shipment.</p>
      </section>
    );
  }

  if (!shipment) return null;

  return (
    <section className="min-h-0 overflow-auto bg-muted/20 p-4 md:p-6">
      <Card className={isPlaceholderData ? "opacity-80" : undefined}>
        <CardHeader className="border-b">
          <CardTitle>{shipment.client_name}</CardTitle>
          <CardDescription>{shipment.label}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <ShipmentMap
            shipmentId={shipment.id}
            lat={shipment.lat}
            lng={shipment.lng}
            label={shipment.label}
            routePoints={routePoints}
          />
          <ShipmentForm key={shipment.id} shipment={shipment} />
        </CardContent>
      </Card>
    </section>
  );
}
