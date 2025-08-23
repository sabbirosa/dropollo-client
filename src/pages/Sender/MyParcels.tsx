export default function MyParcels() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Parcels
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage all your sent parcels
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Coming Soon</h2>
        <p className="text-gray-600 dark:text-gray-400">
          This feature is under development. Here you will be able to:
        </p>
        <ul className="mt-4 list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li>View all parcels you've sent</li>
          <li>Track real-time delivery status</li>
          <li>View delivery history and receipts</li>
          <li>Cancel or modify pending shipments</li>
          <li>Export parcel data and reports</li>
        </ul>
      </div>
    </div>
  );
}
