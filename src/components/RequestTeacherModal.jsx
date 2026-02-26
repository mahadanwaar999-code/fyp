import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function RequestTeacherModal({ teacher, onClose, onSuccess, isDark }) {
    const [message, setMessage] = useState('');
    const [requestedDate, setRequestedDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5001/api/requests/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    teacherId: teacher._id,
                    message,
                    requestedDate: requestedDate ? new Date(requestedDate).toISOString() : new Date().toISOString()
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert('Request sent successfully!');
                onSuccess();
                onClose();
            } else {
                alert(data.message || 'Failed to send request');
            }
        } catch (err) {
            console.error('Error sending request:', err);
            alert('An error occurred while sending the request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`max-w-md w-full rounded-xl p-6 ${isDark ? 'bg-[#252540] text-white' : 'bg-white text-gray-900'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Request Lecture</h2>
                    <button onClick={onClose} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="mb-4">
                    <p><strong>Teacher:</strong> {teacher.profile?.fullName}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Requested Date & Time</label>
                        <input
                            type="datetime-local"
                            required
                            value={requestedDate}
                            onChange={(e) => setRequestedDate(e.target.value)}
                            className={`w-full p-2 rounded-lg border ${isDark ? 'bg-[#1a1a2e] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Message (Optional)</label>
                        <textarea
                            rows="3"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="What would you like to discuss?"
                            className={`w-full p-2 rounded-lg border resize-none ${isDark ? 'bg-[#1a1a2e] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 rounded-lg bg-[#333388] text-white hover:bg-[#4444aa] transition-all disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Request'}
                    </button>
                </form>
            </div>
        </div>
    );
}
