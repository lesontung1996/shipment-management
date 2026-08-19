import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ShipmentForm } from "@/components/shipments/shipments-detail/shipment-form";
import * as shipmentApi from "@/api/shipment";
import {
  createQueryWrapper,
  makeAssignment,
  makeShipment,
} from "@/test/fixtures";

vi.mock("@/api/shipment", () => ({
  createShipment: vi.fn(),
  updateShipment: vi.fn(),
  getAssignments: vi.fn(),
  deleteShipment: vi.fn(),
  getShipments: vi.fn(),
  getShipment: vi.fn(),
}));

const createShipment = vi.mocked(shipmentApi.createShipment);
const updateShipment = vi.mocked(shipmentApi.updateShipment);
const getAssignments = vi.mocked(shipmentApi.getAssignments);

function renderForm(
  props: Parameters<typeof ShipmentForm>[0] = {}
) {
  return render(<ShipmentForm {...props} />, {
    wrapper: createQueryWrapper(),
  });
}

function statusTrigger() {
  const el = document.querySelector<HTMLElement>('[data-slot="select-trigger"]');
  if (!el) throw new Error("Status select was not rendered.");
  return el;
}

function assignmentTrigger() {
  const el = document.querySelector<HTMLElement>(
    '[data-slot="combobox-trigger"]'
  );
  if (!el) throw new Error("Assignment combobox was not rendered.");
  return el;
}

async function selectStatus(label: string) {
  const user = userEvent.setup();
  await user.click(statusTrigger());
  const listbox = await screen.findByRole("listbox");
  await user.click(within(listbox).getByRole("option", { name: label }));
  return user;
}

describe("ShipmentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAssignments.mockResolvedValue([makeAssignment()]);
    createShipment.mockImplementation(async (shipment) => ({
      ...shipment,
      id: shipment.id ?? "shp_created",
      eta: shipment.eta,
    }));
    updateShipment.mockImplementation(async (id, update) => ({
      ...makeShipment(),
      ...update,
      id,
    }));
  });

  it("creates an Open shipment after the dispatcher fills client and label", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    renderForm({ onSuccess });

    await user.type(screen.getByLabelText("Client"), "Acme Logistics");
    await user.type(screen.getByLabelText("Label"), "Dallas inbound");
    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(createShipment).toHaveBeenCalledTimes(1);
    });

    const body = createShipment.mock.calls[0][0];
    expect(body.status).toBe("OPEN");
    expect(body.client_name).toBe("Acme Logistics");
    expect(body.label).toBe("Dallas inbound");
    expect(body.id).toMatch(/^shp_/);
  });

  it("blocks In Transit until an assignment is chosen", async () => {
    renderForm({ shipment: makeShipment() });

    expect(assignmentTrigger()).toBeDisabled();
    expect(assignmentTrigger()).toHaveTextContent("—");

    await selectStatus("In Transit");

    expect(
      await screen.findByText("Select assignment...")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("An assignment is required to move to In Transit.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(assignmentTrigger()).toBeEnabled();
  });

  it("locks identity fields on an existing shipment", () => {
    renderForm({ shipment: makeShipment() });

    expect(screen.getByLabelText("Client")).toBeDisabled();
    expect(screen.getByLabelText("Label")).toBeDisabled();
    expect(screen.getByLabelText("Arrival date")).toBeDisabled();
    expect(screen.getByLabelText("Warehouse")).toBeDisabled();
    expect(screen.getByLabelText("Delivery by")).toBeEnabled();
    expect(screen.getByLabelText("Latitude")).toBeEnabled();
    expect(screen.getByLabelText("Longitude")).toBeEnabled();
    expect(statusTrigger()).toBeEnabled();
  });

  it("locks status and assignment when the shipment is Delivered", () => {
    renderForm({
      shipment: makeShipment({ status: "DELIVERED" }),
    });

    expect(statusTrigger()).toBeDisabled();
    expect(assignmentTrigger()).toBeDisabled();
  });

  it("saves only changed update fields on PATCH", async () => {
    const user = userEvent.setup();
    const shipment = makeShipment();
    renderForm({ shipment });

    const lat = screen.getByLabelText("Latitude");
    await user.clear(lat);
    await user.type(lat, "33.1");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(updateShipment).toHaveBeenCalledTimes(1);
    });

    const [id, update] = updateShipment.mock.calls[0];
    expect(id).toBe(shipment.id);
    expect(update.lat).toBe(33.1);
    expect(update.status).toBeUndefined();
    expect(update).not.toHaveProperty("client_name");
    expect(update).toHaveProperty("delivery_by_date");
    expect(update).toHaveProperty("lng");
  });

  it("shows an error when save fails", async () => {
    const user = userEvent.setup();
    updateShipment.mockRejectedValue(new Error("network"));
    renderForm({ shipment: makeShipment() });

    const lat = screen.getByLabelText("Latitude");
    await user.clear(lat);
    await user.type(lat, "33.1");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(
      await screen.findByText("Could not save changes. Try again.")
    ).toBeInTheDocument();
  });
});
