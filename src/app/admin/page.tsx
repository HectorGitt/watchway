"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card"; // Assuming Card exists or I'll use div
import { Users, AlertTriangle, CheckCircle } from "lucide-react";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({ users: 0, reports: 0 });

    useEffect(() => {
        const loadStats = async () => {
            // Mock stats for now or fetch length of lists
            // Assuming we implement a stats endpoint or just fetch lists
            try {
                const token = localStorage.getItem("token") || "";
                const users = await api.getUsers(token);
                // const reports = await api.getReports({ status: 'all' }); // reports might be heavy
                setStats({ users: users.length, reports: 0 });
            } catch (e) {
                console.error(e);
            }
        };
        loadStats();
    }, []);

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold">System Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface border border-white/5 p-6 rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Users</p>
                            <p className="text-2xl font-bold">{stats.users}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-surface border border-white/5 p-6 rounded-xl opacity-50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 rounded-lg text-red-500">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Active Hazards</p>
                            <p className="text-2xl font-bold">--</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-surface border border-white/5 p-8 rounded-xl text-center">
                <p className="text-gray-400">Select <span className="text-white font-bold">User Management</span> from the sidebar to manage roles and suspensions.</p>
            </div>
        </div>
    );
}
