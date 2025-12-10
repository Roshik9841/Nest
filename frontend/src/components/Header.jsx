import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    if (isAuthPage) {
        return null;
    }

    return (
        <header className="bg-gradient-to-b from-[#293143] via-[#373F4F] to-[#444C5C] w-full px-4 py-6 flex justify-between items-center text-white">
            <p className="text-3xl font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>
                Learning Management System
            </p>
            <div className="flex space-x-7 items-center pr-4">
                {user && (
                    <p className="font-semibold text-lg">Welcome, {user.name}</p>
                )}
                {user && (
                    <button
                        type="button"
                        className="border rounded-4xl px-5 py-2 cursor-pointer hover:bg-[#66707b]"
                        onClick={() => navigate(user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard')}
                    >
                        Dashboard
                    </button>
                )}
                <button
                    type="button"
                    className="border rounded-4xl px-5 py-2 cursor-pointer hover:bg-[#66707b]"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </header>
    );
};