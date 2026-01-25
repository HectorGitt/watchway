import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
                        <ShieldAlert className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        WatchWay<span className="text-primary">.NG</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/map" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Live Map</Link>
                    <Link href="/leaderboard" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Leaderboard</Link>
                    <Link href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">API</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/report">
                        <Button size="sm" className="shadow-lg shadow-orange-900/20">
                            Report Hazard
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
