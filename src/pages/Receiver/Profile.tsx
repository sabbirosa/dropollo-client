export default function Profile() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account information and delivery preferences
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Coming Soon</h2>
        <p className="text-gray-600 dark:text-gray-400">
          This feature is under development. Here you will be able to:
        </p>
        <ul className="mt-4 list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li>Update personal and contact information</li>
          <li>Manage multiple delivery addresses</li>
          <li>Set delivery time preferences</li>
          <li>Configure notification settings</li>
          <li>Set security and privacy preferences</li>
        </ul>
      </div>
    </div>
  );
}
