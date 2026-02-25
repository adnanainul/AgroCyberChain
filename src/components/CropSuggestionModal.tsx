import React, { useState } from 'react';
import { X, Send, Leaf } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE } from '../services/apiConfig';

interface CropSuggestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    userRole?: string;
}

const CropSuggestionModal: React.FC<CropSuggestionModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [cropName, setCropName] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setNotification(null);

        try {
            const res = await fetch(`${API_BASE}/api/suggestions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cropName, description }) // author is handled by backend or anonymous for now
            });

            if (!res.ok) throw new Error('Failed to submit suggestion');

            setNotification({ type: 'success', msg: t('suggestion.success') || 'Suggestion submitted successfully!' });
            setCropName('');
            setDescription('');
            setTimeout(() => {
                onClose();
                setNotification(null);
            }, 2000);
        } catch (error) {
            console.error(error);
            setNotification({ type: 'error', msg: t('suggestion.error') || 'Failed to submit. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden transform transition-all scale-100 zoom-in-95">

                {/* Header */}
                <div className="bg-gradient-to-r from-green-700 to-emerald-600 p-6 flex justify-between items-center text-white">
                    <div className="flex items-center">
                        <Leaf className="mr-3 text-green-200" size={24} />
                        <h3 className="text-xl font-bold">{t('suggestion.title') || 'Suggest New Crop'}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    <p className="text-gray-500 mb-6 text-sm">
                        {t('suggestion.desc') || 'Don\'t see the crop you want? Suggest it to our farmers!'}
                    </p>

                    {notification && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center ${notification.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                            {notification.msg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                                {t('suggestion.crop_name') || 'Crop Name'}
                            </label>
                            <input
                                placeholder="e.g. Dragon Fruit"
                                required
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-50 focus:border-green-500 outline-none transition-all font-medium text-gray-900"
                                value={cropName}
                                onChange={e => setCropName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                                {t('suggestion.description') || 'Why do you want this?'}
                            </label>
                            <textarea
                                placeholder="Tell us more about the demand..."
                                rows={3}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-50 focus:border-green-500 outline-none transition-all font-medium text-gray-900 resize-none"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition"
                            >
                                {t('cancel') || 'Cancel'}
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition shadow-lg shadow-green-500/30 flex items-center justify-center disabled:opacity-70"
                            >
                                {submitting ? 'Sending...' : (
                                    <>
                                        <Send size={18} className="mr-2" />
                                        {t('submit') || 'Submit'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CropSuggestionModal;
