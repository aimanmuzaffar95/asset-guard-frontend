import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { buildApiUrl } from "@/lib/config";

type AssetType = {
  id: string;
  name: string;
  description: string | null;
};

type AssetTypesSuccessResponse = {
  success: true;
  data: AssetType[];
  meta?: {
    statusCode?: number;
    path?: string;
    method?: string;
    timestamp?: string;
  };
};

type AssetTypesErrorResponse = {
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

export async function GET() {
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

  let upstreamResponse: Response;

  try {
    upstreamResponse = await fetch(buildApiUrl("/asset-types"), {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          messages: ["Unable to reach the asset type service."],
        },
      },
      { status: 502 },
    );
  }

  const responseData = (await parseJson(upstreamResponse)) as
    | AssetTypesSuccessResponse
    | AssetTypesErrorResponse
    | null;

  if (!upstreamResponse.ok || responseData?.success !== true) {
    const upstreamErrorMessages =
      responseData && "error" in responseData
        ? responseData.error?.messages?.filter(Boolean)
        : undefined;

    const errorMessages =
      upstreamErrorMessages ?? ["Failed to load asset types."];

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

  return NextResponse.json(responseData, { status: upstreamResponse.status || 200 });
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
