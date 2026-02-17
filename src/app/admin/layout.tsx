"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";
import { Loader2, LayoutDashboard, Users, LogOut, ShieldAlert, Settings, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const profile = await api.getProfile();
                if (profile.role !== "admin") {
                    router.push("/");
                    return;
                }
                setLoading(false);
            } catch (e) {
                router.push("/login");
            }
        };
        checkAuth();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white"><Loader2 className="animate-spin" /></div>;

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
        { href: "/admin/users", label: "User Management", icon: Users },
        { href: "/admin/settings", label: "System Settings", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-black hidden md:flex flex-col fixed h-full">
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-2 text-primary font-bold text-xl">
                        <ShieldAlert className="h-6 w-6" />
                        <span>WatchWay Admin</span>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={`w-full justify-start gap-3 ${isActive ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-white/5">
                    <Button variant="outline" className="w-full justify-start gap-3 border-white/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-1 md:ml-64 overflow-auto min-h-screen">
                {children}
            </main>
        </div>
    );
}
