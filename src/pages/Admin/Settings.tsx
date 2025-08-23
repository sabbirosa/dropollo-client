export default function Settings() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          System Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure system-wide settings and preferences
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Coming Soon</h2>
        <p className="text-gray-600 dark:text-gray-400">
          This feature is under development. Here you will be able to:
        </p>
        <ul className="mt-4 list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li>Configure delivery fee structures</li>
          <li>Set system-wide notification preferences</li>
          <li>Manage API keys and integrations</li>
          <li>Configure backup and security settings</li>
          <li>Set maintenance mode and announcements</li>
        </ul>
      </div>
    </div>
  );
}
