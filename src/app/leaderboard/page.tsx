import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { MOOCK_LEADERBOARD } from "@/lib/leaderboard-data";
import { Trophy, AlertTriangle } from "lucide-react";

export default function LeaderboardPage() {
    // Sort logic handled in data or here if dynamic. Mock data is pre-sorted.
    const worstState = MOOCK_LEADERBOARD[0];

    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />

            <section className="pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                        <div>
                            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block animate-fade-in">Public Accountability</span>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">The Leaderboard of <span className="text-red-600">Shame</span>.</h1>
                            <p className="text-gray-400 text-lg max-w-2xl">
                                We track every report, every verify, and every fix. See which states are working for their people, and which are sleeping on the job.
                            </p>
                        </div>

                        {/* Highlight Card for #1 Worst */}
                        <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-2xl md:w-80 backdrop-blur-sm animate-pulse">
                            <div className="flex items-center gap-2 text-red-500 font-bold mb-2 text-xs uppercase tracking-widest">
                                <AlertTriangle className="h-4 w-4" />
                                Highest Danger Density
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{worstState.state}</div>
                            <p className="text-sm text-red-300">
                                {worstState.danger_score}/100 Danger Score
                            </p>
                            <div className="mt-4 text-xs text-gray-400">
                                {worstState.unverified_reports} unverified hazards pending.
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
