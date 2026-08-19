import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ShipmentStatusFilters } from "@/components/shipments/shipments-list/shipment-status-filters";

describe("ShipmentStatusFilters", () => {
  it("lets the dispatcher filter the list by status", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <ShipmentStatusFilters value="OPEN" onChange={onChange} />
    );

    expect(
      screen.getByRole("radiogroup", { name: "Filter shipments by status" })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "in transit" }));
    expect(onChange).toHaveBeenCalledWith("IN_TRANSIT");

    rerender(
      <ShipmentStatusFilters value="IN_TRANSIT" onChange={onChange} />
    );
    expect(screen.getByRole("radio", { name: "in transit" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });
});
