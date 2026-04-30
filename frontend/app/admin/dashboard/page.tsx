import ResponsiveDrawer from "@/components/AdminDrawer";
import AdminVacancy from "@/components/adminvacancy/AdminVacancy";

function Dashboard() {
  return (
    <div className="flex flex-row min-h-screen">
      <ResponsiveDrawer />
      <div className="flex justify-center items-center flex-1 p-4 sm:p-6 md:p-8 ">
        <AdminVacancy />
      </div>
    </div>
  );
}
export default Dashboard;
