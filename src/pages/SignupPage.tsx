import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, Sprout, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { API_BASE } from '../services/apiConfig';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'farmer' // Default role
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { login } = useAuth();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.msg || 'Signup failed');
            }

            // Auto-login after signup
            login(data.token, data.user);

            toast.success('Account created successfully!');
            navigate('/');

        } catch (err: any) {
            toast.error(err.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                    <p className="text-gray-600 mt-2">Join the AgroCyberChain network</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-6">

                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'farmer' })}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center transition-all ${formData.role === 'farmer'
                                ? 'border-green-600 bg-green-50 text-green-700'
                                : 'border-gray-200 hover:border-green-200 text-gray-600'
                                }`}
                        >
                            <Sprout size={28} className="mb-2" />
                            <span className="font-semibold">Farmer</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'customer' })}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center transition-all ${formData.role === 'customer'
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-blue-200 text-gray-600'
                                }`}
                        >
                            <ShoppingCart size={28} className="mb-2" />
                            <span className="font-semibold">Customer</span>
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Account...' : (
                            <>
                                Create Account
                                <ArrowRight className="ml-2" size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-green-600 hover:text-green-700">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
