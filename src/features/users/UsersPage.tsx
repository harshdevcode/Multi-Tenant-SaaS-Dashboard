import { useUsers } from '@/hooks/useQueries'
import { Can } from '@/components/ui/Can'
import { RoleBadge } from '@/components/ui/Badge'
import { formatRelativeTime } from '@/utils/format'

export function UsersPage() {
  const { data: users, isLoading } = useUsers()

  if (isLoading) {
    return <div className="text-sm text-gray-400 p-4">Loading users...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-medium text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">{users?.length ?? 0} members</p>
        </div>
        <Can do="users:write">
          <button className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            + Invite user
          </button>
        </Can>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Name</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Email</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Role</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Last active</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                <td className="px-4 py-3 text-gray-500">{user.email}</td>
                <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                <td className="px-4 py-3 text-gray-400">{formatRelativeTime(user.lastActiveAt)}</td>
                <td className="px-4 py-3">
                  <Can do="users:write">
                    <button className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded px-2 py-1 transition-colors">
                      Edit
                    </button>
                  </Can>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
