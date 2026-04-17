"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [role, setRole] = useState<string>("");
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedRole = localStorage.getItem("role");
        setHasToken(!!token);
        setRole(storedRole ?? "");
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    const dashboardPath = role === "STUDENT" ? "/my-profile" : "/dashboard";

    return (
        <header className="w-full border-b border-black/10 bg-white/70 backdrop-blur">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                <Link href="/" className="text-lg font-black uppercase tracking-widest text-black">
                    SMS
                </Link>

                <nav className="flex items-center gap-4 text-sm font-bold">
                    {hasToken ? (
                        <>
                            <Link href={dashboardPath} className="hover:text-green-700 transition-colors">
                                Dashboard
                            </Link>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="hover:text-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="hover:text-green-700 transition-colors">
                            Login
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}

