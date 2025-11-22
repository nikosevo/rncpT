import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Lock, User, AlertCircle, FileText, Sparkles, BookOpen } from 'lucide-react';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const success = await login(email, password);
            if (!success) {
                setError('Invalid email or password');
                setPassword('');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - App preview/branding */}
            <div className="flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex flex-col justify-center items-center text-white">
                <div className="max-w-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                            <FileText className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl font-bold">Paper Automation</h1>
                    </div>

                    <p className="text-xl text-blue-100 mb-12">
                        Transform your research ideas into beautifully formatted academic papers with AI assistance.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-white/10 rounded-lg mt-1">
                                <Sparkles className="w-5 h-5 text-yellow-300" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">AI-Powered Writing</h3>
                                <p className="text-blue-100 text-sm">Let AI help you structure and refine your research papers with intelligent suggestions.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-white/10 rounded-lg mt-1">
                                <BookOpen className="w-5 h-5 text-green-300" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Citation Management</h3>
                                <p className="text-blue-100 text-sm">Organize your references and citations effortlessly with built-in tools.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-white/10 rounded-lg mt-1">
                                <FileText className="w-5 h-5 text-purple-300" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Professional Formatting</h3>
                                <p className="text-blue-100 text-sm">Export to PDF with proper academic formatting, LaTeX support, and more.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Login form */}
            <div className="w-full max-w-md bg-white flex items-center justify-center p-8">
                <div className="w-full">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <Lock className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
                        <p className="text-slate-500 text-sm mt-2">Sign in to continue to your research papers</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700 text-sm">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors shadow-md shadow-blue-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-slate-400">
                        <p>Demo credentials: nikos@example.com / nikosevo3</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
