"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert, User, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                setIsLoggedIn(true);
                try {
                    const profile = await api.getProfile();
                    if (profile.role === 'admin') {
                        setIsAdmin(true);
                    }
                } catch (e) {
                    console.error("Failed to fetch profile", e);
                }
            }
        };
        checkAuth();
    }, []);

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
                    <Link href="/hazards" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Database</Link>
                    <Link href="/leaderboard" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Leaderboard</Link>
                    {isAdmin && (
                        <Link href="/admin" className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                            <ShieldCheck className="h-4 w-4" />
                            Admin Panel
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <Link href="/profile">
                            <Button variant="ghost" size="sm" className="hidden sm:inline-flex gap-2">
                                <User className="h-4 w-4" />
                                My Profile
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                                Sign In
                            </Button>
                        </Link>
                    )}

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
