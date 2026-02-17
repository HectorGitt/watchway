import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { MOOCK_LEADERBOARD } from "@/lib/leaderboard-data";
import { Trophy, AlertTriangle } from "lucide-react";

export default function LeaderboardPage() {
    // Sort logic handled in data or here if dynamic. Mock data is pre-sorted.
    // highlight the best state (highest safety score)
    const bestState = [...MOOCK_LEADERBOARD].sort((a, b) => b.safety_score - a.safety_score)[0];
    const safetyScore = bestState.safety_score;

    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />

            <section className="pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                        <div>
                            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block animate-fade-in">Transparency</span>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">Community Impact <span className="text-primary">Tracker</span>.</h1>
                            <p className="text-gray-400 text-lg max-w-2xl">
                                We track every report, every verify, and every fix. See which states are leading the way in infrastructure maintenance and rapid response.
                            </p>
                        </div>

                        {/* Highlight Card for #1 Best */}
                        <div className="bg-green-900/10 border border-green-500/30 p-6 rounded-2xl md:w-80 backdrop-blur-sm animate-pulse">
                            <div className="flex items-center gap-2 text-green-500 font-bold mb-2 text-xs uppercase tracking-widest">
                                <Trophy className="h-4 w-4" />
                                Top Performing State
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{bestState.state}</div>
                            <p className="text-sm text-green-300">
                                {safetyScore}/100 Safety Score
                            </p>
                            <div className="mt-4 text-xs text-gray-400">
                                {bestState.fixed_reports} hazards resolved this month.
                            </div>
                        </div>
                    </div>

                    <LeaderboardTable data={MOOCK_LEADERBOARD} />

                    <div className="mt-12 text-center p-8 bg-surface rounded-xl border border-white/5">
                        <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">How is this calculated?</h3>
                        <p className="text-gray-400 max-w-2xl mx-auto text-sm">
                            The <strong>Danger Score</strong> is a composite metric derived from the total number of unverified/unfixed hazards, the average response time for verified reports, and the density of "High Severity" ratings (e.g., collapsed bridges).
                        </p>
                    </div>
                </div>
            </section>

            <div className="mt-auto">
                <Footer />
            </div>
        </main>
    );
}
