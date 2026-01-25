import { Map, Trophy, Database, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Features() {
    const features = [
        {
            icon: Map,
            title: 'The "Danger Zone" Alerts',
            description: 'Real-time data for interstate travelers to know which routes have catastrophic washouts or missing manholes before they start their journey.',
            action: 'View Map',
            href: '/map'
        },
        {
            icon: Trophy,
            title: 'The Accountability Leaderboard',
            description: 'We rank Nigeria’s 36 states based on response times and repair rates. Who is working? Who is sleeping? The data tells the truth.',
            action: 'See Rankings',
            href: '#'
        },
        {
            icon: Database,
            title: 'API for Activists',
            description: 'Open data for civil society organizations (CSOs) to use during budget defense sessions at the National Assembly. Connect our data to your advocacy.',
            action: 'Read Documentation',
            href: '#'
        }
    ];

    return (
        <section className="py-32 bg-background relative">
            <div className="container mx-auto px-4">
                <div className="mb-20">
                    <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Our Solution</span>
                    <h2 className="text-4xl md:text-5xl font-bold max-w-2xl leading-tight">
                        Tools to Enforce <br /> <span className="text-primary">Public Accountability.</span>
                    </h2>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex flex-col items-start">
                            <div className="mb-6 p-4 rounded-full bg-surface border border-white/10 text-primary">
                                <feature.icon className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                            <p className="text-gray-400 mb-8 leading-relaxed flex-grow">
                                {feature.description}
                            </p>
                            <Link href={feature.href}>
                                <Button variant="ghost" className="p-0 hover:bg-transparent hover:text-primary group">
                                    {feature.action}
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
