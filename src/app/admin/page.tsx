import { requireAdmin } from "@/lib/admin";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="white-text text-4xl font-black mb-4">
          🚀 Tableau de bord Admin
        </h1>
        <p className="text-neutral-200 text-lg">
          Gestion complète de KLIQZ
        </p>
      </div>

      <AdminDashboard />
    </div>
  );
}
