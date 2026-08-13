import { useState } from 'react';
import StarRating from './StarRating';

const RATING_CATEGORIES = [
    { key: 'communication', label: 'Communication' },
    { key: 'quality', label: 'Quality of Work' },
    { key: 'timeliness', label: 'Timeliness' },
];

export default function FeedbackFormPreview() {
    const [ratings, setRatings] = useState(
        RATING_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.key]: 0 }), {})
    );
    const [comments, setComments] = useState('');
    const [wouldRecommend, setWouldRecommend] = useState(true);
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        setSubmitted(true);
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100">
                <Header />
                <div className="flex items-center justify-center p-4 mt-20">
                    <div className="max-w-md text-center bg-white rounded-2xl shadow-lg p-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h1>
                        <p className="text-gray-600">This is a preview. In production, the feedback would be emailed to your manager.</p>
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
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full mb-3">
                            PREVIEW MODE
                        </span>
                        <h1 className="text-3xl font-bold text-slate-900">Feedback for Shravya</h1>
                        <p className="mt-2 text-slate-500 text-lg">
                            Please take a moment to share your experience.
                        </p>
                    </div>

                    {/* Form Card */}
                    <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 space-y-8 border border-blue-100">
                        {/* Ratings - commented out
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800 mb-1">Ratings</h2>
                            <p className="text-sm text-slate-400 mb-4">Rate each area from 1 to 5 stars</p>
                            <div className="space-y-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
                                {RATING_CATEGORIES.map((cat) => (
                                    <StarRating
                                        key={cat.key}
                                        label={cat.label}
                                        value={ratings[cat.key]}
                                        onChange={(score) => setRatings((prev) => ({ ...prev, [cat.key]: score }))}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-blue-100"></div>
                        */}

                        {/* Comments */}
                        <div>
                            <label htmlFor="comments" className="block text-lg font-semibold text-slate-800 mb-1">
                                Comments or suggestions
                            </label>
                            <p className="text-sm text-slate-400 mb-3">Your feedback helps us improve</p>
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
                                Would you recommend working with Shravya?
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

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-3.5 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg"
                        >
                            Submit Feedback
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

/** Site header with logo */
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
