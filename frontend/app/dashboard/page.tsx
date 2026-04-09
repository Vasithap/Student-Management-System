"use client";

import { useState, useEffect } from "react";
import api from "../../lib/axios";
import Link from "next/link";

export default function DashboardPage() {
    const [studentCount, setStudentCount] = useState<number>(0);
    const [courseCount, setCourseCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [studentsRes, coursesRes] = await Promise.all([
                    api.get("/students"),
                    api.get("/courses")
                ]);
                setStudentCount(studentsRes.data.length);
                setCourseCount(coursesRes.data.length);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-lg font-bold text-black animate-pulse">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                <div className="mb-10 text-center sm:text-left">
                    <h1 className="text-4xl font-extrabold text-black tracking-tight">Admin Dashboard</h1>
                    <p className="mt-2 text-base text-gray-800 font-medium">Overview of your institution's current metrics.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

                    <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center transition-transform hover:scale-[1.01] duration-300">
                        <h2 className="text-lg font-extrabold text-gray-800 mb-3 uppercase tracking-wider">Total Students</h2>
                        <div className="text-7xl font-black text-black">{studentCount}</div>
                    </div>

                    <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center transition-transform hover:scale-[1.01] duration-300">
                        <h2 className="text-lg font-extrabold text-gray-800 mb-3 uppercase tracking-wider">Total Courses</h2>
                        <div className="text-7xl font-black text-black">{courseCount}</div>
                    </div>

                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-start">
                    <Link
                        href="/students"
                        className="flex items-center justify-center px-8 py-4 bg-blue-300 rounded-xl shadow-sm text-lg font-bold text-black hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all"
                    >
                        Manage Students
                    </Link>

                    <Link
                        href="/courses"
                        className="flex items-center justify-center px-8 py-4 bg-green-400 rounded-xl shadow-sm text-lg font-bold text-black hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                    >
                        Manage Courses
                    </Link>
                </div>

            </div>
        </div>
    );
}