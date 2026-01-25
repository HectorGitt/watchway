"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";

interface LocationGuardProps {
    onLocationAcquired: (coords: { lat: number; lng: number }) => void;
    children: React.ReactNode;
}

export function LocationGuard({ onLocationAcquired, children }: LocationGuardProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const requestLocation = () => {
        setStatus('loading');
        setErrorMsg(null);

        if (!navigator.geolocation) {
            setErrorMsg("Geolocation is not supported by your browser.");
            setStatus('error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                onLocationAcquired({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setStatus('success');
            },
            (err) => {
                console.error("Geo Error:", err);
                setErrorMsg("Weak GPS Signal. Please move outdoors.");
                setStatus('error');
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
        );
    };

    if (status === 'success') {
        return <>{children}</>;
    }

    return (
        <div className="p-8 text-center bg-surface border border-white/5 rounded-2xl">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <MapPin className="h-8 w-8" />
            </div>

            <h3 className="text-xl font-bold mb-2">Location Required</h3>
            <p className="text-gray-400 mb-6">
                The "Trust Protocol" requires exact GPS coordinates to verify your report.
            </p>

            {errorMsg && (
                <p className="text-red-500 bg-red-900/10 p-3 rounded-lg mb-4 text-sm font-medium">
                    {errorMsg}
                </p>
            )}

            <Button onClick={requestLocation} disabled={status === 'loading'} size="lg" className="w-full">
                {status === 'loading' ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Acquiring Satellite Fix...
                    </>
                ) : (
                    "Enable Location Access"
                )}
            </Button>
        </div>
    );
}
