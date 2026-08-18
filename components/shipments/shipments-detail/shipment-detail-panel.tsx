"use client";

import { Package } from "lucide-react";
import { ShipmentDetailForm } from "@/components/shipments/shipments-detail/shipment-detail-form";
import { Badge } from "@/components/ui/badge";
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useShipment } from "@/hooks/use-shipment-queries";
import { formatDateTime, formatStatus } from "@/lib/format";
import { shipmentStatusClassName } from "@/lib/shipment-status";
import { cn } from "@/lib/utils";
import { useShipmentUiStore } from "@/stores/shipment-ui-store";

export function ShipmentDetailPanel() {
  const selectedShipmentId = useShipmentUiStore((state) => state.selectedShipmentId);
  const { data: shipment, isPending, isError, isPlaceholderData } = useShipment(
    selectedShipmentId
  );

  if (!selectedShipmentId) {
    return (
      <section className="flex min-h-0 flex-col bg-muted/20">
        <Empty className="h-full border-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Package />
            </EmptyMedia>
            <EmptyTitle>No shipment selected</EmptyTitle>
            <EmptyDescription>
              Choose a shipment from the list to view its details.
            </EmptyDescription>
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
        <Skeleton className="h-40 w-full" />
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
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Client</FieldLabel>
                <p className="text-sm">{shipment.client_name}</p>
              </Field>
              <Field>
                <FieldLabel>Label</FieldLabel>
                <p className="text-sm">{shipment.label}</p>
              </Field>
              <Field>
                <FieldLabel>Status</FieldLabel>
                <Badge
                  variant="secondary"
                  className={cn("w-fit! capitalize", shipmentStatusClassName(shipment.status))}
                >
                  {formatStatus(shipment.status).toLowerCase()}
                </Badge>
              </Field>
              <Field>
                <FieldLabel>Arrival date</FieldLabel>
                <p className="text-sm">{formatDateTime(shipment.arrival_date)}</p>
              </Field>
              <Field>
                <FieldLabel>Warehouse</FieldLabel>
                <p className="text-sm">{shipment.warehouse_id}</p>
              </Field>
              <Field>
                <FieldLabel>Assignment</FieldLabel>
                <p className="text-sm">{shipment.assignment_id ?? "—"}</p>
              </Field>
            </div>
          </FieldGroup>
          <Separator />
          <ShipmentDetailForm key={shipment.id} shipment={shipment} />
        </CardContent>
      </Card>
    </section>
  );
}
