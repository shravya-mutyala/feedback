import { useState } from 'react';
import { API_BASE_URL } from '../config';

export default function GenerateLink() {
    const [yourName, setYourName] = useState('');
    const [managerEmail, setManagerEmail] = useState('');
    const [clientName, setClientName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [generatedLink, setGeneratedLink] = useState(null);
    const [copied, setCopied] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setGeneratedLink(null);

        if (!yourName || !managerEmail || !clientName) {
            setError('All fields are required');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/links`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ yourName, managerEmail, clientName }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to generate link');
                return;
            }

            // Build the full URL using current origin
            const fullUrl = `${window.location.origin}/feedback/${data.token}`;
            setGeneratedLink(fullUrl);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    function handleCopy() {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function handleReset() {
        setGeneratedLink(null);
        setClientName('');
        setCopied(false);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100">
            <Header />

            <div className="py-10 px-4">
                <div className="max-w-lg mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">Generate Feedback Link</h1>
                        <p className="mt-2 text-slate-500">
                            Create a unique link to send to your client for feedback.
                        </p>
                    </div>

                    {/* Success — show generated link */}
                    {generatedLink ? (
                        <div className="bg-white shadow-xl rounded-2xl p-8 border border-blue-100">
                            <div className="text-center mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-semibold text-slate-900">Link Generated!</h2>
                                <p className="text-sm text-slate-500 mt-1">Send this to <strong>{clientName}</strong></p>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-2 border border-slate-200">
                                <input
                                    type="text"
                                    readOnly
                                    value={generatedLink}
                                    className="flex-1 bg-transparent text-sm text-slate-700 outline-none truncate"
                                />
                                <button
                                    onClick={handleCopy}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${copied
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>

                            <button
                                onClick={handleReset}
                                className="w-full mt-4 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                Generate another link
                            </button>
                        </div>
                    ) : (
                        /* Form */
                        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 space-y-6 border border-blue-100">
                            <div>
                                <label htmlFor="yourName" className="block text-sm font-medium text-slate-700 mb-1">
                                    Your Name
                                </label>
                                <input
                                    id="yourName"
                                    type="text"
                                    value={yourName}
                                    onChange={(e) => setYourName(e.target.value)}
                                    className="w-full rounded-xl border border-blue-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    placeholder="e.g. Shravya"
                                />
                            </div>

                            <div>
                                <label htmlFor="managerEmail" className="block text-sm font-medium text-slate-700 mb-1">
                                    Your Manager's Email
                                </label>
                                <input
                                    id="managerEmail"
                                    type="email"
                                    value={managerEmail}
                                    onChange={(e) => setManagerEmail(e.target.value)}
                                    className="w-full rounded-xl border border-blue-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    placeholder="e.g. manager@company.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="clientName" className="block text-sm font-medium text-slate-700 mb-1">
                                    Client's Name
                                </label>
                                <input
                                    id="clientName"
                                    type="text"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    className="w-full rounded-xl border border-blue-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    placeholder="e.g. John from Acme Corp"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-3.5 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                            >
                                {loading ? 'Generating...' : 'Generate Link'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

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
