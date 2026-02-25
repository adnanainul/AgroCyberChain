import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Tractor, ShoppingCart, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE } from '../services/apiConfig';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'farmer' | 'customer'>('farmer'); // Default visual role
    const { login } = useAuth();
    const { setColorMode } = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Update global theme color when user toggles role in login form
    useEffect(() => {
        setColorMode(role === 'farmer' ? 'green' : 'blue');
    }, [role, setColorMode]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.msg || 'Login failed');
            }

            // Update Global Auth State
            login(data.token, data.user);
            setColorMode(data.user.role === 'farmer' ? 'green' : 'blue'); // Enforce correct theme on success

            toast.success(`Welcome back, ${data.user.name}!`);
            navigate('/');

        } catch (err: any) {
            toast.error(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const isFarmer = role === 'farmer';

    return (
        <div className={`min-h-screen pt-20 pb-12 flex flex-col items-center justify-center transition-colors duration-500 ${isFarmer ? 'bg-green-50' : 'bg-blue-50'}`}>
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">

                {/* Role Switcher */}
                <div className="flex justify-center mb-8 bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setRole('farmer')}
                        className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg text-sm font-bold transition-all ${isFarmer
                            ? 'bg-white text-green-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Tractor size={18} className="mr-2" />
                        Farmer
                    </button>
                    <button
                        onClick={() => setRole('customer')}
                        className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg text-sm font-bold transition-all ${!isFarmer
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <ShoppingCart size={18} className="mr-2" />
                        Customer
                    </button>
                </div>

                <div className="text-center mb-8">
                    <h2 className={`text-3xl font-bold ${isFarmer ? 'text-green-800' : 'text-blue-800'}`}>
                        Welcome Back
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {isFarmer ? 'Sign in to manage your Smart Farm' : 'Sign in to explore the Market'}
                    </p>
                </div>



                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-gray-900 ${isFarmer ? 'focus:ring-green-500' : 'focus:ring-blue-500'}`}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-gray-900 ${isFarmer ? 'focus:ring-green-500' : 'focus:ring-blue-500'}`}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed ${isFarmer
                            ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
                            : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                            }`}
                    >
                        {loading ? 'Signing in...' : (
                            <>
                                Sign In
                                <ArrowRight className="ml-2" size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className={`font-semibold hover:underline ${isFarmer ? 'text-green-600' : 'text-blue-600'}`}>
                        Create {isFarmer ? 'Farmer' : 'Customer'} Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
