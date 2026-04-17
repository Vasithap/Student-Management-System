"use client";

import { useState, useEffect, useCallback } from "react";
import api from "../../lib/axios";

interface Course {
    id: number;
    title: string;
    description: string;
    feeAmount: number;
    durationDays: number;
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [feeAmount, setFeeAmount] = useState<number>(0);
    const [durationDays, setDurationDays] = useState<number>(0);
    const [editingId, setEditingId] = useState<number | null>(null);

    const fetchCourses = useCallback(async () => {
        try {
            let response;
            if (searchQuery.trim() !== "") {
                response = await api.get(`/courses/search?title=${searchQuery}`);
            } else {
                response = await api.get("/courses");
            }
            setCourses(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch courses. Please check your backend connection.");
            setLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingId) {
                await api.put(`/courses/${editingId}`, { title, description, feeAmount, durationDays });
                setEditingId(null);
            } else {
                await api.post("/courses", { title, description, feeAmount, durationDays });
            }
            fetchCourses();
            clearForm();
        } catch (err) {
            alert("Action failed! Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this course?")) {
            try {
                await api.delete(`/courses/${id}`);
                fetchCourses();
            } catch (err) {
                alert("Failed to delete course!");
            }
        }
    };

    const handleEdit = (course: Course) => {
        setTitle(course.title);
        setDescription(course.description);
        setFeeAmount(course.feeAmount ?? 0);
        setDurationDays(course.durationDays ?? 0);
        setEditingId(course.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearForm = () => {
        setTitle("");
        setDescription("");
        setFeeAmount(0);
        setDurationDays(0);
        setEditingId(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-lg font-bold text-black animate-pulse tracking-tight uppercase">Loading Curriculum...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-2xl shadow-sm max-w-lg w-full">
                    <p className="text-black font-bold text-lg uppercase tracking-tight">Error</p>
                    <p className="text-gray-800 font-medium mt-1">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                <div className="mb-10">
                    <h1 className="text-4xl font-black text-black tracking-tighter uppercase">Course Management</h1>
                    <p className="mt-2 text-base text-gray-800 font-bold">Curate, update, and organize the institution's academic courses.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 sticky top-8">
                            <h2 className="text-xl font-black text-black mb-6 border-b-4 border-gray-100 pb-3 uppercase tracking-tight">
                                {editingId ? "Update Course" : "New Course"}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-black text-black mb-1 uppercase tracking-widest">Course Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-400 outline-none text-black font-bold transition-all placeholder-gray-400"
                                        placeholder="e.g. Advanced Mathematics"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-black mb-1 uppercase tracking-widest">Description</label>
                                    <textarea
                                        required
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-400 outline-none text-black font-bold transition-all placeholder-gray-400 resize-none"
                                        rows={5}
                                        placeholder="Outline the course objectives..."
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-black mb-1 uppercase tracking-widest">Course Fee (LKR)</label>
                                    <input
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        required
                                        value={feeAmount}
                                        onChange={(e) => setFeeAmount(Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-400 outline-none text-black font-bold transition-all placeholder-gray-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-black mb-1 uppercase tracking-widest">Duration (days)</label>
                                    <input
                                        type="number"
                                        min={0}
                                        step="1"
                                        required
                                        value={durationDays}
                                        onChange={(e) => setDurationDays(Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-400 outline-none text-black font-bold transition-all placeholder-gray-400"
                                    />
                                </div>

                                <div className="flex flex-col gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 rounded-xl shadow-md text-sm font-black text-black bg-green-400 hover:bg-green-500 active:scale-95 transition-all disabled:opacity-50 uppercase tracking-widest"
                                    >
                                        {isSubmitting ? "Processing..." : (editingId ? "Update Course" : "Confirm Course")}
                                    </button>
                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={clearForm}
                                            className="w-full py-4 rounded-xl text-sm font-black text-black bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 transition-all uppercase tracking-widest"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-6 border-b border-gray-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <h2 className="text-xl font-black text-black uppercase tracking-tight">Academic Directory</h2>
                                <div className="relative w-full sm:w-80">
                                    <input
                                        type="text"
                                        placeholder="Search by title..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-4 pr-10 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-400 outline-none text-black text-sm font-bold transition-all placeholder-gray-400"
                                    />
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-5 text-left text-xs font-black text-black uppercase tracking-[0.2em]">ID</th>
                                        <th className="px-6 py-5 text-left text-xs font-black text-black uppercase tracking-[0.2em] w-1/3">Course Title</th>
                                        <th className="px-6 py-5 text-left text-xs font-black text-black uppercase tracking-[0.2em]">Summary</th>
                                        <th className="px-6 py-5 text-right text-xs font-black text-black uppercase tracking-[0.2em]">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {courses.map((course) => (
                                        <tr key={course.id} className="hover:bg-green-50/50 transition-colors">
                                            <td className="px-6 py-5 whitespace-nowrap text-sm font-black text-gray-900">#{course.id}</td>
                                            <td className="px-6 py-5 whitespace-nowrap text-sm font-black text-black">{course.title}</td>
                                            <td className="px-6 py-5">
                                                <div className="text-sm font-bold text-gray-800 leading-relaxed whitespace-normal break-words max-w-xs md:max-w-md">
                                                    {course.description}
                                                </div>
                                                <div className="mt-2">
                                                    <div className="text-xs font-black text-green-800 uppercase tracking-widest">
                                                        Fee: {course.feeAmount ?? 0} LKR
                                                    </div>
                                                    <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                                                        Duration: {course.durationDays ?? 0} days
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-black">
                                                <div className="flex justify-end gap-4">
                                                    <button
                                                        onClick={() => handleEdit(course)}
                                                        className="text-black hover:text-green-600 transition-colors uppercase tracking-widest text-[10px] border-b-2 border-transparent hover:border-green-600 font-black"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(course.id)}
                                                        className="text-red-600 hover:text-red-800 transition-colors uppercase tracking-widest text-[10px] border-b-2 border-transparent hover:border-red-600 font-black"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {courses.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-20 text-center">
                                                <p className="text-lg font-black text-black uppercase tracking-tight">No Courses Found</p>
                                                <p className="text-sm text-gray-500 font-bold mt-1">Try a different search term or register a new course.</p>
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}