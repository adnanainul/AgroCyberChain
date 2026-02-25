import { useState, useEffect } from 'react';
import { Mail, Calendar, LogOut, Activity, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { API_BASE } from '../services/apiConfig';

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Real-time statistics state
    const [activeSensors, setActiveSensors] = useState(0);
    const [transactions, setTransactions] = useState(0);
    const [reputationScore, setReputationScore] = useState(100);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        // If user exists but email is missing, fetch it from backend
        if (user && !user.email) {
            console.log('Email missing, fetching user details from backend...');
            fetch(`${API_BASE}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.email) {
                        // Update localStorage with complete user data
                        const updatedUser = { ...user, email: data.email, date: data.createdAt };
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                        window.location.reload(); // Refresh to show updated data
                    }
                })
                .catch(err => console.error('Error fetching user details:', err));
        }
    }, [user]);

    useEffect(() => {
        // Fetch initial statistics
        fetch(`${API_BASE}/api/sensors`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setActiveSensors(data.length);
                }
            })
            .catch(err => console.error('Error fetching sensors:', err));

        fetch(`${API_BASE}/api/blockchain`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setTransactions(data.length);
                }
            })
            .catch(err => console.error('Error fetching blockchain:', err));

        // Connect to WebSocket for real-time updates
        const socket = io(API_BASE);

        socket.on('connect', () => {
            console.log('Profile: WebSocket connected');
            setIsLive(true);
        });

        socket.on('disconnect', () => {
            console.log('Profile: WebSocket disconnected');
            setIsLive(false);
        });

        // Listen for new sensor data
        socket.on('sensor_update', (data) => {
            console.log('Profile: New sensor data received', data);
            setActiveSensors(prev => prev + 1);
        });

        // Listen for new blockchain blocks
        socket.on('new_block', (block) => {
            console.log('Profile: New block mined', block);
            setTransactions(prev => prev + 1);
            // Increase reputation slightly with each transaction
            setReputationScore(prev => Math.min(100, prev + 0.1));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return <div className="pt-24 text-center">Loading...</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-blue-600 h-32 relative">
                        {/* Live Indicator */}
                        {isLive && (
                            <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
                                <Wifi size={14} className="text-white animate-pulse" />
                                <span className="text-xs font-bold text-white uppercase tracking-wide">Live</span>
                            </div>
                        )}

                        <div className="absolute -bottom-16 left-8">
                            <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
                                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-4xl font-bold text-gray-400 border-4 border-white">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 pb-8 px-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                                <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold capitalize">
                                    {user.role} Account
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={18} />
                                <span>Sign Out</span>
                            </button>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-5 bg-blue-50 rounded-xl border border-blue-200">
                                <div className="flex items-center space-x-2 mb-3">
                                    <Mail className="text-blue-600" size={18} />
                                    <span className="font-bold text-xs text-gray-500 uppercase tracking-wider">Email Address</span>
                                </div>
                                <p className="text-xl font-bold text-blue-900 break-all">
                                    {user.email || 'No email provided'}
                                </p>
                            </div>

                            <div className="p-5 bg-purple-50 rounded-xl border border-purple-200">
                                <div className="flex items-center space-x-2 mb-3">
                                    <Calendar className="text-purple-600" size={18} />
                                    <span className="font-bold text-xs text-gray-500 uppercase tracking-wider">Member Since</span>
                                </div>
                                <p className="text-xl font-bold text-purple-900">
                                    {new Date(user.date || Date.now()).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 border-t pt-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Account Statistics</h3>
                                {isLive && (
                                    <div className="flex items-center gap-2 text-emerald-600">
                                        <Activity size={16} className="animate-pulse" />
                                        <span className="text-xs font-bold uppercase tracking-wide">Real-Time</span>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100 transition-all hover:shadow-md">
                                    <div className="text-3xl font-bold text-blue-600 transition-all duration-300">
                                        {activeSensors}
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium mt-1">Active Sensors</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100 transition-all hover:shadow-md">
                                    <div className="text-3xl font-bold text-green-600 transition-all duration-300">
                                        {transactions}
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium mt-1">Transactions</div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-xl text-center border border-purple-100 transition-all hover:shadow-md">
                                    <div className="text-3xl font-bold text-purple-600 transition-all duration-300">
                                        {reputationScore.toFixed(1)}%
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium mt-1">Reputation Score</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
