"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Users, AlertTriangle, CheckCircle, FileText, UserPlus, ArrowUpRight, Activity, Share2, UserCog, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        total_users: 0,
        total_reports: 0,
        active_hazards: 0,
        pending_coordinators: 0,
        recent_reports: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const token = localStorage.getItem("token") || "";
                const data = await api.getAdminStats(token);
                setStats(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    const statCards = [
        {
            title: "Total Users",
            value: stats.total_users,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            link: "/admin/users"
        },
        {
            title: "Total Reports",
            value: stats.total_reports,
            icon: FileText,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            link: "/admin/reports" // Assuming we'll make this later, or link to map
        },
        {
            title: "Active Hazards",
            value: stats.active_hazards,
            icon: AlertTriangle,
            color: "text-red-500",
            bg: "bg-red-500/10",
            link: "/map"
        },
        {
            title: "Pending Coordinators",
            value: stats.pending_coordinators,
            icon: UserPlus,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
            link: "/admin/users"
        }
    ];

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Activity className="h-8 w-8 text-primary" />
                    System Overview
                </h1>
                <div className="text-sm text-gray-400">
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <Link href={stat.link} key={index} className="block group">
                        <div className="bg-surface border border-white/5 p-6 rounded-xl transition-all hover:border-white/20 hover:bg-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                {stat.title === "Pending Coordinators" && stat.value > 0 && (
                                    <span className="flex h-3 w-3 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 font-medium">{stat.title}</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-3xl font-bold mt-1 text-white group-hover:text-primary transition-colors">
                                        {loading ? "-" : stat.value}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-surface border border-white/5 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Recent Reports</h3>
                        <Link href="/map">
                            <Button variant="ghost" size="sm" className="text-xs">View Map <ArrowUpRight className="ml-1 h-3 w-3" /></Button>
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-8 text-gray-500">Loading activity...</div>
                        ) : stats.recent_reports.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">No recent activity.</div>
                        ) : (
                            stats.recent_reports.map((report: any) => (
                                <div key={report.id} className="flex items-center gap-4 p-4 rounded-lg bg-black/20 border border-white/5">
                                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-white/5 shrink-0">
                                        {report.live_image_url ? (
                                            <img src={report.live_image_url} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center">
                                                <FileText className="h-4 w-4 text-gray-500" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-white truncate">{report.title}</p>
                                                <p className="text-xs text-gray-400 truncate">{report.address}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                {/* X Controls */}
                                                {(report.status === 'verified' || report.status === 'resolved') && (
                                                    <div className="flex items-center gap-1">
                                                        {report.x_post_id ? (
                                                            <Button
                                                                size="sm"
                                                                variant="danger"
                                                                className="h-6 px-2 text-[10px]"
                                                                onClick={async () => {
                                                                    if (!confirm("Delete X post?")) return;
                                                                    try {
                                                                        const token = localStorage.getItem("token") || "";
                                                                        await api.deleteXPost(token, report.id);
                                                                        // Refresh stats
                                                                        const data = await api.getAdminStats(token);
                                                                        setStats(data);
                                                                    } catch (e) { console.error(e); }
                                                                }}
                                                            >
                                                                Delete Post
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-6 px-2 text-[10px] border-white/10 hover:bg-blue-500/20 hover:text-blue-400"
                                                                onClick={async () => {
                                                                    try {
                                                                        const token = localStorage.getItem("token") || "";
                                                                        await api.triggerXPost(token, report.id);
                                                                        // Refresh stats
                                                                        const data = await api.getAdminStats(token);
                                                                        setStats(data);
                                                                    } catch (e) { console.error(e); }
                                                                }}
                                                            >
                                                                Post to X
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}

                                                <div className={`px-2 py-1 rounded text-[10px] uppercase font-bold border h-fit ${report.status === 'resolved' ? 'border-green-500/20 text-green-500 bg-green-500/10' :
                                                    report.status === 'verified' ? 'border-blue-500/20 text-blue-500 bg-blue-500/10' :
                                                        'border-yellow-500/20 text-yellow-500 bg-yellow-500/10'
                                                    }`}>
                                                    {report.status}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-end mt-1">
                                            <span className="text-xs text-gray-500">{new Date(report.created_at).toLocaleDateString()}</span>
                                            {report.x_post_id && (
                                                <span className="text-[10px] text-blue-400 flex items-center gap-1">
                                                    <Share2 className="h-3 w-3" /> Posted {report.x_post_id.substring(0, 8)}...
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions / System Status */}
                <div className="space-y-6">
                    <div className="bg-surface border border-white/5 rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link href="/admin/users">
                                <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5">
                                    <UserCog className="mr-2 h-4 w-4" />
                                    Manage Users
                                </Button>
                            </Link>
                            <Link href="/admin/settings">
                                <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5">
                                    <Settings className="mr-2 h-4 w-4" />
                                    System Settings
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


