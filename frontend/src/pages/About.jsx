import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div className="bg-gradient-to-br from-indigo-900 to-pink-700 min-h-screen pt-24 pb-10 text-gray-100">
            <div className="max-w-5xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8">
                    Discover the Power of AI for Hashtag Generation
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-purple-700/80 rounded-lg p-6 shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">What is This App?</h2>
                        <p className="mb-4 leading-relaxed">
                            Welcome to the future of hashtag creation! This AI-powered tool lets you easily upload text, images, or even audio files. Once uploaded, our powerful AI (Google Gemini) analyzes the content and generates relevant hashtags tailored specifically to your media.
                        </p>
                        <p className="leading-relaxed">
                            Whether you're a content creator, marketer, or just someone looking to amplify your online presence, our tool helps you find the best hashtags for your posts. And with our history feature, you can revisit past results whenever you need.
                        </p>
                    </div>

                    <div className="bg-pink-800/80 rounded-lg p-6 shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
                        <ul className="list-none space-y-2">
                            <li>📄 Upload text, audio, or image files</li>
                            <li>🤖 AI-driven hashtag generation with Google Gemini</li>
                            <li>📜 View and manage your hashtag history</li>
                            <li>🔍 Search for previously generated hashtags</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <h3 className="text-xl font-semibold mb-2">
                        Ready to Generate Hashtags?
                    </h3>
                    <p className="mb-4">
                        Start by uploading your file and let the AI do the magic!
                    </p>
                    <Link to="/" className="inline-block bg-pink-500 hover:bg-pink-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300">
                        Start Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
