import { Shield, ShieldAlert, CheckCircle2 } from "lucide-react";
import { FadeIn } from "@/components/ui/animations";

export function RoleExplainer() {
    return (
        <section className="py-20 bg-black/40 border-y border-white/5">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Two Ways to Serve</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        WatchWay relies on a trust-based ecosystem. Whether you report hazards or verify them, you are saving lives.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Citizen Role */}
                    <FadeIn delay={0.1}>
                        <div className="bg-surface border border-white/10 p-8 rounded-2xl h-full hover:border-primary/50 transition-colors group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <ShieldAlert className="h-32 w-32" />
                            </div>

                            <div className="inline-flex p-3 rounded-xl bg-orange-500/10 text-orange-500 mb-6">
                                <ShieldAlert className="h-8 w-8" />
                            </div>

                            <h3 className="text-2xl font-bold mb-4">The Citizen</h3>
                            <p className="text-gray-400 mb-6">
                                The eyes of the nation. You spot potential disasters before they happen.
                            </p>

                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                                    <span>Snap & Report hazards instantly.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                                    <span>Earn <span className="text-white font-bold">Civic Points</span> for every verified report.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                                    <span>Track fix progress in real-time.</span>
                                </li>
                            </ul>
                        </div>
                    </FadeIn>

                    {/* Coordinator Role */}
                    <FadeIn delay={0.2}>
                        <div className="bg-surface border border-white/10 p-8 rounded-2xl h-full hover:border-blue-500/50 transition-colors group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Shield className="h-32 w-32" />
                            </div>

                            <div className="inline-flex p-3 rounded-xl bg-blue-500/10 text-blue-500 mb-6">
                                <Shield className="h-8 w-8" />
                            </div>

                            <h3 className="text-2xl font-bold mb-4">The Coordinator</h3>
                            <p className="text-gray-400 mb-6">
                                Trusted community leaders who verify reports and liaise with authorities.
                            </p>

                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                    <span>Verify incoming reports for accuracy.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                    <span>Mark hazards as <span className="text-green-400 font-bold">Resolved</span> when fixed.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                    <span>Manage urgency for your assigned State.</span>
                                </li>
                            </ul>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
