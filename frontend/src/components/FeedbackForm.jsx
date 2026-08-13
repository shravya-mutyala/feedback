import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export default function FeedbackForm() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [linkData, setLinkData] = useState(null);

    // Form state
    const [comments, setComments] = useState('');
    const [wouldRecommend, setWouldRecommend] = useState(true);

    // Fetch link data on mount
    useEffect(() => {
        async function fetchLink() {
            try {
                const res = await fetch(`${API_BASE_URL}/links/${token}`);
                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || 'This feedback link is invalid or expired.');
                    return;
                }

                setLinkData(data);
            } catch (err) {
                setError('Unable to load feedback form. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchLink();
    }, [token]);

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const payload = {
                token,
                ratings: [],
                wentWell: comments,
                couldImprove: '',
                wouldRecommend,
                additionalComments: '',
            };

            const res = await fetch(`${API_BASE_URL}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to submit feedback.');
                return;
            }

            navigate('/thank-you');
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Error state (invalid/expired link)
    if (error && !linkData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100">
                <Header />
                <div className="flex items-center justify-center p-4 mt-20">
                    <div className="max-w-md text-center bg-white rounded-2xl shadow-lg p-8">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">Link Unavailable</h2>
                        <p className="text-gray-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100">
            <Header />

            <div className="py-10 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Greeting */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">
                            Feedback for {linkData?.yourName}
                        </h1>
                        <p className="mt-2 text-slate-500 text-lg">
                            Hi {linkData?.clientName}, please take a moment to share your experience.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 space-y-8 border border-blue-100">
                        {/* Comments */}
                        <div>
                            <label htmlFor="comments" className="block text-lg font-semibold text-slate-800 mb-1">
                                Comments or suggestions
                            </label>
                            <p className="text-sm text-slate-400 mb-3">Your honest feedback helps us improve</p>
                            <textarea
                                id="comments"
                                rows={4}
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                className="w-full rounded-xl border border-blue-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                placeholder="Share any thoughts about your experience..."
                            />
                        </div>

                        {/* Recommend */}
                        <div>
                            <label className="block text-lg font-semibold text-slate-800 mb-3">
                                Would you recommend working with {linkData?.yourName}?
                            </label>
                            <div className="flex gap-3">
                                <label className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${wouldRecommend === true ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-blue-200'}`}>
                                    <input
                                        type="radio"
                                        name="recommend"
                                        checked={wouldRecommend === true}
                                        onChange={() => setWouldRecommend(true)}
                                        className="sr-only"
                                    />
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                    <span className="font-medium">Yes</span>
                                </label>
                                <label className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${wouldRecommend === false ? 'bg-red-50 border-red-400 text-red-700' : 'border-gray-200 text-gray-500 hover:border-red-200'}`}>
                                    <input
                                        type="radio"
                                        name="recommend"
                                        checked={wouldRecommend === false}
                                        onChange={() => setWouldRecommend(false)}
                                        className="sr-only"
                                    />
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905a3.61 3.61 0 01.608-2.006L17 11V2m-7 10h2m5-8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                    </svg>
                                    <span className="font-medium">No</span>
                                </label>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-3.5 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                        >
                            {submitting ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

/** Site header with ScaleCapacity logo */
function Header() {
    return (
        <header className="bg-white px-6 py-4 shadow-sm border-b border-gray-200">
            <div className="max-w-5xl mx-auto flex items-center">
                <img
                    src="/logo.png"
                    alt="ScaleCapacity"
                    className="h-12"
                />
            </div>
        </header>
    );
}
