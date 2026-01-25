"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, CheckCircle } from "lucide-react";

interface CameraCaptureProps {
    onCapture: (imageData: string) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Start Camera on Mount
    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            setError(null);
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" } // Prefer back camera
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera Error:", err);
            setError("Unable to access camera. Please allow permissions.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext("2d");
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL("image/jpeg");
                setImage(dataUrl);
                onCapture(dataUrl);
                // stopCamera(); // Optional: stop camera after capture? Maybe keep it for retakes.
            }
        }
    };

    const retakePhoto = () => {
        setImage(null);
        if (!stream) {
            startCamera();
        }
    };

    if (error) {
        return (
            <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-xl text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={startCamera} variant="outline" className="border-red-500 text-red-500 hover:bg-red-950">
                    Retry Camera
                </Button>
            </div>
        );
    }

    return (
        <div className="relative w-full aspect-[4/3] bg-black rounded-xl overflow-hidden border border-white/10 shadow-lg">
            {!image ? (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
                        <Button
                            onClick={takePhoto}
                            size="lg"
                            className="rounded-full h-16 w-16 p-0 bg-white hover:bg-gray-200 ring-4 ring-black/50"
                        >
                            <Camera className="h-8 w-8 text-black" />
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <img src={image} alt="Captured Hazard" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="bg-background/90 backdrop-blur p-4 rounded-xl flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-green-500 font-bold justify-center">
                                <CheckCircle className="h-5 w-5" />
                                Photo Captured
                            </div>
                            <Button onClick={retakePhoto} variant="outline" size="sm">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Retake
                            </Button>
                        </div>
                    </div>
                </>
            )}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
