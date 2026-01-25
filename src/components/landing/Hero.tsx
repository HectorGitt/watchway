import { ArrowRight, MapPin, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-background pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                {/* Live Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm animate-fade-in hover:border-primary/50 transition-colors cursor-default">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-sm font-medium text-gray-300">Live: 2,403 Hazards Reported Today</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8">
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        Mapping Every Pothole.
                    </span>
                    <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-600">
                        Tracking Every Fix.
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
                    From Lagos to Maiduguri, our roads are failing us. We are building Nigeria’s first unified database of <span className="text-white font-medium">catastrophic infrastructure damage</span>.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/report">
                        <Button size="lg" className="w-full sm:w-auto h-14 text-lg">
                            <ShieldAlert className="mr-2 h-5 w-5" />
                            Report a Hazard
                        </Button>
                    </Link>
                    <Link href="/map">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 text-lg group">
                            <MapPin className="mr-2 h-5 w-5" />
                            Explore the National Map
                            <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Button>
                    </Link>
                </div>

                {/* Stats / Trust items could go here */}
            </div>
        </section>
    );
}
