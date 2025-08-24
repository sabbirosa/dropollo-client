import { ProfileForm } from "@/components/modules/user/ProfileForm";

export default function Profile() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your administrator account information
        </p>
      </div>
      
      <ProfileForm />
    </div>
  );
}
