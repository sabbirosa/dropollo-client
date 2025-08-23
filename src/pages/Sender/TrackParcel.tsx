export default function TrackParcel() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Track Parcel
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your parcels in real-time with detailed location updates
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Coming Soon</h2>
        <p className="text-gray-600 dark:text-gray-400">
          This feature is under development. Here you will be able to:
        </p>
        <ul className="mt-4 list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li>Enter tracking number to view status</li>
          <li>See real-time location on interactive map</li>
          <li>View estimated delivery time</li>
          <li>Receive push notifications for status updates</li>
          <li>View complete delivery timeline</li>
        </ul>
      </div>
    </div>
  );
}
