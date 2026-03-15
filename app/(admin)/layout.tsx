import Sidebar from "./_components/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--page-background)] transition-colors">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[var(--page-background)] transition-colors">
        {children}
      </main>
    </div>
  );
}
