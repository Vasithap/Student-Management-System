"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/axios";

interface Course {
    id: number;
    title: string;
    description: string;
    feeAmount: number;
    durationDays: number;
}

interface Student {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    nic: string;
    guardianName: string;
    guardianPhone: string;
    profileLocked?: boolean;
    course?: Course | null;
}

export default function MyProfilePage() {
    const router = useRouter();
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const [editPhone, setEditPhone] = useState("");
    const [editAddress, setEditAddress] = useState("");
    const [editGuardianName, setEditGuardianName] = useState("");
    const [editGuardianPhone, setEditGuardianPhone] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token) {
            router.push("/login");
            return;
        }

        if (role !== "STUDENT") {
            router.push("/dashboard");
            return;
        }

        const fetchMe = async () => {
            try {
                const res = await api.get("/students/me");
                setStudent(res.data);
                setEditPhone(res.data.phone || "");
                setEditAddress(res.data.address || "");
                setEditGuardianName(res.data.guardianName || "");
                setEditGuardianPhone(res.data.guardianPhone || "");
            } catch (err: any) {
                setError(err.response?.data || "Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchMe();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-lg font-bold text-black animate-pulse uppercase tracking-widest">
                    Loading Profile...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-xl shadow-sm max-w-lg w-full">
                    <p className="text-black font-bold text-lg uppercase tracking-tight">Error</p>
                    <p className="text-gray-800 font-medium mt-1">{error}</p>
                </div>
            </div>
        );
    }

    if (!student) return null;

    const course = student.course ?? null;
    const isLocked = student.profileLocked === true;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLocked) return;
        setSaving(true);
        try {
            const res = await api.put("/students/me", {
                phone: editPhone,
                address: editAddress,
                guardianName: editGuardianName,
                guardianPhone: editGuardianPhone,
            });
            setStudent(res.data);
        } catch (err: any) {
            setError(err.response?.data || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h1 className="text-3xl font-black text-black uppercase tracking-tighter">
                        My Profile
                    </h1>
                    <p className="mt-2 text-gray-700 font-bold">
                        Welcome, {student.firstName} {student.lastName}
                    </p>

                    <form onSubmit={handleSave} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Email</p>
                            <p className="text-sm font-bold text-black">{student.email}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Phone</p>
                            {isLocked ? (
                                <p className="text-sm font-bold text-black">{student.phone}</p>
                            ) : (
                                <input
                                    className="w-full p-2 border border-gray-300 rounded text-sm font-bold"
                                    value={editPhone}
                                    onChange={(e) => setEditPhone(e.target.value)}
                                    required
                                />
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-widest text-gray-500">NIC</p>
                            <p className="text-sm font-bold text-black">{student.nic}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Guardian</p>
                            {isLocked ? (
                                <p className="text-sm font-bold text-black">
                                    {student.guardianName} ({student.guardianPhone})
                                </p>
                            ) : (
                                <div className="space-y-1">
                                    <input
                                        className="w-full p-2 border border-gray-300 rounded text-sm font-bold"
                                        value={editGuardianName}
                                        onChange={(e) => setEditGuardianName(e.target.value)}
                                        placeholder="Guardian name"
                                        required
                                    />
                                    <input
                                        className="w-full p-2 border border-gray-300 rounded text-sm font-bold"
                                        value={editGuardianPhone}
                                        onChange={(e) => setEditGuardianPhone(e.target.value)}
                                        placeholder="Guardian phone"
                                        required
                                    />
                                </div>
                            )}
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Address</p>
                            {isLocked ? (
                                <p className="text-sm font-bold text-black break-words">{student.address}</p>
                            ) : (
                                <textarea
                                    className="w-full p-2 border border-gray-300 rounded text-sm font-bold"
                                    value={editAddress}
                                    onChange={(e) => setEditAddress(e.target.value)}
                                    rows={3}
                                    required
                                />
                            )}
                        </div>
                        {!isLocked && (
                            <div className="md:col-span-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2 bg-green-500 text-black font-black text-xs uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:bg-gray-300"
                                >
                                    {saving ? "Saving..." : "Save Details (One Time)"}
                                </button>
                            </div>
                        )}
                        {isLocked && (
                            <div className="md:col-span-2 text-right text-[10px] font-black uppercase tracking-widest text-gray-500">
                                Profile locked. Contact admin for further changes.
                            </div>
                        )}
                    </form>
                </div>

                <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-2xl font-black text-black uppercase tracking-tight">
                        My Course
                    </h2>

                    {course ? (
                        <div className="mt-5 space-y-3">
                            <p className="text-lg font-black text-black">{course.title}</p>
                            <p className="text-sm font-bold text-gray-700 break-words">{course.description}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                                <div className="space-y-1">
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-500">Course Fee</p>
                                    <p className="text-sm font-black text-black">
                                        {course.feeAmount ?? 0} LKR
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-500">Duration</p>
                                    <p className="text-sm font-black text-black">
                                        {course.durationDays ?? 0} days
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-5 text-gray-600 font-bold uppercase tracking-tight">
                            Course not assigned yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

