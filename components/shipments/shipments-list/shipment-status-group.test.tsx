import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ShipmentStatusGroup } from "@/components/shipments/shipments-list/shipment-status-group";
import { useShipmentsQuery } from "@/hooks/use-shipment-queries";
import { useShipmentStore } from "@/stores/shipment-store";
import { makeShipment } from "@/test/fixtures";
import type { PaginatedResponse } from "@/types";
import type { Shipment } from "@/types/shipments";

vi.mock("@/hooks/use-shipment-queries", () => ({
  useShipmentsQuery: vi.fn(),
}));

vi.mock("@tanstack/react-virtual", () => ({
  useVirtualizer: ({ count }: { count: number }) => ({
    getVirtualItems: () =>
      Array.from({ length: count }, (_, index) => ({
        index,
        key: index,
        start: index * 64,
        size: 64,
        end: index * 64 + 64,
      })),
    getTotalSize: () => count * 64,
  }),
}));

const useShipmentsQueryMock = vi.mocked(useShipmentsQuery);

function page(
  data: Shipment[],
  items = data.length
): PaginatedResponse<Shipment> {
  return {
    first: 1,
    prev: null,
    next: null,
    last: 1,
    pages: 1,
    items,
    data,
  };
}

function mockQuery(
  overrides: Partial<ReturnType<typeof useShipmentsQuery>> = {}
) {
  useShipmentsQueryMock.mockReturnValue({
    data: { pages: [page([])], pageParams: [1] },
    isPending: false,
    isError: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: vi.fn(),
    ...overrides,
  } as ReturnType<typeof useShipmentsQuery>);
}

describe("ShipmentStatusGroup", () => {
  beforeEach(() => {
    useShipmentStore.setState({ selectedShipmentId: null });
    vi.clearAllMocks();
  });

  it("shows an empty state when there are no shipments", () => {
    mockQuery();
    render(<ShipmentStatusGroup status="OPEN" q="" />);
    expect(screen.getByText("No shipments in this status.")).toBeInTheDocument();
  });

  it("explains when search has no matches", () => {
    mockQuery();
    render(<ShipmentStatusGroup status="OPEN" q="missing" />);
    expect(
      screen.getByText("Nothing matches this search in this status.")
    ).toBeInTheDocument();
  });

  it("shows a load error", () => {
    mockQuery({ isError: true, data: undefined });
    render(<ShipmentStatusGroup status="OPEN" q="" />);
    expect(
      screen.getByText("Could not load open shipments.")
    ).toBeInTheDocument();
  });

  it("lists shipments and selects a row", async () => {
    const user = userEvent.setup();
    const shipment = makeShipment();
    mockQuery({
      data: { pages: [page([shipment])], pageParams: [1] },
    });

    render(<ShipmentStatusGroup status="OPEN" q="" />);

    expect(screen.getByText("Acme Logistics")).toBeInTheDocument();
    expect(screen.getByText("Dallas inbound")).toBeInTheDocument();

    const row = screen.getByRole("button", { name: /Acme Logistics/ });
    expect(row).toHaveAttribute("aria-pressed", "false");
    await user.click(row);

    expect(useShipmentStore.getState().selectedShipmentId).toBe(shipment.id);
    expect(row).toHaveAttribute("aria-pressed", "true");
  });
});
