"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/axios";

export default function LoginPage() {
    // username = email, password = NIC
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", { username, password });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("role", response.data.role);

            if (response.data.role === "STUDENT") {
                router.push("/my-profile");
            } else {
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError("Authentication failed. Invalid credentials provided.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-sans">
            <div className="bg-white p-10 border-2 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">

                <header className="text-center mb-10">
                    <h1 className="text-3xl font-black text-black uppercase tracking-tighter italic">System Access</h1>
                    <div className="h-1 w-20 bg-black mx-auto mt-2"></div>
                    <p className="text-[10px] font-black text-gray-500 mt-4 uppercase tracking-[0.2em]">Institutional Management Portal</p>
                </header>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border-2 border-red-600 text-red-600 text-xs font-black uppercase tracking-tight">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Email Address</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 bg-gray-50 border-2 border-gray-300 rounded focus:border-black outline-none transition-all font-bold text-black text-sm"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">NIC Number</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-gray-50 border-2 border-gray-300 rounded focus:border-black outline-none transition-all font-bold text-black text-sm"
                            placeholder="NIC used at registration"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-400 border-2 border-black text-black p-4 rounded font-black uppercase text-xs tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-green-500 transition active:translate-y-1 active:shadow-none disabled:bg-gray-200 disabled:shadow-none mt-4"
                    >
                        {loading ? "Verifying..." : "Initialize Session"}
                    </button>
                </form>

                <footer className="mt-10 text-center space-y-1">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        Students: use your registered Email + NIC
                    </p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        Staff/Admin: use your assigned credentials
                    </p>
                </footer>
            </div>
        </div>
    );
}