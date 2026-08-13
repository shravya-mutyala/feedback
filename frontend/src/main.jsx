import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import FeedbackForm from './components/FeedbackForm';
import FeedbackFormPreview from './components/FeedbackFormPreview';
import GenerateLink from './components/GenerateLink';
import ThankYou from './components/ThankYou';
import NotFound from './components/NotFound';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/generate" element={<GenerateLink />} />
                <Route path="/preview" element={<FeedbackFormPreview />} />
                <Route path="/feedback/:token" element={<FeedbackForm />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
