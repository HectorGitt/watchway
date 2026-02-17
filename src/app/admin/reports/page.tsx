"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { FileText, MapPin, Share2, CheckCircle, AlertTriangle, XCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/ui/animations";
import Link from "next/link";

export default function ReportsPage() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const loadReports = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token") || "";
            // Reuse public getReports for now, but in real admin we'd want a dedicated endpoint with more data
            // For MVP, getReports works but filters might need adjustment if we want *all* reports including unverified
            const data = await api.getReports({ search: search, status: filter === 'all' ? undefined : filter });
            setReports(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, [filter]); // Reload when filter changes

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <FileText className="h-8 w-8 text-primary" />
                    Reports Management
                </h1>
                <div className="flex gap-2">
                    <Input
                        placeholder="Search reports..."
                        className="w-64 bg-surface border-white/10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && loadReports()}
                    />
                    <Button onClick={loadReports} variant="outline" className="border-white/10">
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 pb-4 border-b border-white/5 overflow-x-auto">
                {['all', 'unverified', 'verified', 'resolved'].map((status) => (
                    <Button
                        key={status}
                        variant={filter === status ? "default" : "ghost"}
                        onClick={() => setFilter(status)}
                        className="capitalize"
                    >
                        {status}
                    </Button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-surface border border-white/5 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-gray-400">
                        <tr>
                            <th className="p-4 font-medium">Title / ID</th>
                            <th className="p-4 font-medium">Location</th>
                            <th className="p-4 font-medium">Status & Severity</th>
                            <th className="p-4 font-medium">X (Twitter) Monitor</th>
                            <th className="p-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading reports...</td></tr>
                        ) : reports.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">No reports found.</td></tr>
                        ) : (
                            reports.map((report: any) => (
                                <tr key={report.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-white">{report.title}</div>
                                        <div className="text-xs text-gray-500 font-mono">ID: {report.id}</div>
                                        <div className="text-xs text-gray-500">{new Date(report.created_at).toLocaleDateString()}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-start gap-1 text-gray-300">
                                            <MapPin className="h-3 w-3 mt-1 shrink-0 text-primary" />
                                            <span className="truncate max-w-[200px]">{report.address}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">{report.state} ({report.jurisdiction})</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1 items-start">
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${report.status === 'resolved' ? 'border-green-500/20 text-green-500 bg-green-500/10' :
                                                    report.status === 'verified' ? 'border-blue-500/20 text-blue-500 bg-blue-500/10' :
                                                        'border-yellow-500/20 text-yellow-500 bg-yellow-500/10'
                                                }`}>
                                                {report.status}
                                            </span>
                                            <span className="text-xs text-gray-500">Severity: {report.severity_level}/5</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {report.x_post_id ? (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-blue-400 flex items-center gap-1">
                                                    <Share2 className="h-3 w-3" /> Posted
                                                </span>
                                                <span className="text-[10px] text-gray-500 font-mono">ID: {report.x_post_id}</span>
                                                <a
                                                    href={`https://x.com/i/web/status/${report.x_post_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[10px] hover:underline text-gray-400"
                                                >
                                                    View on X
                                                </a>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-600 flex items-center gap-1">
                                                <XCircle className="h-3 w-3" /> Not Posted
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            {report.x_post_id ? (
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    className="h-8 text-xs bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
                                                    onClick={async () => {
                                                        if (!confirm("Delete this post from X?")) return;
                                                        try {
                                                            const token = localStorage.getItem("token") || "";
                                                            await api.deleteXPost(token, report.id);
                                                            loadReports(); // Refresh
                                                        } catch (e) {
                                                            alert("Failed to delete post");
                                                        }
                                                    }}
                                                >
                                                    Delete Post
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 text-xs border-white/10 hover:bg-blue-500/20 hover:text-blue-400"
                                                    disabled={report.status === 'unverified'}
                                                    onClick={async () => {
                                                        try {
                                                            const token = localStorage.getItem("token") || "";
                                                            await api.triggerXPost(token, report.id);
                                                            loadReports(); // Refresh
                                                        } catch (e) {
                                                            alert("Failed to post to X");
                                                        }
                                                    }}
                                                >
                                                    <Share2 className="h-3 w-3 mr-1" /> Post
                                                </Button>
                                            )}
                                        </div>
                                        {report.status === 'unverified' && !report.x_post_id && (
                                            <div className="text-[10px] text-gray-500 mt-1 text-center">
                                                Verify to post
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
