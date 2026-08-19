import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  shipmentFormSchema,
  toShipmentUpdate,
  useShipmentForm,
  type ShipmentFormPayload,
} from "@/hooks/use-shipment-form";
import { makeShipment, validFormValues } from "@/test/fixtures";

vi.mock("@/hooks/use-shipment-queries", () => ({
  useAssignmentsQuery: () => ({
    data: [],
    isLoading: false,
  }),
}));

describe("shipmentFormSchema", () => {
  it("requires an assignment to move to In Transit", () => {
    const result = shipmentFormSchema.safeParse(
      validFormValues({ status: "IN_TRANSIT", assignment_id: "" })
    );

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["assignment_id"],
          message: "An assignment is required to move to In Transit.",
        }),
      ])
    );
  });

  it("accepts In Transit when an assignment is selected", () => {
    const result = shipmentFormSchema.safeParse(
      validFormValues({ status: "IN_TRANSIT", assignment_id: "asn_1" })
    );

    expect(result.success).toBe(true);
  });

  it("accepts Open and Delivered without an assignment", () => {
    expect(shipmentFormSchema.safeParse(validFormValues()).success).toBe(true);
    expect(
      shipmentFormSchema.safeParse(
        validFormValues({ status: "DELIVERED", assignment_id: "" })
      ).success
    ).toBe(true);
  });
});

describe("toShipmentUpdate", () => {
  const current = makeShipment();

  function payload(
    overrides: Partial<ShipmentFormPayload> = {}
  ): ShipmentFormPayload {
    return {
      client_name: current.client_name,
      label: current.label,
      warehouse_id: current.warehouse_id,
      arrival_date: current.arrival_date,
      delivery_by_date: current.delivery_by_date,
      lat: current.lat,
      lng: current.lng,
      status: current.status,
      assignment_id: current.assignment_id ?? null,
      ...overrides,
    };
  }

  it("includes editable location and delivery fields, not identity fields", () => {
    const update = toShipmentUpdate(payload(), current);

    expect(update).toEqual({
      delivery_by_date: current.delivery_by_date,
      lat: current.lat,
      lng: current.lng,
    });
    expect(update).not.toHaveProperty("client_name");
    expect(update).not.toHaveProperty("label");
    expect(update).not.toHaveProperty("warehouse_id");
    expect(update).not.toHaveProperty("arrival_date");
  });

  it("omits status when it has not changed", () => {
    const update = toShipmentUpdate(payload({ status: "OPEN" }), current);
    expect(update.status).toBeUndefined();
  });

  it("includes status and assignment only when they change", () => {
    const update = toShipmentUpdate(
      payload({ status: "IN_TRANSIT", assignment_id: "asn_1" }),
      current
    );

    expect(update.status).toBe("IN_TRANSIT");
    expect(update.assignment_id).toBe("asn_1");
  });
});

describe("useShipmentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requires an assignment after moving to In Transit and clears it when leaving", () => {
    const { result } = renderHook(() =>
      useShipmentForm({ shipment: makeShipment() })
    );

    act(() => {
      result.current.form.setValue("assignment_id", "asn_1");
      result.current.setStatus("IN_TRANSIT");
    });

    expect(result.current.needsAssignment).toBe(true);
    expect(result.current.form.getValues("assignment_id")).toBe("asn_1");

    act(() => {
      result.current.setStatus("OPEN");
    });

    expect(result.current.needsAssignment).toBe(false);
    expect(result.current.form.getValues("assignment_id")).toBe("");
  });

  it("submits assignment only when status is In Transit", async () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() => useShipmentForm({ onSubmit }));

    act(() => {
      result.current.form.reset(
        validFormValues({ status: "OPEN", assignment_id: "asn_1" })
      );
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "OPEN",
        assignment_id: null,
        client_name: "Acme Logistics",
      })
    );

    onSubmit.mockClear();

    act(() => {
      result.current.form.reset(
        validFormValues({ status: "IN_TRANSIT", assignment_id: "asn_1" })
      );
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "IN_TRANSIT",
        assignment_id: "asn_1",
      })
    );
  });
});
