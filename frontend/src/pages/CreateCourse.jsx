import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Header } from '../components/Header';

export const CreateCourse = () => {
    const [form, setForm] = useState({ title: '', description: '', videoUrl: '', thumbnailUrl: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/courses', form);
            alert('Course created successfully!');
            navigate('/admin/courses');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div>
            <Header />
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <h1 className="text-3xl font-bold mb-6">Create Course</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
                    <div>
                        <label className="font-semibold mb-1 block">Title</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            required
                            className="border rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="font-semibold mb-1 block">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            required
                            rows={6}
                            className="border rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="font-semibold mb-1 block">Video URL (optional)</label>
                        <input
                            type="url"
                            value={form.videoUrl}
                            onChange={(e) => handleChange('videoUrl', e.target.value)}
                            placeholder="https://example.com/video.mp4 or /videos/my-folder/video.mp4"
                            className="border rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            You can host videos in your own folder (e.g. frontend/public/videos/...) and reference them here.
                        </p>
                    </div>

                    <div>
                        <label className="font-semibold mb-1 block">Thumbnail URL (optional)</label>
                        <input
                            type="url"
                            value={form.thumbnailUrl}
                            onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                            placeholder="https://example.com/thumbnail.jpg or /videos/thumbs/preview.jpg"
                            className="border rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Course'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/courses')}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-semibold transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


