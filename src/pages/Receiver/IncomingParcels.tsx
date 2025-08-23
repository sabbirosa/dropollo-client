export default function IncomingParcels() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Incoming Parcels
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View all parcels being sent to you
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Coming Soon</h2>
        <p className="text-gray-600 dark:text-gray-400">
          This feature is under development. Here you will be able to:
        </p>
        <ul className="mt-4 list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li>View all parcels being delivered to you</li>
          <li>Track incoming shipments in real-time</li>
          <li>Set delivery preferences and instructions</li>
          <li>Schedule delivery times</li>
          <li>Receive notifications for incoming parcels</li>
        </ul>
      </div>
    </div>
  );
}
