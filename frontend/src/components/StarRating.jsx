import React from 'react';

/**
 * Reusable star rating component (1-5 stars)
 */
export default function StarRating({ value, onChange, label }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div className="flex gap-1" role="radiogroup" aria-label={`${label} rating`}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        className="focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                        aria-checked={value === star}
                        role="radio"
                    >
                        <svg
                            className={`w-8 h-8 transition-colors ${star <= value ? 'text-yellow-400' : 'text-gray-300'
                                } hover:text-yellow-300`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </button>
                ))}
            </div>
        </div>
    );
}
