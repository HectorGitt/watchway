const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const api = {
    login: async (email: string, password: string) => {
        const formData = new FormData();
        formData.append("username", email); // OAuth2 expects 'username' field, backend maps this to email
        formData.append("password", password);

        const res = await fetch(`${API_URL}/token`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            if (res.status === 403) {
                throw new Error("Email not verified. Please check your inbox.");
            }
            throw new Error("Login failed");
        }

        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        return data;
        localStorage.setItem("token", data.access_token);
        return data;
    },

    resendVerification: async (email: string) => {
        const res = await fetch(`${API_URL}/resend-verification?email=${encodeURIComponent(email)}`, {
            method: "POST",
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Failed to resend email");
        }
        return res.json();
    },

    register: async (email: string, password: string, username?: string) => {
        const res = await fetch(`${API_URL}/users/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, username }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || "Registration failed");
        }
        return res.json();
    },

    verifyEmail: async (token: string) => {
        const res = await fetch(`${API_URL}/verify/${token}`);
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Verification failed");
        }
        return res.json();
    },

    getReports: async (filters: { status?: string, state?: string, hazard_type?: string, search?: string }) => {
        const params = new URLSearchParams();
        if (filters.status && filters.status !== 'all') params.append("status", filters.status);
        if (filters.state && filters.state !== 'all') params.append("state", filters.state);
        if (filters.hazard_type && filters.hazard_type !== 'all') params.append("hazard_type", filters.hazard_type);
        if (filters.search) params.append("search", filters.search);

        const res = await fetch(`${API_URL}/reports/?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load reports");
        return res.json();
    },

    getReport: async (id: string) => {
        const res = await fetch(`${API_URL}/reports/${id}`);
        if (!res.ok) throw new Error("Report not found");
        return res.json();
    },

    verifyReport: async (id: string, lat?: number, lng?: number) => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const res = await fetch(`${API_URL}/reports/${id}/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ lat, lng }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Verification failed");
        }
        return res.json();
    },

    submitReport: async (reportData: any) => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const res = await fetch(`${API_URL}/reports/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(reportData),
        });

        if (!res.ok) {
            throw new Error("Failed to submit report");
        }
        return res.json();
    },

    resolveReport: async (id: string, afterImageUrl: string, lat?: number, lng?: number) => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const res = await fetch(`${API_URL}/reports/${id}/resolve`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ after_image_url: afterImageUrl, lat, lng }),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Resolution failed");
        }
        return res.json();
    },

    getProfile: async () => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        console.log("API: Fetching profile with token", token.substring(0, 10) + "...");
        const res = await fetch(`${API_URL}/users/me/`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            console.error("API: Profile fetch failed", res.status, res.statusText);
            throw new Error("Failed to load profile");
        }
        return res.json();
    },

    updateProfile: async (data: { username?: string }) => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const res = await fetch(`${API_URL}/users/me/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Failed to update profile");
        }
        return res.json();
    },

    updatePassword: async (data: { old_password: string, new_password: string }) => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const res = await fetch(`${API_URL}/users/me/password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Failed to update password");
        }
        return res.json();
    },

    // --- Admin API ---
    getUsers: async (token: string, filters?: { role?: string, sort_by?: string }) => {
        const params = new URLSearchParams();
        if (filters?.role) params.append("role", filters.role);
        if (filters?.sort_by) params.append("sort_by", filters.sort_by);

        const res = await fetch(`${API_URL}/users/?${params.toString()}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to load users");
        return res.json();
    },

    updateUserRole: async (token: string, userId: string, role: string) => {
        const res = await fetch(`${API_URL}/users/${userId}/role?role=${role}`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to update role");
        return res.json();
    },

    suspendUser: async (token: string, userId: string) => {
        const res = await fetch(`${API_URL}/users/${userId}/suspend`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to suspend user");
        return res.json();
    },

    getSystemSettings: async (token: string) => {
        const res = await fetch(`${API_URL}/admin/settings`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to load settings");
        return res.json();
    },

    updateSystemSetting: async (token: string, key: string, value: string, description?: string) => {
        const res = await fetch(`${API_URL}/admin/settings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ key, value, description }),
        });
        if (!res.ok) throw new Error("Failed to update setting");
        return res.json();
    },

    applyCoordinator: async (token: string) => {
        const res = await fetch(`${API_URL}/users/apply-coordinator`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Application failed");
        }
        return res.json();
    },

    reviewApplication: async (token: string, userId: string, status: "APPROVED" | "REJECTED") => {
        const res = await fetch(`${API_URL}/users/${userId}/review-application?status=${status}`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to review application");
        return res.json();
    },

    getAdminStats: async (token: string) => {
        const res = await fetch(`${API_URL}/admin/stats`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to load admin stats");
        return res.json();
    }
};
