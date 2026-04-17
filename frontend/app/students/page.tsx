"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/axios";

interface Course {
    id: number;
    title: string;
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
    course?: Course;
}

export default function StudentsPage() {
    const router = useRouter();
    const [userRole, setUserRole] = useState("");

    const [students, setStudents] = useState<Student[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [nic, setNic] = useState("");
    const [guardianName, setGuardianName] = useState("");
    const [guardianPhone, setGuardianPhone] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState("");

    const [editingId, setEditingId] = useState<number | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const studentUrl = searchQuery ? `/students/search?name=${searchQuery}` : "/students";
            const [studentRes, courseRes] = await Promise.all([
                api.get(studentUrl),
                api.get("/courses")
            ]);
            setStudents(studentRes.data || []);
            setCourses(courseRes.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Connection Refused. Check Backend Service.");
            setLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token) {

            router.push("/login");
        } else if (role !== "ADMIN" && role !== "STAFF") {
            
            alert("Access Denied! Administrator privileges required.");
            router.push("/my-profile");
        } else {

            setUserRole(role);
            fetchData();
        }
    }, [fetchData, router]);

    const handleStudentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const payload = {
            firstName, lastName, email, phone, address, nic, guardianName, guardianPhone,
            course: selectedCourseId ? { id: parseInt(selectedCourseId) } : null
        };

        try {
            if (editingId) {
                await api.put(`/students/${editingId}`, payload);
            } else {
                await api.post("/students", payload);
            }
            await fetchData();
            clearForm();
        } catch (err: any) {
            alert(err.response?.data || "Process Failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("PROCEED WITH PERMANENT RECORD DELETION?")) {
            try {
                await api.delete(`/students/${id}`);
                fetchData();
            } catch (err) {
                alert("Operation Aborted.");
            }
        }
    };

    const handleEdit = (s: Student) => {
        setFirstName(s.firstName || "");
        setLastName(s.lastName || "");
        setEmail(s.email || "");
        setPhone(s.phone || "");
        setAddress(s.address || "");
        setNic(s.nic || "");
        setGuardianName(s.guardianName || "");
        setGuardianPhone(s.guardianPhone || "");
        setSelectedCourseId(s.course?.id?.toString() || "");
        setEditingId(s.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearForm = () => {
        setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setAddress("");
        setNic(""); setGuardianName(""); setGuardianPhone(""); setSelectedCourseId("");
        setEditingId(null);
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push("/login");
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="font-black text-black uppercase tracking-[0.5em] animate-pulse">Syncing Database...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-10 font-mono text-black">
            <div className="max-w-[1500px] mx-auto">

                <header className="mb-10 border-b-4 border-black pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Student Information System</h1>
                        <div className="mt-2 inline-block bg-black text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                            Authenticated as: <span className="text-green-400">{userRole}</span>
                        </div>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="bg-white border-2 border-black px-4 py-2 hidden lg:block">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Registry Count</p>
                            <p className="text-xl font-black">{students.length}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 border-2 border-black text-black px-6 py-2 font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 active:translate-x-1 transition-all"
                        >
                            Log Out
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-10">

                    <section className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex items-center gap-3 mb-8 border-b-2 border-gray-100 pb-4">
                            <div className={`w-4 h-4 border-2 border-black ${editingId ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                            <h2 className="text-xl font-black uppercase tracking-widest">
                                {editingId ? "Update System Record" : "New Enrollment Terminal"}
                            </h2>
                        </div>

                        <form onSubmit={handleStudentSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest">First Name</label>
                                <input value={firstName || ""} onChange={(e) => setFirstName(e.target.value)} className="w-full p-3 border-2 border-black focus:bg-yellow-50 outline-none font-bold" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest">Last Name</label>
                                <input value={lastName || ""} onChange={(e) => setLastName(e.target.value)} className="w-full p-3 border-2 border-black focus:bg-yellow-50 outline-none font-bold" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest">Identity / NIC</label>
                                <input value={nic || ""} onChange={(e) => setNic(e.target.value)} className="w-full p-3 border-2 border-black focus:bg-yellow-50 outline-none font-bold" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest">Digital Mail</label>
                                <input type="email" value={email || ""} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border-2 border-black focus:bg-yellow-50 outline-none font-bold" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest">Contact Phone</label>
                                <input value={phone || ""} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 border-2 border-black focus:bg-yellow-50 outline-none font-bold" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest">Guardian Name</label>
                                <input value={guardianName || ""} onChange={(e) => setGuardianName(e.target.value)} className="w-full p-3 border-2 border-black focus:bg-yellow-50 outline-none font-bold" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest">Guardian Phone</label>
                                <input value={guardianPhone || ""} onChange={(e) => setGuardianPhone(e.target.value)} className="w-full p-3 border-2 border-black focus:bg-yellow-50 outline-none font-bold" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest">Course Assignment</label>
                                <select required value={selectedCourseId || ""} onChange={(e) => setSelectedCourseId(e.target.value)} className="w-full p-3 border-2 border-black bg-white focus:bg-yellow-50 outline-none font-bold">
                                    <option value="">-- UNASSIGNED --</option>
                                    {courses.map((c) => <option key={c.id} value={c.id.toString()}>{c.title}</option>)}
                                </select>
                            </div>
                            <div className="lg:col-span-3 space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest">Residential Location</label>
                                <input value={address || ""} onChange={(e) => setAddress(e.target.value)} className="w-full p-3 border-2 border-black focus:bg-yellow-50 outline-none font-bold" required />
                            </div>
                            <div className="flex gap-2 items-end">
                                <button type="submit" disabled={isSubmitting} className="flex-1 bg-green-400 border-2 border-black p-3 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 transition-all disabled:bg-gray-200">
                                    {isSubmitting ? "WAIT" : (editingId ? "Update" : "Register")}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={clearForm} className="p-3 bg-gray-200 border-2 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1">
                                        ✕
                                    </button>
                                )}
                            </div>
                        </form>
                    </section>

                    <section className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                        <div className="p-6 border-b-2 border-black bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Student Registry Directory</h2>
                            <div className="relative w-full md:w-[450px]">
                                <input
                                    placeholder="SEARCH BY IDENTITY NAME..."
                                    value={searchQuery || ""}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full p-4 pl-12 border-2 border-black bg-white outline-none font-black text-sm shadow-inner"
                                />
                                <span className="absolute left-4 top-4 text-xl grayscale">🔍</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left">
                                <thead className="bg-black text-white uppercase text-[10px] font-black tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Identification</th>
                                    <th className="px-6 py-4">NIC Status</th>
                                    <th className="px-6 py-4">Course Module</th>
                                    <th className="px-6 py-4">Comm Line</th>
                                    <th className="px-6 py-4 text-right">Ops</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-gray-100">
                                {students.map((s) => (
                                    <tr key={s.id} className="hover:bg-yellow-50 transition-colors">
                                        <td className="px-6 py-6">
                                            <div className="font-black text-lg uppercase leading-none">{s.firstName} {s.lastName}</div>
                                            <div className="text-[10px] text-blue-600 font-bold mt-1 uppercase">{s.email}</div>
                                        </td>
                                        <td className="px-6 py-6 font-bold tracking-widest">
                                            {s.nic}
                                        </td>
                                        <td className="px-6 py-6">
                                                <span className="px-3 py-1 border-2 border-black bg-white font-black text-[10px] uppercase tracking-tighter">
                                                    {s.course?.title || "Pending"}
                                                </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="text-xs font-bold uppercase">{s.phone}</div>
                                            <div className="text-[9px] text-gray-400 font-bold uppercase italic">GRD: {s.guardianName}</div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex justify-end gap-6">
                                                <button onClick={() => handleEdit(s)} className="text-[10px] font-black border-b-2 border-black hover:text-blue-600">MODIFY</button>
                                                {userRole === "ADMIN" && (
                                                    <button onClick={() => handleDelete(s.id)} className="text-[10px] font-black text-red-600 border-b-2 border-red-600 hover:text-red-800">PURGE</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            {students.length === 0 && (
                                <div className="p-20 text-center text-gray-300 font-black uppercase tracking-[1em] italic">
                                    Zero Results
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}