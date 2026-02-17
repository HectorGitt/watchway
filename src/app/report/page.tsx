"use client";

import { useState } from "react";
import { LocationGuard } from "@/components/report/LocationGuard";
import { CameraCapture } from "@/components/report/CameraCapture";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, CheckCircle2, MapPin } from "lucide-react";
import Link from "next/link";
import { determineJurisdiction } from "@/lib/jurisdiction";
import { api } from "@/lib/api";
import { FadeIn } from "@/components/ui/animations";
import { toast } from "sonner";

type Step = 'location' | 'photo' | 'details' | 'success';

export default function ReportPage() {
    const [step, setStep] = useState<Step>('location');
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [liveImage, setLiveImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form Data
    const [hazardType, setHazardType] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState<string>("Locating...");
    const [jurisdiction, setJurisdiction] = useState<'FEDERAL' | 'STATE' | 'UNKNOWN'>('UNKNOWN');
    const [severity, setSeverity] = useState<number>(3);

    const handleLocation = async (loc: { lat: number; lng: number }) => {
        setCoords(loc);
        setStep('photo');

        // Reverse Geocode
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.lat}&lon=${loc.lng}`);
            const data = await res.json();
            if (data.display_name) {
                // Simplify address (take first 3 parts)
                const simpleAddr = data.display_name.split(',').slice(0, 3).join(',');
                setAddress(simpleAddr);
            } else {
                setAddress(`${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`);
            }
        } catch (e) {
            setAddress(`${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`);
        }
    };

    const handlePhoto = (img: string) => {
        setLiveImage(img);
        setStep('details');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await api.submitReport({
                title: title || hazardType,
                description,
                lat: coords?.lat || 0,
                lng: coords?.lng || 0,
                address: address, // Used detected address
                state: "Lagos", // Ideally this comes from geocode too, but defaulting for now
                live_image_url: liveImage || "",
                severity_level: severity
            });
            setStep('success');
        } catch (err) {
            console.error(err);
            toast.error("Failed to submit report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <Link href="/" className="text-gray-400 hover:text-white">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="font-bold text-lg">New Hazard Report</h1>
                <div className="w-6"></div> {/* Spacer */}
            </div>

            <div className="flex-1 container mx-auto px-4 py-8 max-w-lg">
                {/* Progress Steps */}
                <div className="flex gap-2 mb-8">
                    <div className={`h-1 flex-1 rounded-full ${step !== 'location' ? 'bg-primary' : 'bg-primary/50'}`}></div>
                    <div className={`h-1 flex-1 rounded-full ${['photo', 'details', 'success'].includes(step) ? 'bg-primary' : 'bg-surface-highlight'}`}></div>
                    <div className={`h-1 flex-1 rounded-full ${['details', 'success'].includes(step) ? 'bg-primary' : 'bg-surface-highlight'}`}></div>
                </div>

                {/* Step 1: Location Guard */}
                {step === 'location' && (
                    <LocationGuard onLocationAcquired={handleLocation}>
                        {/* This children prop isn't used in my implementation of LocationGuard, 
                       it renders children only on success, but I am lifting state up. 
                       Wait, my LocationGuard renders children ON SUCCESS.
                       So I need to actually rework this logic slightly or just let it render "Step 2"
                   */}
                        {/* Actually, let's just use the callback to switch steps */}
                        <div className="text-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                            <p>Location Verified!</p>
                            {/* This won't be seen for long as we switch steps */}
                        </div>
                    </LocationGuard>
                )}

                {/* Step 2: Camera Capture */}
                {step === 'photo' && (
                    <FadeIn>
                        <h2 className="text-2xl font-bold mb-2">Proof of Presence</h2>
                        <p className="text-gray-400 mb-6 text-sm">
                            Take a live photo of the hazard. Gallery uploads are disabled to ensure trust.
                        </p>

                        <CameraCapture onCapture={handlePhoto} />

                        <div className="mt-6 flex justify-center">
                            <Button variant="ghost" onClick={() => setStep('location')} className="text-xs text-gray-500">
                                Retake Location
                            </Button>
                        </div>
                    </FadeIn>
                )}

                {/* Step 3: Details */}
                {step === 'details' && (
                    <FadeIn>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                                <img src={liveImage!} alt="Evidence" className="w-full h-full object-cover" />
                                <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white backdrop-blur max-w-[80%] truncate">
                                    <MapPin className="inline-block h-3 w-3 mr-1 text-primary" />
                                    {address}
                                </div>
                            </div>

                            {/* Read-only Address Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Detailed Location</label>
                                <div className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300 text-sm flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    {address}
                                </div>
                            </div>
                            {/* ... Fields ... */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Hazard Type</label>
                                <select
                                    required
                                    className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none transition-all appearance-none cursor-pointer"
                                    value={hazardType}
                                    onChange={(e) => {
                                        const selected = e.target.value;
                                        setHazardType(selected);
                                        if (selected !== "Other") {
                                            setTitle(selected);
                                        } else {
                                            setTitle(""); // Clear title for manual input
                                        }
                                    }}
                                >
                                    <option value="" disabled>Select a Hazard Type</option>
                                    <option value="Deep Pothole">Deep Pothole</option>
                                    <option value="Road Washout / Erosion">Road Washout / Erosion</option>
                                    <option value="Bridge Damage">Bridge Damage / Expansion Joint</option>
                                    <option value="Missing Manhole Cover">Missing Manhole Cover</option>
                                    <option value="Blocked Drainage / Flooding">Blocked Drainage / Flooding</option>
                                    <option value="Collapsed Pole / Street Light">Collapsed Pole / Street Light</option>
                                    <option value="Other">Other</option>
                                </select>

                                {hazardType === "Other" && (
                                    <input
                                        type="text"
                                        required
                                        placeholder="Specify the hazard..."
                                        className="mt-3 w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none transition-all animate-fade-in"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                <textarea
                                    required
                                    placeholder="Describe the danger and impact on traffic..."
                                    className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white h-32 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Severity Level: <span className="text-primary font-bold">{severity}</span>
                                    <span className="text-xs text-gray-500 ml-2 font-normal">
                                        (1 = Low, 5 = Critical)
                                    </span>
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="1"
                                    value={severity}
                                    onChange={(e) => setSeverity(parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                                    <span>Low Impact</span>
                                    <span>High Danger</span>
                                </div>
                            </div>

                            <Button type="submit" disabled={isSubmitting} size="lg" className="w-full text-lg">
                                {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit Verified Report"}
                            </Button>
                        </form>
                    </FadeIn>
                )}

                {/* Step 4: Success */}
                {step === 'success' && (
                    <div className="text-center py-12 animate-fade-in">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Report Submitted!</h2>
                        <p className="text-gray-400 mb-8 max-w-xs mx-auto">
                            Your report has been marked as <span className="text-yellow-500 font-bold">[Unverified]</span> until a nearby user confirms it.
                        </p>

                        <div className="bg-surface p-6 rounded-xl border border-white/5 mb-8">
                            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Next Steps</h3>
                            <div className="flex items-center gap-4 text-left">
                                <div className="bg-white/5 p-3 rounded-lg">
                                    <span className="block text-2xl font-bold text-primary">0</span>
                                    <span className="text-[10px] text-gray-500">Verifications</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-300">Wait for the "Crowdsourced Validation" or share coordinate link.</p>
                                </div>
                            </div>
                        </div>

                        <Link href="/map">
                            <Button variant="outline" className="w-full">Back to Map</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
