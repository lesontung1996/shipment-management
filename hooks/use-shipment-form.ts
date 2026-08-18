"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { fromDatetimeLocal, toDatetimeLocal } from "@/lib/format";
import type { Shipment, ShipmentStatus } from "@/types/shipments";
import { getStatusOptions } from "@/types/shipments";
import { useAssignments } from "@/hooks/use-shipment-queries";

export type ShipmentFormState = {
  delivery_by_date: string;
  lat: string;
  lng: string;
  status: ShipmentStatus;
  assignment_id: string;
};

export type ShipmentFormPayload = {
  delivery_by_date: string;
  lat: number;
  lng: number;
  status: ShipmentStatus;
  assignment_id: string | null;
};

export type ShipmentFormErrors = {
  lat?: string;
  lng?: string;
  delivery_by_date?: string;
  assignment_id?: string;
};

type UseShipmentFormOptions = {
  shipment?: Shipment | null;
  onSubmit?: (values: ShipmentFormPayload) => void;
};

const EMPTY_FORM: ShipmentFormState = {
  delivery_by_date: "",
  lat: "",
  lng: "",
  status: "OPEN",
  assignment_id: "",
};

function toFormState(shipment?: Shipment | null): ShipmentFormState {
  if (!shipment) return EMPTY_FORM;
  return {
    delivery_by_date: toDatetimeLocal(shipment.delivery_by_date),
    lat: String(shipment.lat),
    lng: String(shipment.lng),
    status: shipment.status,
    assignment_id: shipment.assignment_id ?? "",
  };
}

function validate(form: ShipmentFormState): ShipmentFormErrors {
  const lat = Number(form.lat);
  const lng = Number(form.lng);
  const dateMs = new Date(form.delivery_by_date).getTime();
  const errors: ShipmentFormErrors = {};

  if (form.lat.trim() === "" || !Number.isFinite(lat) || lat < -90 || lat > 90) {
    errors.lat = "Latitude must be a number between -90 and 90.";
  }
  if (
    form.lng.trim() === "" ||
    !Number.isFinite(lng) ||
    lng < -180 ||
    lng > 180
  ) {
    errors.lng = "Longitude must be a number between -180 and 180.";
  }
  if (!form.delivery_by_date || Number.isNaN(dateMs)) {
    errors.delivery_by_date = "Delivery-by date is required.";
  }
  if (form.status === "IN_TRANSIT" && !form.assignment_id) {
    errors.assignment_id = "An assignment is required to move to In Transit.";
  }

  return errors;
}

export function useShipmentForm({
  shipment,
  onSubmit,
}: UseShipmentFormOptions = {}) {
  const [form, setForm] = useState<ShipmentFormState>(() => toFormState(shipment));
  const assignmentsQuery = useAssignments();
  const shipmentId = shipment?.id;

  useEffect(() => {
    setForm(toFormState(shipment));
  }, [shipmentId]); // eslint-disable-line react-hooks/exhaustive-deps -- reset when switching shipments, not on every refetch

  const baseline = useMemo(() => toFormState(shipment), [shipment]);
  const isDirty =
    form.delivery_by_date !== baseline.delivery_by_date ||
    form.lat !== baseline.lat ||
    form.lng !== baseline.lng ||
    form.status !== baseline.status ||
    form.assignment_id !== baseline.assignment_id;

  const errors = validate(form);
  const isValid = Object.keys(errors).length === 0;
  const needsAssignment = form.status === "IN_TRANSIT";
  const statusOptions = getStatusOptions(shipment?.status ?? "OPEN");
  const isCreate = !shipment;
  const canSubmit = isValid && (isCreate || isDirty);

  function setField<K extends keyof ShipmentFormState>(
    key: K,
    value: ShipmentFormState[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function setStatus(next: ShipmentStatus) {
    setForm((current) => {
      const cleared =
        next === "OPEN" || next === "DELIVERED" ? { assignment_id: "" } : {};
      return { ...current, ...cleared, status: next };
    });
  }

  function toPayload(): ShipmentFormPayload | null {
    if (!isValid) return null;
    return {
      delivery_by_date: fromDatetimeLocal(form.delivery_by_date),
      lat: Number(form.lat),
      lng: Number(form.lng),
      status: form.status,
      assignment_id:
        form.status === "IN_TRANSIT" ? form.assignment_id || null : null,
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = toPayload();
    if (!payload) return;
    onSubmit?.(payload);
  }

  function reset() {
    setForm(toFormState(shipment));
  }

  return {
    form,
    errors,
    isValid,
    isDirty,
    isCreate,
    canSubmit,
    needsAssignment,
    statusOptions,
    assignments: assignmentsQuery.data ?? [],
    isAssignmentsLoading: assignmentsQuery.isLoading,
    setField,
    setStatus,
    handleSubmit,
    toPayload,
    reset,
  };
}
