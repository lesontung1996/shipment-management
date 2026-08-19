import { describe, expect, it } from "vitest";
import { getStatusOptions } from "@/lib/shipment-status";

describe("getStatusOptions", () => {
  it("lets an Open shipment move only to In Transit", () => {
    expect(getStatusOptions("OPEN")).toEqual(["OPEN", "IN_TRANSIT"]);
  });

  it("lets an In Transit shipment roll back to Open or mark Delivered", () => {
    expect(getStatusOptions("IN_TRANSIT")).toEqual([
      "IN_TRANSIT",
      "OPEN",
      "DELIVERED",
    ]);
  });

  it("locks a Delivered shipment to Delivered only", () => {
    expect(getStatusOptions("DELIVERED")).toEqual(["DELIVERED"]);
  });
});
