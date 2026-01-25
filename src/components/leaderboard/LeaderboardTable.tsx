import { StateStat } from "@/lib/leaderboard-data";
import { AlertTriangle, TrendingUp, TrendingDown, CheckCircle } from "lucide-react";

interface LeaderboardTableProps {
    data: StateStat[];
}

export function LeaderboardTable({ data }: LeaderboardTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-white/5 bg-surface/50 backdrop-blur-sm">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="bg-white/5 text-gray-400 border-b border-white/5">
                        <th className="p-4 font-medium uppercase tracking-wider text-xs">Rank</th>
                        <th className="p-4 font-medium uppercase tracking-wider text-xs">State</th>
                        <th className="p-4 font-medium uppercase tracking-wider text-xs text-right">Danger Score</th>
                        <th className="p-4 font-medium uppercase tracking-wider text-xs text-right hidden md:table-cell">Unverified</th>
                        <th className="p-4 font-medium uppercase tracking-wider text-xs text-right hidden md:table-cell">Fixed</th>
                        <th className="p-4 font-medium uppercase tracking-wider text-xs text-right hidden sm:table-cell">Avg Response</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {data.map((state) => (
                        <tr
                            key={state.state}
                            className={`group hover:bg-white/5 transition-colors ${state.danger_score > 80 ? 'bg-red-900/10' : ''}`}
                        >
                            <td className="p-4 font-bold text-gray-500">
                                #{state.rank}
                            </td>
                            <td className="p-4 font-medium text-lg">
                                {state.state}
                                {state.rank <= 3 && state.danger_score > 70 && (
                                    <span className="ml-2 inline-flex items-center rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500 border border-red-500/20">
                                        Critically Poor
                                    </span>
                                )}
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <span className={`text-xl font-bold ${state.danger_score > 80 ? 'text-red-500' :
                                            state.danger_score > 50 ? 'text-orange-500' : 'text-green-500'
                                        }`}>
                                        {state.danger_score}
                                    </span>
                                    {state.danger_score > 80 ? <TrendingUp className="h-4 w-4 text-red-500" /> : <TrendingDown className="h-4 w-4 text-green-500" />}
                                </div>
                            </td>
                            <td className="p-4 text-right hidden md:table-cell text-gray-400">
                                {state.unverified_reports}
                                <span className="block text-[10px] text-gray-600">Pending Validation</span>
                            </td>
                            <td className="p-4 text-right hidden md:table-cell text-gray-400">
                                {state.fixed_reports}
                                <span className="block text-[10px] text-gray-600">Resolved</span>
                            </td>
                            <td className="p-4 text-right hidden sm:table-cell">
                                <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${state.avg_fix_time_days > 30 ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                                    }`}>
                                    {state.avg_fix_time_days} days
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
