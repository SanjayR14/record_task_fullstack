// frontend/src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';

// Basic SVG Icons for password toggle (replace with better icons if available)
const EyeIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeSlashIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.007 10.007 0 013.466-5.033M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.293 2.293A9.962 9.962 0 0021.542 12c-1.274-4.057-5.064-7-9.542-7a9.962 9.962 0 00-2.293.293m-2.435 2.435A9.95 9.95 0 002.458 12c1.274 4.057 5.064 7 9.542 7a9.95 9.95 0 005.033-3.466m-2.435-2.435l2.435 2.435m0 0l-2.435-2.435m2.435-2.435L15 12m1.707-1.707A9.953 9.953 0 0012 2.457M3.536 3.536A9.953 9.953 0 0112 21.543" />
    </svg>
);


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('registered') === 'true') {
            setSuccessMessage('Registration successful! Please log in.');
        }
        if (localStorage.getItem('userInfo')) {
            navigate('/dashboard');
        }
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        if (!email || !password) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post(
                'http://localhost:5001/api/auth/login', // Ensure your backend URL is correct
                { email, password },
                config
            );
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"> {/* page background */}
            <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-lg"> {/* card */}
                <div>
                    <img className="mx-auto h-10 sm:h-12 w-auto" src="/record-logo.png" alt="Record Logo" />
                    <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
                        Sign in to Record!
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Let's open your skill repository.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 mt-4" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-50 border-l-4 border-green-400 text-green-700 p-4 mt-4" role="alert">
                         <p className="font-bold">Success</p>
                        <p>{successMessage}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email-address" className="sr-only">Email address</label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-1 focus:ring-auth-primary focus:border-auth-primary sm:text-sm"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            required
                            className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-1 focus:ring-auth-primary focus:border-auth-primary sm:text-sm"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>
                    

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-auth-primary hover:bg-auth-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-auth-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging In...' : 'Login to Record'}
                        </button>
                    </div>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                            or
                        </span>
                    </div>
                </div>

                <div>
                    <button
                        type="button"
                        // Google Sign In Not Required
                        className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <img className="h-5 w-5 mr-2" src="/google-icon.png" alt="Google icon" />
                        Continue With Google
                    </button>
                </div>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Do you have an account?{' '}
                    <Link to="/signup" className="font-medium text-auth-primary hover:text-auth-primary-hover">
                        Create account.
                    </Link>
                </p>

                <p className="mt-4 text-center text-xs text-gray-500">
                    © Record. {' '}
                    <a href="#privacy" className="font-medium text-gray-700 hover:text-gray-900">Privacy Policy</a> | {' '}
                    <a href="#terms" className="font-medium text-gray-700 hover:text-gray-900">Terms of Service</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;