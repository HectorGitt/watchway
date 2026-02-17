"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const token = localStorage.getItem("token") || "";
                const res = await api.getAnalytics(token);
                setData(res);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadAnalytics();
    }, []);

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                System Analytics
            </h1>
            <p className="text-gray-400">Platform performance and user engagement metrics.</p>

            <AnalyticsDashboard data={data} loading={loading} />
        </div>
    );
}
