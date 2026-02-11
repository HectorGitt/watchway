"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Loader2, Save, Settings, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FadeIn } from "@/components/ui/animations";

type SystemSetting = {
    key: string;
    value: string;
    description?: string;
};

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<SystemSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    const loadSettings = async () => {
        try {
            const token = localStorage.getItem("token") || "";
            const data = await api.getSystemSettings(token);
            setSettings(data);
        } catch (e) {
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const handleSave = async (key: string, value: string, description?: string) => {
        setSaving(key);
        try {
            const token = localStorage.getItem("token") || "";
            await api.updateSystemSetting(token, key, value, description);
            toast.success("Setting updated");
            // Reload to ensure sync
            loadSettings();
        } catch (e) {
            toast.error("Failed to update setting");
        } finally {
            setSaving(null);
        }
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <Settings className="h-8 w-8 text-primary" />
                System Settings
            </h1>

            <FadeIn>
                <div className="grid gap-6">
                    {settings.map((setting) => (
                        <div key={setting.key} className="bg-surface border border-white/5 rounded-xl p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">{formatKey(setting.key)}</h3>
                                    <p className="text-gray-400 text-sm">{setting.description}</p>
                                </div>
                                <div className="bg-white/5 p-2 rounded text-xs text-gray-500 font-mono">
                                    {setting.key}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <input
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                        defaultValue={setting.value}
                                        id={`input-${setting.key}`}
                                    />
                                </div>
                                <Button
                                    onClick={() => {
                                        const input = document.getElementById(`input-${setting.key}`) as HTMLInputElement;
                                        handleSave(setting.key, input.value, setting.description);
                                    }}
                                    disabled={saving === setting.key}
                                >
                                    {saving === setting.key ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Save
                                </Button>
                            </div>
                            {setting.key === 'proximity_radius_km' && (
                                <div className="mt-2 text-xs text-primary flex items-center gap-1">
                                    <Info className="h-3 w-3" />
                                    Values in Kilometers (e.g., 0.5 = 500m)
                                </div>
                            )}
                        </div>
                    ))}

                    {settings.length === 0 && (
                        <div className="text-center text-gray-500 py-10">
                            No settings found.
                        </div>
                    )}
                </div>
            </FadeIn>
        </div>
    );
}

function formatKey(key: string) {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
