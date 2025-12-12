import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Header } from '../components/Header';

export const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [activeVideo, setActiveVideo] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/courses');
            setCourses(response.data);
        } catch (err) {
            setError('Failed to load courses',err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course?')) {
            return;
        }

        try {
            await api.delete(`/courses/${courseId}`);
            fetchCourses();
            alert('Course deleted successfully');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete course');
        }
    };

    if (loading) {
        return (
            <div>
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <p className="text-center">Loading courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Manage Courses</h1>
                    <button
                        onClick={() => navigate('/admin/create-course')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                    >
                        Create New Course
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-3">
                            <div
                                className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden cursor-pointer flex items-center justify-center"
                                onClick={() => course.videoUrl && setActiveVideo(course.videoUrl)}
                            >
                                {course.thumbnailUrl ? (
                                    <img
                                        src={course.thumbnailUrl}
                                        alt="Course thumbnail"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-gray-500 text-sm">Click to play video</div>
                                )}
                            </div>
                            <h2 className="text-xl font-semibold">{course.title}</h2>
                            <p className="text-gray-600 line-clamp-3">{course.description}</p>
                            {course.instructor && (
                                <p className="text-sm text-gray-500 mb-4">
                                    Instructor: {course.instructor.name}
                                </p>
                            )}
                            {course.videoUrl && (
                                <button
                                    onClick={() => setActiveVideo(course.videoUrl)}
                                    className="text-blue-600 hover:underline text-sm text-left"
                                >
                                    Watch Video
                                </button>
                            )}
                            <div className="flex gap-2 mt-auto">
                                <button
                                    onClick={() => navigate(`/admin/edit-course/${course.id}`)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(course.id)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {courses.length === 0 && (
                    <p className="text-center text-gray-500 mt-8">No courses available</p>
                )}
            </div>
            {activeVideo && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setActiveVideo(null)}>
                    <div className="bg-black w-full max-w-3xl rounded-lg overflow-hidden shadow-xl relative" onClick={(e) => e.stopPropagation()}>
                        {(() => {
                            // Helper function to convert YouTube URL to embed URL
                            const getYouTubeEmbedUrl = (url) => {
                                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                const match = url.match(regExp);
                                const videoId = (match && match[2].length === 11) ? match[2] : null;
                                if (videoId) {
                                    return `https://www.youtube.com/embed/${videoId}`;
                                }
                                return null;
                            };

                            // Check if it's a YouTube URL
                            const isYouTube = activeVideo.includes('youtube.com') || activeVideo.includes('youtu.be');
                            
                            if (!activeVideo) {
                                return <div className="p-8 text-white text-center">No video URL provided</div>;
                            }

                            if (isYouTube) {
                                const embedUrl = getYouTubeEmbedUrl(activeVideo);
                                if (embedUrl) {
                                    return (
                                        <iframe
                                            src={embedUrl}
                                            className="w-full h-[60vh]"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title="YouTube video player"
                                        />
                                    );
                                } else {
                                    return <div className="p-8 text-white text-center">Invalid YouTube URL format</div>;
                                }
                            }

                            // For regular video files
                            let videoSrc = activeVideo;
                            if (!videoSrc.startsWith('http') && !videoSrc.startsWith('/')) {
                                videoSrc = `/${videoSrc}`;
                            }
                            
                            return (
                                <video 
                                    key={videoSrc}
                                    src={videoSrc}
                                    controls 
                                    autoPlay 
                                    className="w-full h-[60vh] bg-black"
                                    onError={(e) => {
                                        const video = e.target;
                                        console.error('Video load error:', {
                                            error: video.error,
                                            code: video.error?.code,
                                            message: video.error?.message,
                                            src: videoSrc,
                                        });
                                        alert(`Failed to load video from: ${videoSrc}\n\nPlease check:\n1. File exists at that path\n2. File format is supported (MP4, WebM)\n3. For local files, use: /videos/your-file.mp4`);
                                    }}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            );
                        })()}
                        <button
                            className="absolute top-3 right-3 bg-white/80 hover:bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold z-10"
                            onClick={() => setActiveVideo(null)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};





