import { useState } from 'react';
import { AlertTriangle, Droplet, Sprout, Activity, Zap, Check } from 'lucide-react';
import { API_BASE } from '../../services/apiConfig';

interface Prediction {
    recommended_crop: string;
    crop_confidence: number;
    irrigation_time: string;
    irrigation_confidence: number;
    soil_health: string;
    soil_confidence: number;
    predicted_yield: number;
    timestamp: string;
}

const ActionCenter = ({ prediction }: { prediction: Prediction | null }) => {
    const [processing, setProcessing] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    if (!prediction) return <div className="text-gray-500 italic text-center p-4">Waiting for analysis...</div>;

    const isUrgent = prediction.irrigation_time.toLowerCase().includes('immediately') ||
        prediction.soil_health.toLowerCase().includes('risk');

    const triggerAction = async (action: string) => {
        setProcessing(action);
        setSuccessMsg(null);
        try {
            await fetch(`${API_BASE}/api/actions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action_type: action,
                    details: `Manual trigger based on recommendation: ${prediction.irrigation_time}`
                })
            });
            // Simulate hardware delay
            setTimeout(() => {
                setProcessing(null);
                setSuccessMsg(`${action} Initiated & Logged to Blockchain`);
                setTimeout(() => setSuccessMsg(null), 3000); // Clear after 3s
            }, 1000);
        } catch (err) {
            console.error(err);
            setProcessing(null);
        }
    };

    return (
        <div className={`rounded-2xl p-6 shadow-sm border ${isUrgent ? 'bg-red-50/50 border-red-200' : 'bg-white border-gray-100'}`}>
            <h3 className="text-xl font-extrabold mb-6 flex items-center text-gray-900 tracking-tight">
                <div className={`p-2 rounded-lg mr-3 ${isUrgent ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    <Activity size={20} />
                </div>
                ML Action Center
                {isUrgent && (
                    <span className="ml-auto text-[10px] bg-red-100 text-red-600 px-3 py-1 rounded-full animate-pulse font-bold tracking-wide uppercase border border-red-200">
                        Critical Attention
                    </span>
                )}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Crop Recommendation */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recommended Crop</span>
                        <Sprout className="text-emerald-500" size={18} />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{prediction.recommended_crop}</div>
                    <div className="flex items-center mt-2">
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mr-2">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${prediction.crop_confidence}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600">{prediction.crop_confidence}%</span>
                    </div>
                </div>

                {/* Irrigation Plan */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Watering Schedule</span>
                        <Droplet className="text-blue-500" size={18} />
                    </div>
                    <div className={`text-lg font-bold ${prediction.irrigation_time.includes('Immediately') ? 'text-red-600' : 'text-gray-900'}`}>
                        {prediction.irrigation_time}
                    </div>

                    {/* Action Button for Irrigation */}
                    <button
                        onClick={() => triggerAction('IRRIGATION')}
                        disabled={!!processing}
                        className={`mt-4 w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center transition-all bg-gradient-to-r shadow-md opacity-90 hover:opacity-100 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 ${processing === 'IRRIGATION'
                            ? 'from-gray-100 to-gray-200 text-gray-400 shadow-none cursor-not-allowed transform-none'
                            : 'from-blue-600 to-indigo-600 text-white shadow-blue-500/30'
                            }`}
                    >
                        {processing === 'IRRIGATION' ? (
                            <span className="flex items-center"><Zap size={14} className="animate-spin mr-2" /> Activating...</span>
                        ) : (
                            <><Zap size={14} className="mr-2 fill-current" /> Trigger Pump</>
                        )}
                    </button>
                </div>

                {/* Soil Health */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all md:col-span-2">
                    <div className="flex items-center mb-3">
                        <AlertTriangle className={isUrgent ? "text-red-500 mr-2" : "text-amber-500 mr-2"} size={18} />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Soil Diagnosis</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-lg text-gray-900">{prediction.soil_health}</span>
                        <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 font-bold">
                            Est. Yield: {prediction.predicted_yield} tons/ac
                        </span>
                    </div>
                    {/* Action Button for Fertilizer */}
                    <button
                        onClick={() => triggerAction('FERTILIZER')}
                        disabled={!!processing}
                        className={`w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center transition-all bg-gradient-to-r shadow-md opacity-90 hover:opacity-100 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 ${processing === 'FERTILIZER'
                            ? 'from-gray-100 to-gray-200 text-gray-400 shadow-none cursor-not-allowed transform-none'
                            : 'from-amber-500 to-orange-500 text-white shadow-amber-500/30'
                            }`}
                    >
                        {processing === 'FERTILIZER' ? (
                            <span className="flex items-center"><Sprout size={14} className="animate-bounce mr-2" /> Deploying...</span>
                        ) : (
                            <><Sprout size={14} className="mr-2 fill-current" /> Deploy Fertilizer Drone</>
                        )}
                    </button>
                </div>
            </div>

            {/* Success Message Area */}
            {successMsg && (
                <div className="mt-4 bg-emerald-100 text-emerald-800 p-3 rounded-xl text-center font-bold text-sm animate-in fade-in slide-in-from-bottom-2 flex items-center justify-center border border-emerald-200 shadow-sm">
                    <div className="bg-white p-1 rounded-full mr-2 text-emerald-600"><Check size={12} strokeWidth={4} /></div>
                    {successMsg}
                </div>
            )}
        </div>
    );
};

export default ActionCenter;
