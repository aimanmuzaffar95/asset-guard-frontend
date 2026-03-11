function requireEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getApiBaseUrl() {
  return requireEnv(
    "API_BASE_URL or NEXT_PUBLIC_API_BASE_URL",
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL,
  );
}

export function getPublicApiBaseUrl() {
  return requireEnv(
    "NEXT_PUBLIC_API_BASE_URL",
    process.env.NEXT_PUBLIC_API_BASE_URL,
  );
}
