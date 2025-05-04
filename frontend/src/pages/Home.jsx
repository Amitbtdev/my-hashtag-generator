// src/pages/Home.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import api from './api'
import { UploadCloud, Loader2, Hash, FileText } from 'lucide-react'

export default function Home() {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [hashtags, setHashtags] = useState([])
    const [transcription, setTranscription] = useState('')
    const [uploadInfo, setUploadInfo] = useState('')

    const handleFileChange = e => {
        setError('')
        setHashtags([])
        setTranscription('')
        const f = e.target.files[0]
        if (f) {
            setFile(f)
            setUploadInfo(`🗂 ${f.name} • ${(f.size / 1024).toFixed(1)} KB`)
        } else {
            setUploadInfo('')
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()
        if (!file) return setError('Please select a file first.')

        setLoading(true)
        setError('')
        setHashtags([])
        setTranscription('')

        try {
            const form = new FormData()
            form.append('media', file)
            const res = await api.post('/api/generate', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            setHashtags(res.data.generatedHashtags || [])
            setTranscription(res.data.transcription || '')
            setUploadInfo('File processed successfully!')
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || 'Generation failed.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-20 bg-gradient-to-br from-indigo-900 to-pink-700 flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-white"
            >
                <h1 className="text-5xl font-extrabold mb-2">AI Hashtag Generator</h1>
                <p className="text-lg mb-6 opacity-80">
                    Instantly generate catchy, relevant hashtags for your text, images, or audio. Perfect for social media pros!
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block">
                        <span className="inline-flex items-center px-5 py-3 bg-white/20 rounded-full cursor-pointer hover:bg-white/30 transition">
                            <UploadCloud className="w-6 h-6 mr-2" />
                            <span>{file ? 'Change File' : 'Select File'}</span>
                            <input
                                type="file"
                                accept=".txt,image/*,audio/*"
                                hidden
                                onChange={handleFileChange}
                            />
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold shadow-lg hover:scale-105 transform transition disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin w-6 h-6 mr-2" /> : 'Generate Hashtags'}
                    </button>
                </form>

                {uploadInfo && (
                    <p className="mt-4 text-green-300 font-medium">{uploadInfo}</p>
                )}
                {error && (
                    <p className="mt-4 text-red-400 font-medium">{error}</p>
                )}

                {hashtags.length > 0 && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="mt-8 bg-white/20 rounded-2xl p-6 backdrop-blur-md"
                    >
                        <h2 className="flex items-center text-2xl font-bold mb-4">
                            <Hash className="w-6 h-6 mr-2" />
                            Your Hashtags
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {hashtags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="px-4 py-2 bg-white text-indigo-900 font-medium rounded-full text-sm shadow"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}

                {transcription && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="mt-6 bg-white/20 rounded-2xl p-6 backdrop-blur-md"
                    >
                        <h2 className="flex items-center text-2xl font-bold mb-3">
                            <FileText className="w-6 h-6 mr-2" />
                            Transcription
                        </h2>
                        <p className="text-sm whitespace-pre-wrap opacity-90">
                            {transcription}
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}
