import { Header } from "../components/Header";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const StudentDashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const userObj = JSON.parse(userData);
            setUser(userObj);
            // Redirect if not student
            if (userObj.role !== 'student') {
                navigate('/admin-dashboard');
            }
        }
    }, [navigate]);

    return (
        <div>
            <Header />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
                
                {user && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-2">Welcome, {user.name}!</h2>
                        <p className="text-gray-600">Email: {user.email}</p>
                        <p className="text-gray-600">Role: Student</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link
                        to="/student/courses"
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md p-6 text-center transition"
                    >
                        <h2 className="text-xl font-semibold mb-2">Browse Courses</h2>
                        <p className="text-blue-100">View and enroll in available courses</p>
                    </Link>

                    <Link
                        to="/student/my-courses"
                        className="bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md p-6 text-center transition"
                    >
                        <h2 className="text-xl font-semibold mb-2">My Courses</h2>
                        <p className="text-green-100">View your enrolled courses</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};





