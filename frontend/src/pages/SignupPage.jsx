// frontend/src/pages/SignupPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!name || !email || !password) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setLoading(false);
            return;
        }

        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post(
                'https://record-task-fullstack.onrender.com/api/auth/register', // Ensure your backend URL is correct
                { name, email, password },
                config
            );
            console.log('Registration successful:', data);
            navigate('/login?registered=true');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"> {/* page background */}
            <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-lg"> {/* card */}
                <div>
                    <img className="mx-auto h-10 sm:h-12 w-auto" src="/record-logo.png" alt="Record Logo" /> {/* Ensure logo is in public folder */}
                    <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
                        Join Record!
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Let's open your skill repository.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4" role="alert"> {/* Adjusted error style */}
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Using individual divs for inputs to match design more easily */}
                    <div>
                        <label htmlFor="name" className="sr-only">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-1 focus:ring-auth-primary focus:border-auth-primary sm:text-sm"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
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
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-1 focus:ring-auth-primary focus:border-auth-primary sm:text-sm"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-auth-primary hover:bg-auth-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-auth-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
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
                        disabled // Google Sign In Not Required
                        className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <img className="h-5 w-5 mr-2" src="/google-icon.png" alt="Google icon" /> {/* Ensure google-icon.png is in public folder */}
                        Continue With Google
                    </button>
                </div>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-auth-primary hover:text-auth-primary-hover">
                        Sign in.
                    </Link>
                </p>
                <p className="mt-4 text-center text-xs text-gray-500">
                    By signing up, I accept the Record.{' '}
                    <a href="#privacy" className="font-medium text-gray-700 hover:text-gray-900">Privacy Policy</a> and{' '}
                    <a href="#terms" className="font-medium text-gray-700 hover:text-gray-900">Terms of Service</a>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;