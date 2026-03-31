import { cookies } from "next/headers";
import { GET } from "./route";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

describe("GET /api/asset-types", () => {
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

  it("returns 401 when the access token cookie is missing", async () => {
    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue(undefined),
    } as never);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error.messages).toEqual(["Authentication required."]);
  });

  it("forwards the asset type list from the backend", async () => {
    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: "token" }),
    } as never);
    fetchMock.mockResolvedValue(
      createJsonResponse(
        {
          success: true,
          data: [
            {
              id: "17277406-31c7-4408-8e09-2cf16d279efb",
              name: "laptop",
              description: "Laptop Computer",
            },
          ],
          meta: {
            statusCode: 200,
            path: "/asset-types",
            method: "GET",
            timestamp: "2026-03-31T15:47:59.992Z",
          },
        },
        200,
      ),
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.com/asset-types",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Authorization: "Bearer token",
        }),
      }),
    );
  });

  it("returns 502 when the asset type service is unreachable", async () => {
    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: "token" }),
    } as never);
    fetchMock.mockRejectedValue(new Error("network error"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(502);
    expect(data.error.messages).toEqual([
      "Unable to reach the asset type service.",
    ]);
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
