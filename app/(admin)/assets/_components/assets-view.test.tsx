import { fireEvent, render, screen, within } from "@testing-library/react";
import AssetsView from "./assets-view";
import type { Asset } from "@/lib/assets";

const assets: Asset[] = [
  {
    id: "asset-1",
    name: "Macbook Pro M2",
    serialNumber: "A001",
    status: "assigned",
    notes: "Assigned laptop",
    createdAt: "2026-03-30T08:20:39.169Z",
    updatedAt: "2026-03-30T08:20:39.169Z",
    assetType: {
      id: "17277406-31c7-4408-8e09-2cf16d279efb",
      name: "laptop",
      description: "Laptop Computer",
    },
    assignedTo: "Aiman3 Muzaffar3",
  },
  {
    id: "asset-2",
    name: "Samsung S22",
    serialNumber: "B002",
    status: "available",
    notes: "Available phone",
    createdAt: "2026-03-30T08:20:48.298Z",
    updatedAt: "2026-03-30T08:20:48.298Z",
    assetType: {
      id: "366cad87-585b-47f4-9805-fe56a4ba0d37",
      name: "phone",
      description: "Mobile Phone",
    },
    assignedTo: null,
  },
  {
    id: "asset-3",
    name: "Office Chair",
    serialNumber: "C002",
    status: "assigned",
    notes: "Assigned chair",
    createdAt: "2026-03-30T08:20:55.676Z",
    updatedAt: "2026-03-30T08:20:55.676Z",
    assetType: {
      id: "105f5585-a3dc-4965-ba99-73581d4c15bc",
      name: "chair",
      description: "Office chairs",
    },
    assignedTo: "Aiman2 Muzaffar2",
  },
];

describe("AssetsView", () => {
  it("renders API-backed rows and summary counts", () => {
    render(<AssetsView assets={assets} />);

    expect(screen.getByText("Macbook Pro M2")).toBeInTheDocument();
    expect(screen.getByText("Samsung S22")).toBeInTheDocument();
    expect(screen.getByText("Office Chair")).toBeInTheDocument();
    expect(
      within(screen.getByTestId("summary-total-assets")).getByText("3"),
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId("summary-available-items")).getByText("1"),
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId("summary-assigned-assets")).getByText("2"),
    ).toBeInTheDocument();
  });

  it("filters by category", () => {
    render(<AssetsView assets={assets} />);

    fireEvent.change(screen.getByLabelText(/filter assets by category/i), {
      target: { value: "phone" },
    });

    expect(screen.getByText("Samsung S22")).toBeInTheDocument();
    expect(screen.queryByText("Macbook Pro M2")).not.toBeInTheDocument();
    expect(screen.queryByText("Office Chair")).not.toBeInTheDocument();
  });

  it("filters by status", () => {
    render(<AssetsView assets={assets} />);

    fireEvent.change(screen.getByLabelText(/filter assets by status/i), {
      target: { value: "Available" },
    });

    expect(screen.getByText("Samsung S22")).toBeInTheDocument();
    expect(screen.queryByText("Macbook Pro M2")).not.toBeInTheDocument();
    expect(screen.queryByText("Office Chair")).not.toBeInTheDocument();
  });

  it("shows the assignee fallback when an asset is not assigned", () => {
    render(<AssetsView assets={assets} />);

    expect(screen.getByText("Unassigned")).toBeInTheDocument();
  });

  it("shows an empty table state when filters remove all rows", () => {
    render(<AssetsView assets={assets} />);

    fireEvent.change(screen.getByLabelText(/filter assets by category/i), {
      target: { value: "chair" },
    });
    fireEvent.change(screen.getByLabelText(/filter assets by status/i), {
      target: { value: "Available" },
    });

    expect(screen.getByText("No assets match the selected filters.")).toBeInTheDocument();
  });
});
