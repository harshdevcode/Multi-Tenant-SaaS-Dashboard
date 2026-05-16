export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-medium text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Workspace configuration</p>
        </div>
        <button className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Save changes
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        <h2 className="text-sm font-medium text-gray-800">General</h2>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Workspace name</label>
          <input
            type="text"
            defaultValue="SaaSPilot HQ"
            className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Default role for new users</label>
          <select className="text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option>viewer</option>
            <option>manager</option>
            <option>admin</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-sm font-medium text-gray-800 mb-3">Danger zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">Delete workspace</p>
            <p className="text-xs text-gray-400">Permanently removes all tenant data</p>
          </div>
          <button className="text-sm px-3 py-1.5 border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors">
            Delete workspace
          </button>
        </div>
      </div>
    </div>
  )
}
