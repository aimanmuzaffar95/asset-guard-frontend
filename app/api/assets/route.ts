import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { buildApiUrl } from "@/lib/config";

type CreateAssetRequestBody = {
  name?: string;
  assetTypeId?: string;
  serialNumber?: string;
  notes?: string | null;
};

type AssetType = {
  id: string;
  name: string;
  description: string | null;
};

type CreateAssetSuccessResponse = {
  success: true;
  data: {
    id: string;
    assetTypeId: string;
    name: string;
    serialNumber: string;
    notes: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    assetType: AssetType;
  };
  meta?: {
    statusCode?: number;
    path?: string;
    method?: string;
    timestamp?: string;
  };
};

type CreateAssetErrorResponse = {
  success?: false;
  error?: {
    messages?: string[];
    code?: string;
  };
  meta?: {
    statusCode?: number;
    path?: string;
    method?: string;
    timestamp?: string;
  };
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  let body: CreateAssetRequestBody;

  try {
    body = (await request.json()) as CreateAssetRequestBody;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          messages: ["Invalid request body."],
        },
      },
      { status: 400 },
    );
  }

  const accessToken = (await cookies()).get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        success: false,
        error: {
          messages: ["Authentication required."],
        },
      },
      { status: 401 },
    );
  }

  const validationErrors = validateCreateAssetBody(body);

  if (validationErrors.length > 0) {
    return NextResponse.json(
      {
        success: false,
        error: {
          messages: validationErrors,
        },
      },
      { status: 400 },
    );
  }

  const name = body.name!.trim();
  const assetTypeId = body.assetTypeId!.trim();
  const serialNumber = body.serialNumber!.trim();
  const notes = normalizeNotes(body.notes);

  let upstreamResponse: Response;

  try {
    upstreamResponse = await fetch(buildApiUrl("/admin/assets"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name, assetTypeId, serialNumber, notes }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          messages: ["Unable to reach the asset service."],
        },
      },
      { status: 502 },
    );
  }

  const responseData = (await parseJson(upstreamResponse)) as
    | CreateAssetSuccessResponse
    | CreateAssetErrorResponse
    | null;

  if (!upstreamResponse.ok || responseData?.success !== true) {
    const upstreamErrorMessages =
      responseData && "error" in responseData
        ? responseData.error?.messages?.filter(Boolean)
        : undefined;

    const errorMessages =
      upstreamErrorMessages ?? ["Failed to save asset."];

    return NextResponse.json(
      {
        success: false,
        error: {
          messages: errorMessages,
        },
        meta: responseData?.meta,
      },
      { status: upstreamResponse.status || 500 },
    );
  }

  return NextResponse.json(responseData, { status: upstreamResponse.status || 201 });
}

function validateCreateAssetBody(body: CreateAssetRequestBody) {
  const errors: string[] = [];
  const name = body.name?.trim();
  const assetTypeId = body.assetTypeId?.trim();
  const serialNumber = body.serialNumber?.trim();
  const notes = body.notes?.trim();

  if (!name) {
    errors.push("Name is required.");
  } else if (name.length > 255) {
    errors.push("Name must be 255 characters or fewer.");
  }

  if (!assetTypeId) {
    errors.push("Asset type is required.");
  } else if (!UUID_PATTERN.test(assetTypeId)) {
    errors.push("Asset type must be a valid UUID.");
  }

  if (!serialNumber) {
    errors.push("Serial number is required.");
  } else if (serialNumber.length > 100) {
    errors.push("Serial number must be 100 characters or fewer.");
  }

  if (typeof notes === "string" && notes.length > 1000) {
    errors.push("Notes must be 1000 characters or fewer.");
  }

  return errors;
}

function normalizeNotes(notes?: string | null) {
  const trimmedNotes = notes?.trim();
  return trimmedNotes ? trimmedNotes : null;
}

async function parseJson(response: Response) {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}
