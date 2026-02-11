"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { User } from "@/lib/types";
import { Loader2, Search, UserCog, UserX, Check, X, Shield, ShieldCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("id");
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Modal State
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [newRole, setNewRole] = useState("citizen");

    const loadUsers = async () => {
        try {
            const token = localStorage.getItem("token") || "";
            const data = await api.getUsers(token, { sort_by: sortBy });
            setUsers(data);
        } catch (e) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, [sortBy]);

    const openRoleModal = (user: User) => {
        setSelectedUser(user);
        setNewRole(user.role);
        setIsRoleModalOpen(true);
    };

    const handleSaveRole = async () => {
        if (!selectedUser) return;
        setProcessingId(selectedUser.id);
        try {
            const token = localStorage.getItem("token") || "";
            await api.updateUserRole(token, selectedUser.id, newRole);
            toast.success("User role updated");
            loadUsers();
            setIsRoleModalOpen(false);
        } catch (e) {
            toast.error("Failed to update role");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReviewApplication = async (status: "APPROVED" | "REJECTED") => {
        if (!selectedUser) return;
        setProcessingId(selectedUser.id);
        try {
            const token = localStorage.getItem("token") || "";
            await api.reviewApplication(token, selectedUser.id, status);
            toast.success(`Application ${status.toLowerCase()}`);
            loadUsers(); // Refresh list
            setIsRoleModalOpen(false); // Close modal on success
        } catch (e) {
            toast.error("Failed to review application");
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

                <div className="relative w-full md:w-64 flex gap-2">
                    <select
                        className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-gray-400"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="id" className="bg-black text-white">Default Sort</option>
                        <option value="civic_points" className="bg-black text-white">Highest Trust</option>
                    </select>

                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            className="w-full bg-surface border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-surface border border-white/5 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Trust Score</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <div className="font-bold text-white flex items-center gap-2">
                                                {user.username || "No Name"}
                                                {user.coordinator_application_status === 'PENDING' && (
                                                    <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" title="Application Pending" />
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    {user.role === 'admin' && <span className="text-purple-400 font-bold text-xs uppercase flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Admin</span>}
                                    {user.role === 'coordinator' && <span className="text-blue-400 font-bold text-xs uppercase flex items-center gap-1"><Shield className="h-3 w-3" /> Coordinator</span>}
                                    {user.role === 'citizen' && <span className="text-gray-400 text-xs uppercase">Citizen</span>}
                                </td>
                                <td className="p-4">
                                    <div className="font-mono text-primary font-bold">
                                        {user.civic_points || 0}
                                    </div>
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
                                <td className="p-4 text-right flex items-center justify-end gap-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => openRoleModal(user)}
                                        className="h-8 w-8 p-0"
                                        title="Manage Role"
                                    >
                                        <UserCog className="h-4 w-4 text-gray-400 hover:text-white" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleSuspend(user.id)}
                                        disabled={processingId === user.id}
                                        className={user.is_suspended ? "text-green-500 hover:text-green-400" : "text-red-500 hover:text-red-400"}
                                    >
                                        {user.is_suspended ? "Restore" : "Suspend"}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                title={`Manage User: ${selectedUser?.username}`}
            >
                <div className="space-y-6">
                    {selectedUser?.coordinator_application_status === 'PENDING' && (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                            <h4 className="font-bold text-yellow-500 flex items-center gap-2 mb-2">
                                <Mail className="h-4 w-4" />
                                Coordinator Application Pending
                            </h4>
                            <p className="text-sm text-gray-300 mb-4">
                                This user has applied to become a coordinator. Review their application implicitly by approving or checking their details.
                            </p>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleReviewApplication("APPROVED")} className="bg-green-600 hover:bg-green-700">
                                    Approve Application
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleReviewApplication("REJECTED")} className="border-red-500/50 text-red-500 hover:bg-red-500/10">
                                    Reject
                                </Button>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Change Role Manually</label>
                        <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                        >
                            <option value="citizen" className="bg-black text-white">Citizen</option>
                            <option value="coordinator" className="bg-black text-white">Coordinator</option>
                            <option value="admin" className="bg-black text-white">Admin</option>
                        </select>
                    </div>

                    <Button onClick={handleSaveRole} className="w-full" disabled={!selectedUser || processingId === selectedUser?.id}>
                        {processingId === selectedUser?.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Role
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
