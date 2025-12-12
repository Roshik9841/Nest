import { useState, useEffect } from 'react';
import api from '../api';
import { Header } from '../components/Header';

export const MyCourses = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeVideo, setActiveVideo] = useState(null);

    useEffect(() => {
        fetchMyCourses();
    }, []);

    const fetchMyCourses = async () => {
        try {
            const response = await api.get('/enrollments/my-courses');
            setEnrollments(response.data);
        } catch (err) {
            setError('Failed to load your courses',err);
        } finally {
            setLoading(false);
        }
    };

    const handleUnenroll = async (courseId) => {
        if (!window.confirm('Are you sure you want to unenroll from this course?')) {
            return;
        }

        try {
            await api.delete(`/enrollments/course/${courseId}`);
            fetchMyCourses();
            alert('Successfully unenrolled');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to unenroll');
        }
    };

    if (loading) {
        return (
            <div>
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <p className="text-center">Loading your courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">My Courses</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrollments.map((enrollment) => (
                        <div key={enrollment.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-3">
                            <div
                                className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden cursor-pointer flex items-center justify-center"
                                onClick={() => enrollment.course.videoUrl && setActiveVideo(enrollment.course.videoUrl)}
                            >
                                {enrollment.course.thumbnailUrl ? (
                                    <img
                                        src={enrollment.course.thumbnailUrl}
                                        alt="Course thumbnail"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-gray-500 text-sm">Click to play video</div>
                                )}
                            </div>
                            <h2 className="text-xl font-semibold">{enrollment.course.title}</h2>
                            <p className="text-gray-600 line-clamp-3">{enrollment.course.description}</p>
                            {enrollment.course.instructor && (
                                <p className="text-sm text-gray-500 mb-4">
                                    Instructor: {enrollment.course.instructor.name}
                                </p>
                            )}
                            {enrollment.course.videoUrl && (
                                <button
                                    onClick={() => setActiveVideo(enrollment.course.videoUrl)}
                                    className="text-blue-600 hover:underline text-sm text-left"
                                >
                                    Watch Video
                                </button>
                            )}
                            <button
                                onClick={() => handleUnenroll(enrollment.course.id)}
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
                            >
                                Unenroll
                            </button>
                        </div>
                    ))}
                </div>

                {enrollments.length === 0 && (
                    <p className="text-center text-gray-500 mt-8">You haven't enrolled in any courses yet</p>
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






