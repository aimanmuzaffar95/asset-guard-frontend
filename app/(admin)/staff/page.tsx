import DashboardHeader from "../_components/dashboard-header";
import StaffTable from "./_components/staff-table";

export default function StaffPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />

      <main className="flex-1 p-6 lg:p-10 space-y-6 max-w-[1200px] mx-auto w-full">
        {/* Page Header Actions */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 md:text-4xl">
              Staff Directory
            </h1>
            <p className="text-base font-normal text-slate-500">
              Monitor team assignments and hardware distribution across departments.
            </p>
          </div>
          <button className="flex min-w-[140px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-11 px-5 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
            <span className="material-symbols-outlined text-lg">person_add</span>
            <span>Add New Staff</span>
          </button>
        </div>

        {/* Filter Section */}
        <div className="mb-6">
          <label className="flex flex-col h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm">
              <div className="flex items-center justify-center rounded-l-xl border border-r-0 border-slate-200 bg-white pl-4 text-slate-500">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="form-input h-full w-full min-w-0 flex-1 rounded-r-xl border border-l-0 border-slate-200 bg-white px-4 text-base font-normal text-slate-900 placeholder:text-slate-500 focus:outline-0 focus:ring-0"
                placeholder="Search staff by name, email, or department..."
              />
            </div>
          </label>
        </div>

        {/* Table Container */}
        <StaffTable />
      </main>
    </div>
  );
}
