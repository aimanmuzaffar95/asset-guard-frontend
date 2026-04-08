import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { render, screen, within } from "@testing-library/react";
import AssetsPage from "./page";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("../_components/dashboard-header", () => ({
  default: () => <div>Dashboard Header</div>,
}));

describe("AssetsPage", () => {
  const cookiesMock = vi.mocked(cookies);
  const fetchMock = vi.fn();

  beforeEach(() => {
    process.env.BASE_URL = "https://api.example.com";
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
    cookiesMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders an error card when loading assets fails", async () => {
    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: "token" }),
    } as never);
    fetchMock.mockResolvedValue(
      createJsonResponse(
        {
          success: false,
          error: {
            messages: ["Authentication required."],
          },
        },
        401,
      ),
    );

    render(await AssetsPage());

    expect(screen.getByText("Unable to load assets")).toBeInTheDocument();
    expect(screen.getByText("Authentication required.")).toBeInTheDocument();
  });

  it("renders summary cards from the loaded asset data", async () => {
    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: "token" }),
    } as never);
    fetchMock.mockResolvedValue(
      createJsonResponse(
        {
          success: true,
          data: [
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
          ],
        },
        200,
      ),
    );

    render(await AssetsPage());

    expect(screen.getByText("Total Assets")).toBeInTheDocument();
    expect(screen.getByText("Available Items")).toBeInTheDocument();
    expect(screen.getByText("Assigned Assets")).toBeInTheDocument();
    expect(
      within(screen.getByTestId("summary-total-assets")).getByText("2"),
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId("summary-available-items")).getByText("1"),
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId("summary-assigned-assets")).getByText("1"),
    ).toBeInTheDocument();
  });
});

function createJsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
