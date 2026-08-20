import { describe, expect, it } from "vitest";
import {
  applyQueryParamUpdates,
  buildPathWithQuery,
  enumParam,
  optionalStringParam,
  readQueryParams,
  stringParam,
} from "@/lib/query-params";
import { SHIPMENT_STATUSES } from "@/types/shipments";

const schema = {
  q: stringParam(""),
  status: enumParam(SHIPMENT_STATUSES, "OPEN"),
  shipmentId: optionalStringParam(),
};

describe("readQueryParams", () => {
  it("parses known params and falls back to defaults", () => {
    const params = readQueryParams(
      new URLSearchParams("q=dallas&status=IN_TRANSIT&shipmentId=shp_1"),
      schema
    );

    expect(params).toEqual({
      q: "dallas",
      status: "IN_TRANSIT",
      shipmentId: "shp_1",
    });
  });

  it("ignores invalid enum values", () => {
    const params = readQueryParams(
      new URLSearchParams("status=NOT_A_STATUS"),
      schema
    );
    expect(params.status).toBe("OPEN");
  });

  it("treats missing optional strings as null", () => {
    const params = readQueryParams(new URLSearchParams(""), schema);
    expect(params).toEqual({
      q: "",
      status: "OPEN",
      shipmentId: null,
    });
  });
});

describe("applyQueryParamUpdates", () => {
  it("sets, clears, and preserves unrelated params", () => {
    const current = new URLSearchParams("status=IN_TRANSIT&utm=keep");
    const next = applyQueryParamUpdates(current, schema, {
      q: "  acme  ",
      shipmentId: "shp_9",
      status: "OPEN",
    });

    expect(next.get("q")).toBe("acme");
    expect(next.get("shipmentId")).toBe("shp_9");
    expect(next.get("status")).toBeNull();
    expect(next.get("utm")).toBe("keep");
  });

  it("removes optional ids when set to null", () => {
    const current = new URLSearchParams("shipmentId=shp_1");
    const next = applyQueryParamUpdates(current, schema, {
      shipmentId: null,
    });
    expect(next.has("shipmentId")).toBe(false);
  });
});

describe("buildPathWithQuery", () => {
  it("omits the query string when empty", () => {
    expect(buildPathWithQuery("/", new URLSearchParams())).toBe("/");
  });

  it("appends a query string when present", () => {
    expect(
      buildPathWithQuery("/", new URLSearchParams("q=dallas"))
    ).toBe("/?q=dallas");
  });
});
