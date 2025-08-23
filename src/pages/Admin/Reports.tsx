export default function Reports() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Reports & Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Generate comprehensive reports and view detailed analytics
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Coming Soon</h2>
        <p className="text-gray-600 dark:text-gray-400">
          This feature is under development. Here you will be able to:
        </p>
        <ul className="mt-4 list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li>Generate delivery performance reports</li>
          <li>View revenue and financial analytics</li>
          <li>Export data in various formats (PDF, Excel)</li>
          <li>Create custom report filters</li>
          <li>Schedule automated report generation</li>
        </ul>
      </div>
    </div>
  );
}
