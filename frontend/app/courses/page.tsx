"use client";

import { useState, useEffect, useCallback } from "react";
import api from "../../lib/axios";

interface Course {
    id: number;
    title: string;
    description: string;
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const fetchCourses = useCallback(async () => {
        try {
            const response = await api.get("/courses");
            setCourses(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch courses. Please make sure the backend is running.");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post("/courses", { title, description });
            await fetchCourses();
            setTitle("");
            setDescription("");
        } catch (err) {
            alert("Failed to add course!");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-lg font-bold text-black animate-pulse">Loading courses...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-sm max-w-lg w-full">
                    <p className="text-black font-semibold">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-black tracking-tight">Course Management</h1>
                    <p className="mt-2 text-base text-gray-800 font-medium">Create and organize the curriculum offerings.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
                            <h2 className="text-xl font-bold text-black mb-6 border-b-2 border-gray-100 pb-3">Add New Course</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-black mb-2">Course Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-black sm:text-sm font-medium placeholder-gray-500"
                                        placeholder="e.g. Introduction to React"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-black mb-2">Description</label>
                                    <textarea
                                        required
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-black sm:text-sm font-medium placeholder-gray-500 resize-none"
                                        rows={5}
                                        placeholder="Briefly describe what this course covers..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-black bg-green-400 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Saving Course...' : 'Save Course'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
                            <div className="px-6 py-5 border-b border-gray-200 bg-white">
                                <h2 className="text-xl font-bold text-black">Courses Directory</h2>
                            </div>

                            <div className="overflow-x-auto flex-1">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-extrabold text-black uppercase tracking-wider w-20">ID</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-extrabold text-black uppercase tracking-wider w-1/3">Title</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-extrabold text-black uppercase tracking-wider">Description</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {courses.map((course) => (
                                        <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                #{course.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-black">{course.title}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-800 leading-relaxed whitespace-normal break-words max-w-md">
                                                    {course.description}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {courses.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-16 text-center">
                                                <div className="text-base font-bold text-black">No courses found. Add your first course to get started.</div>
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