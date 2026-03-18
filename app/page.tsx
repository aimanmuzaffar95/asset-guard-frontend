import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const userRole = cookieStore.get("user_role")?.value;
  const isAuthenticatedAdmin = Boolean(accessToken) && userRole === "admin";

  if (isAuthenticatedAdmin) {
    redirect("/dashboard");
  }

  redirect("/login");
}
