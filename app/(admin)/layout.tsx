import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "./_components/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!accessToken || role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--page-background)] transition-colors">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[var(--page-background)] transition-colors">
        {children}
      </main>
    </div>
  );
}
