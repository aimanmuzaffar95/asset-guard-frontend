import { NextResponse } from "next/server";
import { buildApiUrl } from "@/lib/config";

type LoginRequestBody = {
  email?: string;
  password?: string;
};

type LoginApiResponse = {
  success?: boolean;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    tokenExpires?: number;
    user?: {
      role?: string;
    };
  };
  error?: {
    messages?: string[];
  };
};

const DEFAULT_ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 60;
const DEFAULT_REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export async function POST(request: Request) {
  let body: LoginRequestBody;

  try {
    body = (await request.json()) as LoginRequestBody;
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

  const email = body.email?.trim();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json(
      {
        success: false,
        error: {
          messages: ["Email and password are required."],
        },
      },
      { status: 400 },
    );
  }

  let upstreamResponse: Response;

  try {
    upstreamResponse = await fetch(buildApiUrl("/auth/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          messages: ["Unable to reach authentication service."],
        },
      },
      { status: 502 },
    );
  }

  const responseData = (await parseJson(upstreamResponse)) as LoginApiResponse | null;

  if (!upstreamResponse.ok || responseData?.success !== true) {
    const errorMessages =
      responseData?.error?.messages?.filter(Boolean) ?? ["Login failed. Please check your credentials."];

    return NextResponse.json(
      {
        success: false,
        error: {
          messages: errorMessages,
        },
      },
      { status: upstreamResponse.status || 401 },
    );
  }

  const accessToken = responseData.data?.accessToken;
  const refreshToken = responseData.data?.refreshToken;
  const role = responseData.data?.user?.role;

  if (!accessToken || role !== "admin") {
    return NextResponse.json(
      {
        success: false,
        error: {
          messages: ["Only admin users can access this application area."],
        },
      },
      { status: 403 },
    );
  }

  const response = NextResponse.json({
    success: true,
    data: {
      user: {
        role,
      },
    },
  });

  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: resolveTokenMaxAgeSeconds(responseData.data?.tokenExpires),
  });

  if (refreshToken) {
    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: DEFAULT_REFRESH_TOKEN_MAX_AGE_SECONDS,
    });
  }

  response.cookies.set("user_role", role, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DEFAULT_REFRESH_TOKEN_MAX_AGE_SECONDS,
  });

  return response;
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

function resolveTokenMaxAgeSeconds(tokenExpires?: number) {
  if (typeof tokenExpires !== "number" || !Number.isFinite(tokenExpires)) {
    return DEFAULT_ACCESS_TOKEN_MAX_AGE_SECONDS;
  }

  const nowInMilliseconds = Date.now();
  const nowInSeconds = Math.floor(nowInMilliseconds / 1000);

  if (tokenExpires > 1_000_000_000_000) {
    const maxAge = Math.floor((tokenExpires - nowInMilliseconds) / 1000);
    return maxAge > 0 ? maxAge : DEFAULT_ACCESS_TOKEN_MAX_AGE_SECONDS;
  }

  if (tokenExpires > 1_000_000_000) {
    const maxAge = Math.floor(tokenExpires - nowInSeconds);
    return maxAge > 0 ? maxAge : DEFAULT_ACCESS_TOKEN_MAX_AGE_SECONDS;
  }

  return tokenExpires > 0 ? Math.floor(tokenExpires) : DEFAULT_ACCESS_TOKEN_MAX_AGE_SECONDS;
}
