import { Header } from "../components/Header";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const userObj = JSON.parse(userData);
            setUser(userObj);
            // Redirect if not admin
            if (userObj.role !== 'admin') {
                navigate('/student-dashboard');
            }
        }
    }, [navigate]);

    return (
        <div>
            <Header />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
                
                {user && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-2">Welcome, {user.name}!</h2>
                        <p className="text-gray-600">Email: {user.email}</p>
                        <p className="text-gray-600">Role: Administrator</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link
                        to="/admin/courses"
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md p-6 text-center transition"
                    >
                        <h2 className="text-xl font-semibold mb-2">Manage Courses</h2>
                        <p className="text-blue-100">View, create, edit, and delete courses</p>
                    </Link>

                    <Link
                        to="/admin/users"
                        className="bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md p-6 text-center transition"
                    >
                        <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
                        <p className="text-green-100">View and manage all users</p>
                    </Link>

                    <Link
                        to="/admin/enrollments"
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md p-6 text-center transition"
                    >
                        <h2 className="text-xl font-semibold mb-2">View Enrollments</h2>
                        <p className="text-purple-100">View all course enrollments</p>
                    </Link>

                    <Link
                        to="/admin/create-course"
                        className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-md p-6 text-center transition"
                    >
                        <h2 className="text-xl font-semibold mb-2">Create Course</h2>
                        <p className="text-orange-100">Create a new course</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};





