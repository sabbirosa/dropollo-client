import { UserStats } from "@/components/modules/user/UserStats";
import { UserTable } from "@/components/modules/user/UserTable";

export default function UserManagement() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          User Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage system users, roles, and permissions
        </p>
      </div>
      
      {/* User Statistics */}
      <UserStats />
      
      {/* User Table */}
      <UserTable />
    </div>
  );
}
