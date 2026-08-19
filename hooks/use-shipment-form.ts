"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { fromDatetimeLocal, toDatetimeLocal } from "@/lib/format";
import { getStatusOptions } from "@/lib/shipment-status";
import { isValidLatitude, isValidLongitude } from "@/lib/utils";
import {
  SHIPMENT_STATUSES,
  type Shipment,
  type ShipmentStatus,
  type ShipmentUpdate,
} from "@/types/shipments";
import { useAssignmentsQuery } from "@/hooks/use-shipment-queries";

export const shipmentFormSchema = z
  .object({
    client_name: z
      .string()
      .refine((value) => value.trim().length > 0, "Client name is required."),
    label: z
      .string()
      .refine((value) => value.trim().length > 0, "Label is required."),
    arrival_date: z
      .string()
      .refine(
        (value) => Boolean(value) && !Number.isNaN(new Date(value).getTime()),
        "Arrival date is required."
      ),
    warehouse_id: z
      .string()
      .refine((value) => value.trim().length > 0, "Warehouse is required."),
    delivery_by_date: z
      .string()
      .refine(
        (value) => Boolean(value) && !Number.isNaN(new Date(value).getTime()),
        "Delivery-by date is required."
      ),
    lat: z
      .string()
      .refine(
        (value) => value.trim() !== "" && isValidLatitude(Number(value)),
        "Latitude must be a number between -90 and 90."
      ),
    lng: z
      .string()
      .refine(
        (value) => value.trim() !== "" && isValidLongitude(Number(value)),
        "Longitude must be a number between -180 and 180."
      ),
    status: z.enum(SHIPMENT_STATUSES),
    assignment_id: z.string(),
  })
  .refine(
    (data) => data.status !== "IN_TRANSIT" || Boolean(data.assignment_id),
    {
      message: "An assignment is required to move to In Transit.",
      path: ["assignment_id"],
    }
  );

export type ShipmentFormValues = z.infer<typeof shipmentFormSchema>;

export type ShipmentFormPayload = Omit<Shipment, "id" | "eta"> & {
  assignment_id: string | null;
};

/** Fields included in PATCH and editable in update mode. Omit a key to keep it read-only. */
export const SHIPMENT_UPDATE_FIELDS = {
  status: true,
  assignment_id: true,
  delivery_by_date: true,
  lat: true,
  lng: true,
} as const satisfies Partial<Record<keyof ShipmentFormValues, true>>;

export type ShipmentUpdateField = keyof typeof SHIPMENT_UPDATE_FIELDS;

export function isShipmentUpdateField(
  field: keyof ShipmentFormValues
): field is ShipmentUpdateField {
  return Object.hasOwn(SHIPMENT_UPDATE_FIELDS, field);
}

export function toShipmentUpdate(
  values: ShipmentFormPayload,
  current: Shipment
): ShipmentUpdate {
  const update: ShipmentUpdate = {};

  if (isShipmentUpdateField("delivery_by_date")) {
    update.delivery_by_date = values.delivery_by_date;
  }
  if (isShipmentUpdateField("lat")) {
    update.lat = values.lat;
  }
  if (isShipmentUpdateField("lng")) {
    update.lng = values.lng;
  }

  if (isShipmentUpdateField("status") && values.status !== current.status) {
    update.status = values.status;
  }
  if (
    isShipmentUpdateField("assignment_id") &&
    (values.assignment_id || null) !== (current.assignment_id || null)
  ) {
    update.assignment_id = values.assignment_id;
  }

  return update;
}

type UseShipmentFormOptions = {
  shipment?: Shipment | null;
  onSubmit?: (values: ShipmentFormPayload) => void;
};

const DEFAULT_WAREHOUSE_ID = "581";
const DEFAULT_LAT = "32.8";
const DEFAULT_LNG = "-96.95";
const TWO_DAYS_MS = 2 * 86400000;

function defaultCreateForm(): ShipmentFormValues {
  const now = new Date();
  const deliveryBy = new Date(now.getTime() + TWO_DAYS_MS);
  return {
    client_name: "",
    label: "",
    arrival_date: toDatetimeLocal(now.toISOString()),
    warehouse_id: DEFAULT_WAREHOUSE_ID,
    delivery_by_date: toDatetimeLocal(deliveryBy.toISOString()),
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
    status: "OPEN",
    assignment_id: "",
  };
}

function toFormState(shipment?: Shipment | null): ShipmentFormValues {
  if (!shipment) return defaultCreateForm();
  return {
    client_name: shipment.client_name,
    label: shipment.label,
    arrival_date: toDatetimeLocal(shipment.arrival_date),
    warehouse_id: shipment.warehouse_id,
    delivery_by_date: toDatetimeLocal(shipment.delivery_by_date),
    lat: String(shipment.lat),
    lng: String(shipment.lng),
    status: shipment.status,
    assignment_id: shipment.assignment_id ?? "",
  };
}

function toPayload(values: ShipmentFormValues): ShipmentFormPayload {
  return {
    client_name: values.client_name.trim(),
    label: values.label.trim(),
    warehouse_id: values.warehouse_id.trim(),
    arrival_date: fromDatetimeLocal(values.arrival_date),
    delivery_by_date: fromDatetimeLocal(values.delivery_by_date),
    lat: Number(values.lat),
    lng: Number(values.lng),
    status: values.status,
    assignment_id:
      values.status === "IN_TRANSIT" ? values.assignment_id || null : null,
  };
}

export function useShipmentForm({
  shipment,
  onSubmit,
}: UseShipmentFormOptions = {}) {
  const isCreate = !shipment;
  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentFormSchema),
    defaultValues: toFormState(shipment),
    mode: "onChange",
  });
  const assignmentsQuery = useAssignmentsQuery();
  const shipmentId = shipment?.id;
  const values = form.watch();
  const { isValid } = form.formState;

  useEffect(() => {
    form.reset(toFormState(shipment));
  }, [shipmentId]); // eslint-disable-line react-hooks/exhaustive-deps -- reset when switching shipments, not on every refetch

  const baseline = toFormState(shipment);
  const isDirty = (Object.keys(values) as (keyof ShipmentFormValues)[]).some(
    (key) =>
      (isCreate || isShipmentUpdateField(key)) && values[key] !== baseline[key]
  );
  const needsAssignment = values.status === "IN_TRANSIT";
  const statusOptions = getStatusOptions(shipment?.status ?? "OPEN");
  const canSubmit = isValid && (isCreate || isDirty);

  function setStatus(next: ShipmentStatus) {
    form.setValue("status", next, { shouldDirty: true, shouldValidate: true });
    if (next === "IN_TRANSIT") {
      void form.trigger("assignment_id");
      return;
    }
    form.setValue("assignment_id", "", { shouldValidate: true });
    form.clearErrors("assignment_id");
  }

  return {
    form,
    canSubmit,
    needsAssignment,
    statusOptions,
    assignments: assignmentsQuery.data ?? [],
    isAssignmentsLoading: assignmentsQuery.isLoading,
    setStatus,
    handleSubmit: form.handleSubmit(() => {
      onSubmit?.(toPayload(form.getValues()));
    }),
  };
}
