const API_URL = "http://127.0.0.1:8000";

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

    verifyHazard: async (id: string) => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const res = await fetch(`${API_URL}/reports/${id}/verify`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
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

    resolveHazard: async (id: string, afterImageUrl: string) => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const res = await fetch(`${API_URL}/reports/${id}/resolve`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ after_image_url: afterImageUrl })
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

        const res = await fetch(`${API_URL}/users/me/`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to load profile");
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

    // --- Admin API ---
    getUsers: async (token: string, filters?: { role?: string }) => {
        const params = new URLSearchParams();
        if (filters?.role) params.append("role", filters.role);

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
    }
};
