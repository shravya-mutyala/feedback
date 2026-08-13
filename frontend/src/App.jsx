import React from 'react';

/**
 * Landing page — shown when someone visits the root URL.
 * In production, you'd probably redirect or show a simple info page.
 */
export default function App() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md text-center">
                <div className="mb-6">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Client Feedback</h1>
                    <p className="mt-2 text-gray-600">
                        This is a private feedback form. If you received a feedback link, please use that URL to access your form.
                    </p>
                </div>
            </div>
        </div>
    );
}
