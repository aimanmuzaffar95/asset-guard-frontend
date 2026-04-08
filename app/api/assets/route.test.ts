import { cookies } from "next/headers";
import { GET, POST } from "./route";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

describe("POST /api/assets", () => {
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

    const request = new Request("http://localhost/api/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "MacBook Pro 16-inch",
        assetTypeId: "550e8400-e29b-41d4-a716-446655440000",
        serialNumber: "SN-123456789",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error.messages).toEqual(["Authentication required."]);
  });

  it("returns 400 for invalid JSON", async () => {
    const request = new Request("http://localhost/api/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.messages).toEqual(["Invalid request body."]);
  });

  it("returns 400 for missing required fields", async () => {
    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: "token" }),
    } as never);

    const request = new Request("http://localhost/api/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "   ",
        assetTypeId: "not-a-uuid",
        serialNumber: "   ",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.messages).toEqual([
      "Name is required.",
      "Asset type must be a valid UUID.",
      "Serial number is required.",
    ]);
  });

  it("forwards a successful create request with trimmed values", async () => {
    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: "token" }),
    } as never);
    fetchMock.mockResolvedValue(
      createJsonResponse(
        {
          success: true,
          data: {
            id: "2f5f1f1f-6e7d-4b5d-9b76-53f0a1c8e321",
            assetTypeId: "550e8400-e29b-41d4-a716-446655440000",
            name: "MacBook Pro 16-inch",
            serialNumber: "SN-123456789",
            notes: null,
            status: "available",
            createdAt: "2026-03-31T10:30:00.000Z",
            updatedAt: "2026-03-31T10:30:00.000Z",
            assetType: {
              id: "550e8400-e29b-41d4-a716-446655440000",
              name: "laptop",
              description: "Laptop Computer",
            },
          },
          meta: {
            statusCode: 201,
            path: "/admin/assets",
            method: "POST",
            timestamp: "2026-03-31T10:30:00.000Z",
          },
        },
        201,
      ),
    );

    const request = new Request("http://localhost/api/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "  MacBook Pro 16-inch  ",
        assetTypeId: "550e8400-e29b-41d4-a716-446655440000",
        serialNumber: "  SN-123456789  ",
        notes: "   ",
        status: "assigned",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.com/admin/assets",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer token",
        }),
        body: JSON.stringify({
          name: "MacBook Pro 16-inch",
          assetTypeId: "550e8400-e29b-41d4-a716-446655440000",
          serialNumber: "SN-123456789",
          notes: null,
        }),
      }),
    );
  });

  it("forwards backend conflict errors", async () => {
    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: "token" }),
    } as never);
    fetchMock.mockResolvedValue(
      createJsonResponse(
        {
          success: false,
          error: {
            messages: ["Asset with this serial number already exists"],
            code: "CONFLICT",
          },
        },
        409,
      ),
    );

    const request = new Request("http://localhost/api/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "MacBook Pro 16-inch",
        assetTypeId: "550e8400-e29b-41d4-a716-446655440000",
        serialNumber: "SN-123456789",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error.messages).toEqual([
      "Asset with this serial number already exists",
    ]);
  });

  it("returns 502 when the upstream service is unreachable", async () => {
    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: "token" }),
    } as never);
    fetchMock.mockRejectedValue(new Error("network error"));

    const request = new Request("http://localhost/api/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "MacBook Pro 16-inch",
        assetTypeId: "550e8400-e29b-41d4-a716-446655440000",
        serialNumber: "SN-123456789",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(502);
    expect(data.error.messages).toEqual(["Unable to reach the asset service."]);
  });
});

describe("GET /api/assets", () => {
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

  it("forwards the asset list from the backend", async () => {
    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: "token" }),
    } as never);
    fetchMock.mockResolvedValue(
      createJsonResponse(
        {
          success: true,
          data: [
            {
              id: "e6ecb650-cad2-4c29-ac1f-739055aeb552",
              name: "Samsung S22 Pro",
              serialNumber: "SM-S36464HF",
              status: "available",
              notes: "Added from the frontend",
              createdAt: "2026-03-31T11:49:21.524Z",
              updatedAt: "2026-03-31T11:49:21.524Z",
              assetType: {
                id: "366cad87-585b-47f4-9805-fe56a4ba0d37",
                name: "phone",
                description: "Mobile Phone",
              },
              assignedTo: null,
            },
          ],
          meta: {
            statusCode: 200,
            path: "/assets",
            method: "GET",
            timestamp: "2026-04-08T09:05:08.993Z",
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
      "https://api.example.com/assets",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Authorization: "Bearer token",
        }),
      }),
    );
  });

  it("forwards backend list errors", async () => {
    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: "token" }),
    } as never);
    fetchMock.mockResolvedValue(
      createJsonResponse(
        {
          success: false,
          error: {
            messages: ["Forbidden resource"],
            code: "FORBIDDEN",
          },
        },
        403,
      ),
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error.messages).toEqual(["Forbidden resource"]);
  });

  it("returns 502 when the asset service is unreachable", async () => {
    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: "token" }),
    } as never);
    fetchMock.mockRejectedValue(new Error("network error"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(502);
    expect(data.error.messages).toEqual(["Unable to reach the asset service."]);
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
