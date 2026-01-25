const API_URL = "http://localhost:8000";

export const api = {
    login: async (username: string, password: string) => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        const res = await fetch(`${API_URL}/token`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            throw new Error("Login failed");
        }

        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        return data;
    },

    register: async (username: string, email: string, password: string) => {
        const res = await fetch(`${API_URL}/users/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || "Registration failed");
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
    }
};
