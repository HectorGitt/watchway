"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Award, ShieldCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Modal } from "@/components/ui/modal";
import { Edit2, Lock, Save } from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

    // Form states
    const [newUsername, setNewUsername] = useState("");
    const [passwordForm, setPasswordForm] = useState({ old_password: "", new_password: "", confirm_password: "" });

    useEffect(() => {
        console.log("ProfilePage: Fetching profile...");
        api.getProfile()
            .then(u => {
                console.log("ProfilePage: Profile loaded", u);
                setUser(u);
                setNewUsername(u.username);
            })
            .catch((err) => {
                console.error("ProfilePage: Failed to load profile", err);
                router.push('/login');
            })
            .finally(() => {
                console.log("ProfilePage: Loading finished");
                setLoading(false);
            });
    }, [router]);

    const handleUpdateProfile = async () => {
        setIsSaving(true);
        try {
            const updatedUser = await api.updateProfile({ username: newUsername });
            setUser(updatedUser);
            toast.success("Profile updated successfully!");
            setIsEditModalOpen(false);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordForm.new_password !== passwordForm.confirm_password) {
            toast.error("New passwords do not match");
            return;
        }
        setIsSaving(true);
        try {
            await api.updatePassword({
                old_password: passwordForm.old_password,
                new_password: passwordForm.new_password
            });
            toast.success("Password changed successfully!");
            setIsPasswordModalOpen(false);
            setPasswordForm({ old_password: "", new_password: "", confirm_password: "" });
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur z-50">
                <button onClick={() => router.back()} className="text-gray-400 hover:text-white">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="font-bold text-lg">My Profile</h1>
                <div className="w-6"></div>
            </div>

            <div className="container mx-auto px-4 pt-8 max-w-2xl">
                <FadeIn>
                    {/* User Card */}
                    <div className="bg-surface border border-white/5 rounded-2xl p-6 mb-8 flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                        <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                            <span className="text-3xl font-bold text-primary">{user.username?.[0]?.toUpperCase() || "U"}</span>
                        </div>

                        {/* Editable Username */}
                        <div className="flex items-center gap-2 mb-1 justify-center relative group">
                            <h2 className="text-2xl font-bold">{user.username || "Citizen"}</h2>
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="p-1.5 rounded-full bg-white/5 hover:bg-primary/20 text-gray-400 hover:text-primary transition-all"
                                title="Edit Profile"
                            >
                                <Edit2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">{user.email}</p>

                        <div className="flex gap-2">
                            {user.role === 'admin' ? (
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wide">
                                    <ShieldCheck className="h-3 w-3" />
                                    Administrator
                                </div>
                            ) : user.role === 'coordinator' ? (
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wide">
                                    <ShieldCheck className="h-3 w-3" />
                                    Coordinator
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wide">
                                    <ShieldCheck className="h-3 w-3" />
                                    {user.is_verified ? "Verified Citizen" : "Unverified"}
                                </div>
                            )}

                            <button
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 text-xs font-bold uppercase tracking-wide transition-colors"
                            >
                                <Lock className="h-3 w-3" />
                                Password
                            </button>
                        </div>

                        {/* Coordinator Application Section */}
                        {user.role === 'citizen' && (
                            <div className="mt-6 pt-6 border-t border-white/5">
                                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                    Become a Coordinator
                                </h3>
                                <p className="text-gray-400 text-sm mb-4">
                                    Coordinators help verify reports and manage fixes in their state.
                                    {user.coordinator_application_status === 'NONE'
                                        ? " Apply to help your community."
                                        : " Your application is under review."}
                                </p>

                                {user.coordinator_application_status === 'NONE' && (
                                    <Button
                                        onClick={() => setIsApplyModalOpen(true)}
                                        className="w-full sm:w-auto"
                                    >
                                        Apply Now
                                    </Button>
                                )}

                                {user.coordinator_application_status === 'PENDING' && (
                                    <div className="bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-lg text-sm font-medium border border-yellow-500/20 inline-block">
                                        Application Pending Review
                                    </div>
                                )}

                                {user.coordinator_application_status === 'REJECTED' && (
                                    <div className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg text-sm font-medium border border-red-500/20 inline-block">
                                        Application Rejected
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-surface p-5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                <Award className="h-4 w-4 text-yellow-500" />
                                Civic Points
                            </div>
                            <p className="text-3xl font-bold text-white">{user.civic_points}</p>
                        </div>
                        <div className="bg-surface p-5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                Reports Submitted
                            </div>
                            <p className="text-3xl font-bold text-white">{user.reports?.length || 0}</p>
                        </div>
                    </div>

                    {/* Report History */}
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Report History
                    </h3>

                    {(!user.reports || user.reports.length === 0) ? (
                        <div className="text-center py-12 text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                            <p>No reports yet. Start checking your roads!</p>
                            <Link href="/report">
                                <Button className="mt-4" variant="outline">Submit First Report</Button>
                            </Link>
                        </div>
                    ) : (
                        <StaggerContainer className="space-y-3">
                            {user.reports.map((report: any) => (
                                <StaggerItem key={report.id}>
                                    <div className="bg-surface p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors flex gap-4">
                                        <div className="h-12 w-12 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                                            {report.live_image_url ? (
                                                <img src={report.live_image_url} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-600">
                                                    <AlertTriangle className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-medium text-white truncate pr-2">{report.title}</h4>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${report.status === 'verified'
                                                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                                    : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {report.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 truncate">{report.address}</p>
                                            <p className="text-[10px] text-gray-600 mt-1">
                                                {new Date(report.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    )}
                </FadeIn>
            </div>

            {/* Edit Profile Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Profile"
            >
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Username</label>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                            placeholder="Enter username"
                        />
                    </div>
                    <Button onClick={handleUpdateProfile} className="w-full" disabled={isSaving}>
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Save Changes</>}
                    </Button>
                </div>
            </Modal>

            {/* Password Change Modal */}
            <Modal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                title="Change Password"
            >
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Current Password</label>
                        <input
                            type="password"
                            value={passwordForm.old_password}
                            onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">New Password</label>
                        <input
                            type="password"
                            value={passwordForm.new_password}
                            onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Confirm New Password</label>
                        <input
                            type="password"
                            value={passwordForm.confirm_password}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                    <Button onClick={handleChangePassword} className="w-full" disabled={isSaving}>
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Password"}
                    </Button>
                </div>
            </Modal>

            {/* Apply Coordinator Modal */}
            <Modal
                isOpen={isApplyModalOpen}
                onClose={() => setIsApplyModalOpen(false)}
                title="Apply for Coordinator"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-400">
                        Coordinators play a key role in verifying hazards and managing community safety.
                        By applying, you agree to:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-400 space-y-1 ml-2">
                        <li>Verify reports in your local area</li>
                        <li>Act responsibly and honestly</li>
                        <li>Follow community guidelines</li>
                    </ul>
                    <div className="pt-4 flex gap-3">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setIsApplyModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="w-full"
                            onClick={async () => {
                                setIsSaving(true);
                                try {
                                    const token = localStorage.getItem("token") || "";
                                    await api.applyCoordinator(token);
                                    toast.success("Application submitted successfully!");
                                    // Refresh profile
                                    const updated = await api.getProfile();
                                    setUser(updated);
                                    setIsApplyModalOpen(false);
                                } catch (e: any) {
                                    toast.error(e.message);
                                } finally {
                                    setIsSaving(false);
                                }
                            }}
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Application"}
                        </Button>
                    </div>
                </div>
            </Modal >
        </div >
    );
}
