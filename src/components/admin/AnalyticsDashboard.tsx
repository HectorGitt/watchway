"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { FadeIn } from "@/components/ui/animations";
import { Loader2 } from "lucide-react";

interface AnalyticsData {
    growth: { date: string, users: number, reports: number }[];
    distribution: { name: string, value: number }[];
    status: { name: string, value: number }[];
}

interface AnalyticsDashboardProps {
    data: AnalyticsData | null;
    loading: boolean;
}

const COLORS = ['#FF5500', '#0088FE', '#00C49F', '#FFBB28'];

export function AnalyticsDashboard({ data, loading }: AnalyticsDashboardProps) {
    if (loading) {
        return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (!data) return <div>No data available</div>;

    return (
        <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Growth Chart */}
                <Card className="bg-surface border-white/5">
                    <CardHeader>
                        <CardTitle className="text-lg">Platform Growth (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.growth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="date" stroke="#888" fontSize={12} />
                                <YAxis stroke="#888" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="users" stroke="#00A3FF" strokeWidth={2} name="Users" />
                                <Line type="monotone" dataKey="reports" stroke="#FF5500" strokeWidth={2} name="Reports" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Status Distribution */}
                <Card className="bg-surface border-white/5">
                    <CardHeader>
                        <CardTitle className="text-lg">Hazard Resolution Status</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.status} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                <XAxis type="number" stroke="#888" fontSize={12} />
                                <YAxis dataKey="name" type="category" stroke="#888" fontSize={12} width={100} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="value" fill="#FF5500" radius={[0, 4, 4, 0]}>
                                    {data.status.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Hazard Types / Jurisdiction */}
                <Card className="bg-surface border-white/5 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Reports by Jurisdiction</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex justify-center">
                        <ResponsiveContainer width="100%" height="100%" className="max-w-md">
                            <PieChart>
                                <Pie
                                    data={data.distribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === 'FEDERAL' ? '#DC2626' : '#F97316'} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-col justify-center gap-4 ml-8">
                            {data.distribution.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${entry.name === 'FEDERAL' ? 'bg-red-600' : 'bg-orange-500'}`} />
                                    <span className="text-sm text-gray-300">{entry.name}: {entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </FadeIn>
    );
}
