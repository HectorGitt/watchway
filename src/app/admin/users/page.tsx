"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { User } from "@/lib/types";
import { Loader2, Search, ShieldAlert, UserCog, UserX, Check, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [processingId, setProcessingId] = useState<string | null>(null);

    const loadUsers = async () => {
        try {
            const token = localStorage.getItem("token") || "";
            const data = await api.getUsers(token);
            setUsers(data);
        } catch (e) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleRoleChange = async (userId: string, newRole: string) => {
        setProcessingId(userId);
        try {
            const token = localStorage.getItem("token") || "";
            await api.updateUserRole(token, userId, newRole);
            toast.success("User role updated");
            loadUsers(); // Refresh list
        } catch (e) {
            toast.error("Failed to update role");
        } finally {
            setProcessingId(null);
        }
    };

    const handleSuspend = async (userId: string) => {
        setProcessingId(userId);
        try {
            const token = localStorage.getItem("token") || "";
            const updatedUser = await api.suspendUser(token, userId);
            toast.success(updatedUser.is_suspended ? "User suspended" : "User restored");
            // Update local state faster
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_suspended: updatedUser.is_suspended } : u));
        } catch (e) {
            toast.error("Failed to toggle suspension");
        } finally {
            setProcessingId(null);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.username?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-8 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <UserCog className="h-8 w-8 text-primary" />
                    User Management
                </h1>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        className="w-full bg-surface border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-surface border border-white/5 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-white">{user.username || "No Name"}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </td>
                                <td className="p-4">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        disabled={processingId === user.id}
                                        className="bg-black border border-white/10 rounded px-2 py-1 text-sm bg-transparent focus:border-primary"
                                    >
                                        <option value="citizen">Citizen</option>
                                        <option value="coordinator">Coordinator</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1">
                                        {user.is_suspended && (
                                            <span className="inline-flex items-center gap-1 text-xs text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded w-fit">
                                                <X className="h-3 w-3" /> Suspended
                                            </span>
                                        )}
                                        {user.is_verified ? (
                                            <span className="inline-flex items-center gap-1 text-xs text-green-500 w-fit">
                                                <Check className="h-3 w-3" /> Verified
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-500">Unverified</span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleSuspend(user.id)}
                                        disabled={processingId === user.id}
                                        className={user.is_suspended ? "text-green-500 hover:text-green-400 hover:bg-green-500/10" : "text-red-500 hover:text-red-400 hover:bg-red-500/10"}
                                    >
                                        {processingId === user.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : user.is_suspended ? (
                                            "Restore"
                                        ) : (
                                            "Suspend"
                                        )}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No users found.
                    </div>
                )}
            </div>
        </div>
    );
}
