import { useState, useEffect } from 'react';
import api from '../api';
import { Header } from '../components/Header';

export const AdminEnrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            // Get all courses first
            const coursesResponse = await api.get('/courses');
            const courses = coursesResponse.data;
            
            // Get enrollments for each course
            const allEnrollments = [];
            for (const course of courses) {
                try {
                    const enrollResponse = await api.get(`/enrollments/course/${course.id}`);
                    const courseEnrollments = enrollResponse.data.map(enrollment => ({
                        ...enrollment,
                        courseTitle: course.title
                    }));
                    allEnrollments.push(...courseEnrollments);
                } catch (err) {
                    // Course might have no enrollments
                }
            }
            
            setEnrollments(allEnrollments);
        } catch (err) {
            setError('Failed to load enrollments');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <p className="text-center">Loading enrollments...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">All Enrollments</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Email</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {enrollments.map((enrollment) => (
                                <tr key={enrollment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {enrollment.courseTitle || enrollment.course?.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {enrollment.student?.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {enrollment.student?.email || 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {enrollments.length === 0 && (
                    <p className="text-center text-gray-500 mt-8">No enrollments found</p>
                )}
            </div>
        </div>
    );
};





