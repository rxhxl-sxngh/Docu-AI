function UserManagement() {
    return(
        <section id="user-management" class="min-h-screen bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-7xl mx-auto">
                <UserHeader></UserHeader>
                <UserStats></UserStats>
                <UserTable></UserTable>
            </div>
        </section>
    )
}

function UserHeader() {
    return(
        <div class="mb-8">
            <h2 class="text-3xl font-bold text-white mb-2">User Management</h2>
            <p class="text-neutral-400">Manage system access and permissions for invoice processing</p>
         </div>
    )
}
function UserStats() {
    return(
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-neutral-800/50 border border-neutral-700/30 rounded-lg p-6 backdrop-blur-sm">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-white">Total Users</h3>
                        <span class="text-2xl font-bold text-emerald-500">24</span>
                    </div>
                    <p class="text-neutral-400 mt-2">Active system users</p>
                </div>

                <div class="bg-neutral-800/50 border border-neutral-700/30 rounded-lg p-6 backdrop-blur-sm">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-white">Admin Users</h3>
                        <span class="text-2xl font-bold text-blue-500">4</span>
                    </div>
                    <p class="text-neutral-400 mt-2">Users with admin privileges</p>
                </div>

                <div class="bg-neutral-800/50 border border-neutral-700/30 rounded-lg p-6 backdrop-blur-sm">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-white">Pending Approvals</h3>
                        <span class="text-2xl font-bold text-amber-500">3</span>
                    </div>
                    <p class="text-neutral-400 mt-2">Awaiting access approval</p>
                </div>
            </div>

    )
    
}
function UserTable() {
    return(

<div class="bg-neutral-800/50 border border-neutral-700/30 rounded-lg backdrop-blur-sm">
                <div class="p-6 border-b border-neutral-700/30">
                    <div class="flex justify-between items-center">
                        <h3 class="text-xl font-semibold text-white">System Users</h3>
                        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Add New User
                        </button>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-neutral-700/30">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">User</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Role</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Last Active</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-neutral-700/30">
                            <tr class="hover:bg-neutral-700/20">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="h-10 w-10 flex-shrink-0">
                                            <img class="h-10 w-10 rounded-full" src="https://avatar.iran.liara.run/public" alt="User avatar"></img>
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-white">John Smith</div>
                                            <div class="text-sm text-neutral-400">john@example.com</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        Admin
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Active
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                    2 minutes ago
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button class="text-blue-400 hover:text-blue-500 mr-3">Edit</button>
                                    <button class="text-red-400 hover:text-red-500">Delete</button>
                                </td>
                            </tr>
                            <tr class="hover:bg-neutral-700/20">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="h-10 w-10 flex-shrink-0">
                                            <img class="h-10 w-10 rounded-full" src="https://avatar.iran.liara.run/public" alt="User avatar"></img>
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-white">Sarah Johnson</div>
                                            <div class="text-sm text-neutral-400">sarah@example.com</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-neutral-100 text-neutral-800">
                                        User
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Active
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                    1 hour ago
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button class="text-blue-400 hover:text-blue-500 mr-3">Edit</button>
                                    <button class="text-red-400 hover:text-red-500">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        
    )
}

export default UserManagement
