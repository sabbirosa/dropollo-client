export default function DeliveryHistory() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Delivery History
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View your complete delivery history and receipts
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Coming Soon</h2>
        <p className="text-gray-600 dark:text-gray-400">
          This feature is under development. Here you will be able to:
        </p>
        <ul className="mt-4 list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li>View all successfully delivered parcels</li>
          <li>Download delivery confirmations</li>
          <li>Rate delivery experience</li>
          <li>View delivery photos and signatures</li>
          <li>Search and filter delivery history</li>
        </ul>
      </div>
    </div>
  );
}
