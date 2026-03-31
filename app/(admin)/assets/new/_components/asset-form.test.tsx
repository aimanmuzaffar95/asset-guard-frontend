import type { ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AssetForm from "./asset-form";

const pushMock = vi.fn();

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

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("AssetForm", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    pushMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows a loading state while asset types are loading", () => {
    fetchMock.mockImplementation(() => new Promise(() => undefined));

    render(<AssetForm />);

    expect(screen.getByLabelText(/asset type/i)).toBeDisabled();
    expect(screen.getAllByText("Loading asset types...")).toHaveLength(2);
    expect(screen.getByRole("button", { name: /save asset/i })).toBeDisabled();
  });

  it("renders fetched asset types as options", async () => {
    fetchMock.mockResolvedValueOnce(
      createJsonResponse({
        success: true,
        data: [
          {
            id: "17277406-31c7-4408-8e09-2cf16d279efb",
            name: "laptop",
            description: "Laptop Computer",
          },
          {
            id: "981c1384-e970-4c20-b9cb-ba8fd8466e8f",
            name: "monitor",
            description: "External Monitor",
          },
        ],
      }),
    );

    render(<AssetForm />);

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "laptop - Laptop Computer" }),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("option", { name: "monitor - External Monitor" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/asset type/i)).toBeEnabled();
  });

  it("shows an empty state when no asset types are available", async () => {
    fetchMock.mockResolvedValueOnce(
      createJsonResponse({
        success: true,
        data: [],
      }),
    );

    render(<AssetForm />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "No asset types are available yet. Create an asset type before adding assets.",
        ),
      ).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /save asset/i })).toBeDisabled();
  });

  it("shows an error state when asset types fail to load", async () => {
    fetchMock.mockResolvedValueOnce(
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

    render(<AssetForm />);

    await waitFor(() => {
      expect(screen.getByText("Authentication required.")).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /save asset/i })).toBeDisabled();
  });

  it("submits the new asset contract and shows success feedback", async () => {
    fetchMock
      .mockResolvedValueOnce(
        createJsonResponse({
          success: true,
          data: [
            {
              id: "17277406-31c7-4408-8e09-2cf16d279efb",
              name: "laptop",
              description: "Laptop Computer",
            },
          ],
        }),
      )
      .mockResolvedValueOnce(
        createJsonResponse({
          success: true,
          data: {
            id: "2f5f1f1f-6e7d-4b5d-9b76-53f0a1c8e321",
          },
        }),
      );

    render(<AssetForm />);

    await waitFor(() => {
      expect(screen.getByLabelText(/asset type/i)).toBeEnabled();
    });

    fireEvent.change(screen.getByLabelText(/item name/i), {
      target: { value: "MacBook Pro 16-inch" },
    });
    fireEvent.change(screen.getByLabelText(/asset type/i), {
      target: { value: "17277406-31c7-4408-8e09-2cf16d279efb" },
    });
    fireEvent.change(screen.getByLabelText(/serial number/i), {
      target: { value: "SN-123456789" },
    });
    fireEvent.change(screen.getByLabelText(/notes/i), {
      target: { value: "Assigned to design team pool" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save asset/i }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/assets",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          name: "MacBook Pro 16-inch",
          assetTypeId: "17277406-31c7-4408-8e09-2cf16d279efb",
          serialNumber: "SN-123456789",
          notes: "Assigned to design team pool",
        }),
      }),
    );
    expect(
      screen.getByText("Asset saved successfully"),
    ).toBeInTheDocument();
  });

  it("shows a saving state while the asset request is in flight", async () => {
    let resolveSaveRequest: ((value: Response) => void) | undefined;

    fetchMock
      .mockResolvedValueOnce(
        createJsonResponse({
          success: true,
          data: [
            {
              id: "17277406-31c7-4408-8e09-2cf16d279efb",
              name: "laptop",
              description: "Laptop Computer",
            },
          ],
        }),
      )
      .mockImplementationOnce(
        () =>
          new Promise<Response>((resolve) => {
            resolveSaveRequest = resolve;
          }),
      );

    render(<AssetForm />);

    await waitFor(() => {
      expect(screen.getByLabelText(/asset type/i)).toBeEnabled();
    });

    fireEvent.change(screen.getByLabelText(/item name/i), {
      target: { value: "MacBook Pro 16-inch" },
    });
    fireEvent.change(screen.getByLabelText(/asset type/i), {
      target: { value: "17277406-31c7-4408-8e09-2cf16d279efb" },
    });
    fireEvent.change(screen.getByLabelText(/serial number/i), {
      target: { value: "SN-123456789" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save asset/i }));

    expect(
      screen.getByRole("button", { name: /saving asset/i }),
    ).toBeDisabled();
    expect(screen.getByLabelText(/item name/i)).toBeDisabled();
    expect(screen.getByLabelText(/asset type/i)).toBeDisabled();

    resolveSaveRequest?.(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            id: "2f5f1f1f-6e7d-4b5d-9b76-53f0a1c8e321",
          },
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("redirects back to /assets when the success dialog is closed", async () => {
    fetchMock
      .mockResolvedValueOnce(
        createJsonResponse({
          success: true,
          data: [
            {
              id: "17277406-31c7-4408-8e09-2cf16d279efb",
              name: "laptop",
              description: "Laptop Computer",
            },
          ],
        }),
      )
      .mockResolvedValueOnce(
        createJsonResponse({
          success: true,
          data: {
            id: "2f5f1f1f-6e7d-4b5d-9b76-53f0a1c8e321",
          },
        }),
      );

    render(<AssetForm />);

    await waitFor(() => {
      expect(screen.getByLabelText(/asset type/i)).toBeEnabled();
    });

    fireEvent.change(screen.getByLabelText(/item name/i), {
      target: { value: "MacBook Pro 16-inch" },
    });
    fireEvent.change(screen.getByLabelText(/asset type/i), {
      target: { value: "17277406-31c7-4408-8e09-2cf16d279efb" },
    });
    fireEvent.change(screen.getByLabelText(/serial number/i), {
      target: { value: "SN-123456789" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save asset/i }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /^close$/i }));

    expect(pushMock).toHaveBeenCalledWith("/assets");
  });

  it("shows backend error feedback when submission fails", async () => {
    fetchMock
      .mockResolvedValueOnce(
        createJsonResponse({
          success: true,
          data: [
            {
              id: "17277406-31c7-4408-8e09-2cf16d279efb",
              name: "laptop",
              description: "Laptop Computer",
            },
          ],
        }),
      )
      .mockResolvedValueOnce(
        createJsonResponse(
          {
            success: false,
            error: {
              messages: ["Asset with this serial number already exists"],
            },
          },
          409,
        ),
      );

    render(<AssetForm />);

    await waitFor(() => {
      expect(screen.getByLabelText(/asset type/i)).toBeEnabled();
    });

    fireEvent.change(screen.getByLabelText(/item name/i), {
      target: { value: "MacBook Pro 16-inch" },
    });
    fireEvent.change(screen.getByLabelText(/asset type/i), {
      target: { value: "17277406-31c7-4408-8e09-2cf16d279efb" },
    });
    fireEvent.change(screen.getByLabelText(/serial number/i), {
      target: { value: "SN-123456789" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save asset/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Asset with this serial number already exists"),
      ).toBeInTheDocument();
    });
  });
});

function createJsonResponse(body: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    }),
  );
}
