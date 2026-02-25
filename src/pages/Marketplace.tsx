import { useEffect, useState } from 'react';
import CropSuggestionModal from '../components/CropSuggestionModal';
import { ShoppingCart, MapPin, Tag, TrendingUp, Plus, CheckCircle, X, Info, Shield, Lock, RefreshCw, Check, Lightbulb } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE } from '../services/apiConfig';

interface Listing {
    _id: string; // MongoDB ID
    user_name: string;
    type: 'sell' | 'buy';
    location: string;
    crop_type: string;
    quantity_tons: number;
    price_per_ton: number;
    contact_info: string;
    status: 'active' | 'sold' | 'fulfilled';
}

const Marketplace = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [activeTab, setActiveTab] = useState<'all' | 'sell' | 'buy'>('all');
    const [notification, setNotification] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);

    // Modal State
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
    const [escrowState, setEscrowState] = useState<'idle' | 'init' | 'locked' | 'released'>('idle');

    const initiateEscrow = () => {
        setEscrowState('init');
        // Simulate Blockchain Delay
        setTimeout(() => {
            setEscrowState('locked');
        }, 3000);
    };

    // Form State
    const [formData, setFormData] = useState({
        location: '',
        crop_type: '',
        quantity_tons: '',
        price_per_ton: '',
        contact_info: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // Set default tab based on role
    useEffect(() => {
        if (user?.role === 'farmer') setActiveTab('buy'); // Farmers want to see buy requests
        else if (user?.role === 'customer') setActiveTab('sell'); // Customers want to see sell offers
    }, [user]);

    useEffect(() => {
        // Fetch active listings
        fetch(`${API_BASE}/api/markets?status=active`)
            .then(res => res.json())
            .then(data => {
                setListings(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch market data", err);
                setLoading(false);
            });
    }, [refreshTrigger]);

    const showNotification = (type: 'success' | 'error', msg: string) => {
        setNotification({ type, msg });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const type = user?.role === 'farmer' ? 'sell' : 'buy';
            const payload = {
                user_name: user?.name || 'Anonymous',
                type,
                location: formData.location,
                crop_type: formData.crop_type,
                quantity_tons: Number(formData.quantity_tons),
                price_per_ton: Number(formData.price_per_ton),
                contact_info: formData.contact_info
            };

            const res = await fetch(`${API_BASE}/api/markets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to create listing');

            setFormData({ location: '', crop_type: '', quantity_tons: '', price_per_ton: '', contact_info: '' });
            setRefreshTrigger(prev => prev + 1);
            showNotification('success', 'Listing posted successfully! It is now visible to the network.');

        } catch (error) {
            console.error(error);
            showNotification('error', 'Failed to create listing. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleMarkAsSold = async (id: string) => {
        try {
            await fetch(`${API_BASE}/api/markets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'sold' })
            });

            // Also log action
            await fetch(`${API_BASE}/api/actions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action_type: 'TRANSACTION_COMPLETED',
                    details: `Market Listing ${id} marked as sold by ${user?.name}`
                })
            });

            setRefreshTrigger(prev => prev + 1);
            showNotification('success', 'Transaction completed & recorded on Blockchain.');
            setEscrowState('idle'); // Reset for next time
        } catch (err) {
            console.error(err);
            showNotification('error', 'Error updating transaction status');
        }
    };

    const filteredListings = listings.filter(l => {
        if (activeTab === 'all') return true;
        return l.type === activeTab;
    });

    if (loading) {
        return <div className="min-h-screen pt-24 text-center">{t('loading')}</div>;
    }

    return (
        <section className="py-16 pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen relative">

            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-20 right-4 z-[70] px-6 py-4 rounded-xl shadow-2xl flex items-center animate-bounce ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                    {notification.type === 'success' ? <CheckCircle className="mr-3" /> : <Info className="mr-3" />}
                    <span className="font-bold">{notification.msg}</span>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* Role Banner */}
                <div className={`mb-8 p-6 rounded-xl text-white shadow-lg ${user?.role === 'farmer'
                    ? 'bg-gradient-to-r from-green-700 to-green-500'
                    : 'bg-gradient-to-r from-blue-700 to-blue-500'
                    }`}>
                    <h1 className="text-3xl font-bold flex items-center">
                        {user?.role === 'farmer' ? <span className="mr-2">🚜</span> : <span className="mr-2">🛒</span>}
                        {user?.role === 'farmer' ? t('market.banner.farmer') : t('market.banner.customer')}
                    </h1>
                    <p className="opacity-90 mt-2">
                        {user?.role === 'farmer'
                            ? t('market.banner.desc.farmer')
                            : t('market.banner.desc.customer')}
                    </p>

                </div>

                <div className={`bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100 relative ${user?.role === 'farmer' ? 'shadow-green-500/5' : 'shadow-blue-500/5'
                    }`}>
                    <div className="flex items-center mb-8">
                        <div className={`p-4 rounded-2xl mr-5 shadow-sm ${user?.role === 'farmer' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                            <Plus size={28} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                                {user?.role === 'farmer' ? t('market.form.title.sell') : t('market.form.title.buy')}
                            </h3>
                            <p className="text-gray-500 mt-1 font-medium">
                                {user?.role === 'farmer'
                                    ? 'Reach thousands of potential buyers instantly.'
                                    : 'Tell farmers what you need and get the best price.'}
                            </p>
                        </div>
                    </div>

                    {/* Suggestion Button for Customers */}
                    {user?.role === 'customer' && (
                        <div className="absolute top-8 right-8">
                            <button
                                type="button"
                                onClick={() => setIsSuggestionModalOpen(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-yellow-50 text-yellow-700 rounded-xl font-bold hover:bg-yellow-100 transition border border-yellow-200 shadow-sm"
                            >
                                <Lightbulb size={18} />
                                {t('market.btn.suggest') || 'Suggest New Crop'}
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{t('market.form.crop')}</label>
                            <input
                                placeholder="e.g. Wheat"
                                required
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-50 focus:border-green-500 outline-none transition-all font-medium text-gray-900"
                                value={formData.crop_type}
                                onChange={e => setFormData({ ...formData, crop_type: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{t('market.form.qty')}</label>
                            <input
                                placeholder="Tons"
                                required type="number"
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-50 focus:border-green-500 outline-none transition-all font-medium text-gray-900"
                                value={formData.quantity_tons}
                                onChange={e => setFormData({ ...formData, quantity_tons: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{t('market.form.price')}</label>
                            <input
                                placeholder="₹ / Ton"
                                required type="number"
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-50 focus:border-green-500 outline-none transition-all font-medium text-gray-900"
                                value={formData.price_per_ton}
                                onChange={e => setFormData({ ...formData, price_per_ton: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{t('market.form.loc')}</label>
                            <input
                                placeholder="City, State"
                                required
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-50 focus:border-green-500 outline-none transition-all font-medium text-gray-900"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1 lg:col-span-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{t('market.form.contact')}</label>
                            <input
                                placeholder="Phone/Email"
                                required
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-50 focus:border-green-500 outline-none transition-all font-medium text-gray-900"
                                value={formData.contact_info}
                                onChange={e => setFormData({ ...formData, contact_info: e.target.value })}
                            />
                        </div>

                        <button
                            disabled={submitting}
                            className={`md:col-span-2 lg:col-span-5 py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center ${user?.role === 'farmer'
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-green-500/30'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30'
                                }`}
                        >
                            {submitting ? 'Processing...' : (user?.role === 'farmer' ? t('market.btn.post.sell') : t('market.btn.post.buy'))}
                        </button>
                    </form>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white p-1 rounded-xl shadow-sm border inline-flex">
                        <button
                            onClick={() => setActiveTab('sell')}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeTab === 'sell' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            {t('market.tabs.sell')}
                        </button>
                        <button
                            onClick={() => setActiveTab('buy')}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeTab === 'buy' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            {t('market.tabs.buy')}
                        </button>
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeTab === 'all' ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            {t('market.tabs.all')}
                        </button>
                    </div>
                </div>

                {/* Listings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredListings.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No listings found for this category. Be the first to post!
                        </div>
                    ) : filteredListings.map((listing) => (
                        <div key={listing._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all relative">
                            {/* Banner for type */}
                            <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-xl text-xs font-bold uppercase text-white ${listing.type === 'sell' ? 'bg-green-500' : 'bg-blue-500'
                                }`}>
                                {listing.type === 'sell' ? t('market.card.sell') : t('market.card.buy')}
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-full ${listing.type === 'sell' ? 'bg-green-100' : 'bg-blue-100'}`}>
                                        <ShoppingCart className={listing.type === 'sell' ? 'text-green-600' : 'text-blue-600'} size={24} />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">{listing.user_name}</h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-gray-600">
                                        <Tag size={18} className="mr-2 text-gray-400" />
                                        <span className="font-semibold mr-1">{t('market.form.crop')}:</span> {listing.crop_type}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <TrendingUp size={18} className="mr-2 text-gray-400" />
                                        <span className="font-semibold mr-1">{t('market.form.qty')}:</span> {listing.quantity_tons} Tons
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <MapPin size={18} className="mr-2 text-gray-400" />
                                        <span>{listing.location}</span>
                                    </div>
                                </div>

                                <div className="border-t pt-4 flex justify-between items-center">
                                    <div>
                                        <span className="text-xs text-gray-500 block">{t('market.form.price')} / Ton</span>
                                        <span className={`text-xl font-bold ${listing.type === 'sell' ? 'text-green-600' : 'text-blue-600'}`}>
                                            ₹{listing.price_per_ton.toLocaleString()}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedListing(listing)}
                                        className={`px-4 py-2 rounded-lg text-white transition font-semibold ${listing.type === 'sell' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                    >
                                        {listing.type === 'sell' ? t('market.btn.buy') : t('market.btn.contact')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Smart Contract Escrow Modal */}
                {selectedListing && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-md">
                        {/* ... existing escrow modal content ... */}
                        <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in-95">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 flex justify-between items-center text-white">
                                <div className="flex items-center">
                                    <Shield className="mr-3 text-green-400" size={24} />
                                    <h3 className="text-xl font-bold">{t('market.escrow.title')}</h3>
                                </div>
                                <button
                                    onClick={() => { setSelectedListing(null); setEscrowState('idle'); }}
                                    className="p-2 hover:bg-white/10 rounded-full transition"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8">
                                {/* Product Summary */}
                                <div className="flex items-start mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className={`p-3 rounded-full mr-4 ${selectedListing.type === 'sell' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {selectedListing.type === 'sell' ? <ShoppingCart size={20} /> : <TrendingUp size={20} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">{selectedListing.crop_type}</h4>
                                        <div className="text-gray-500 text-sm">
                                            {selectedListing.quantity_tons} Tons • ₹{selectedListing.price_per_ton}/Ton
                                        </div>
                                        <div className="mt-1 font-mono text-xs text-gray-400">
                                            {t('market.escrow.contract_id')}: {selectedListing._id.substring(0, 12).toUpperCase()}...
                                        </div>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <div className="text-sm text-gray-500">{t('market.escrow.total_value')}</div>
                                        <div className="font-bold text-xl text-gray-900">
                                            ₹{(selectedListing.quantity_tons * selectedListing.price_per_ton).toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Escrow State Machine UI */}
                                {escrowState === 'idle' ? (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 text-sm flex items-start">
                                            <Info className="flex-shrink-0 mr-3 mt-0.5" size={18} />
                                            <p>
                                                <span dangerouslySetInnerHTML={{ __html: t('market.escrow.info.title') }} />
                                                <br />
                                                {t('market.escrow.info.desc')}
                                            </p>
                                        </div>

                                        <div className="pt-4 grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => setSelectedListing(null)}
                                                className="w-full py-3 rounded-xl border border-gray-300 font-bold text-gray-600 hover:bg-gray-50 transition"
                                            >
                                                {t('market.escrow.btn.cancel')}
                                            </button>
                                            <button
                                                onClick={initiateEscrow}
                                                className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center group"
                                            >
                                                <Lock size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                                                {t('market.escrow.btn.lock')}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {/* Progress Stepper */}
                                        <div className="relative flex justify-between">
                                            {/* Connecting Line */}
                                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                                            <div className={`absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 z-0 transition-all duration-1000 ease-out`}
                                                style={{ width: escrowState === 'init' ? '33%' : escrowState === 'locked' ? '66%' : '100%' }}>
                                            </div>

                                            {/* Step 1: Init */}
                                            <div className="relative z-10 flex flex-col items-center">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 bg-green-500 text-white">
                                                    <Lock size={14} />
                                                </div>
                                                <div className="mt-2 text-xs font-bold text-gray-600">{t('market.escrow.step.locked')}</div>
                                            </div>

                                            {/* Step 2: Transit */}
                                            <div className="relative z-10 flex flex-col items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 delay-300 ${['locked', 'paid', 'released'].includes(escrowState) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                                                    }`}>
                                                    <RefreshCw size={14} className={escrowState === 'locked' ? 'animate-spin' : ''} />
                                                </div>
                                                <div className="mt-2 text-xs font-bold text-gray-600">{t('market.escrow.step.transit')}</div>
                                            </div>

                                            {/* Step 3: Complete */}
                                            <div className="relative z-10 flex flex-col items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 delay-700 ${escrowState === 'released' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                                                    }`}>
                                                    <Check size={14} />
                                                </div>
                                                <div className="mt-2 text-xs font-bold text-gray-600">{t('market.escrow.step.released')}</div>
                                            </div>
                                        </div>

                                        {/* Dynamic Status Content */}
                                        <div className="text-center bg-gray-50 rounded-xl p-6 border border-gray-100">
                                            {escrowState === 'init' && (
                                                <div className="animate-pulse">
                                                    <h4 className="font-bold text-gray-900 mb-1">{t('market.escrow.status.init.title')}</h4>
                                                    <p className="text-sm text-gray-500">{t('market.escrow.status.init.desc')}</p>
                                                </div>
                                            )}
                                            {escrowState === 'locked' && (
                                                <div>
                                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                                                        <Shield size={32} />
                                                    </div>
                                                    <h4 className="font-bold text-gray-900 mb-1">{t('market.escrow.status.locked.title')}</h4>
                                                    <p className="text-sm text-gray-500 mb-6">{t('market.escrow.status.locked.desc')}</p>
                                                    <button
                                                        onClick={() => setEscrowState('released')}
                                                        className="px-6 py-2 bg-gray-900 text-white rounded-lg font-bold text-sm hover:bg-black transition"
                                                    >
                                                        {t('market.escrow.btn.simulate')}
                                                    </button>
                                                </div>
                                            )}
                                            {escrowState === 'released' && (
                                                <div>
                                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                                        <CheckCircle size={32} />
                                                    </div>
                                                    <h4 className="font-bold text-gray-900 mb-1">{t('market.escrow.status.released.title')}</h4>
                                                    <p className="text-sm text-gray-500 mb-6">{t('market.escrow.status.released.desc')}</p>
                                                    <button
                                                        onClick={() => handleMarkAsSold(selectedListing._id)}
                                                        className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-500/30"
                                                    >
                                                        {t('market.escrow.btn.close')}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Crop Suggestion Modal */}
                <CropSuggestionModal
                    isOpen={isSuggestionModalOpen}
                    onClose={() => setIsSuggestionModalOpen(false)}
                />

            </div>
        </section>
    );
};

export default Marketplace;
