import { Button } from '@/components/ui/button';
import { Network } from 'lucide-react';

export function CTA() {
    return (
        <section className="py-32 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-surface z-0" />

            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full mb-8 backdrop-blur-md">
                    <Network className="h-8 w-8 text-white" />
                </div>

                <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">One Country. One Map.</h2>
                <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12">
                    We are looking for "Coordinators" in all 36 states. Whether you are an engineer, a tech enthusiast, or a frequent traveler, your "Noticing" can save a life.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button size="lg" className="h-16 px-10 text-lg bg-white text-black hover:bg-gray-200 shadow-xl">
                        Join as a Coordinator
                    </Button>
                    <Button variant="outline" size="lg" className="h-16 px-10 text-lg border-white/20 hover:bg-white/10 text-white">
                        Download the App
                    </Button>
                </div>
            </div>
        </section>
    );
}
