import { useState, useEffect } from 'react';
import { RefreshCw, Thermometer, Droplet, Wind, Activity, Database, Zap, Wifi, AlertTriangle } from 'lucide-react';
import { io } from 'socket.io-client';
import SensorGauge from './dashboard/SensorGauge';
import ActionCenter from './dashboard/ActionCenter';
import BlockchainFeed from './dashboard/BlockchainFeed';
import { API_BASE } from '../services/apiConfig';

// Initialize Socket outside component to avoid re-connections
const socket = io(API_BASE);

interface SensorData {
    moisture: number;
    ph: number;
    temperature: number;
    humidity: number;
}

interface PredictionData {
    recommended_crop: string;
    crop_confidence: number;
    irrigation_time: string;
    irrigation_confidence: number;
    soil_health: string;
    soil_confidence: number;
    predicted_yield: number;
    timestamp: string;
}

interface BlockData {
    block_number: number;
    current_hash: string;
    previous_hash: string;
    data_type: string;
    verified: boolean;
    timestamp: string;
}

const AgroCommand = () => {
    const [loading, setLoading] = useState(true);
    const [simulating, setSimulating] = useState(false);

    // Connection State
    const [isConnected, setIsConnected] = useState(socket.connected);

    // Data State
    const [sensors, setSensors] = useState<SensorData | null>(null);
    const [prediction, setPrediction] = useState<PredictionData | null>(null);
    const [blocks, setBlocks] = useState<BlockData[]>([]);

    // Toast State for Alerts
    const [alertMsg, setAlertMsg] = useState<{ msg: string, type: 'success' | 'warning' } | null>(null);

    const fetchData = async () => {
        try {
            const [sensorRes, predRes, blockRes] = await Promise.all([
                fetch(`${API_BASE}/api/sensors/latest`),
                fetch(`${API_BASE}/api/predictions/latest`),
                fetch(`${API_BASE}/api/blockchain`)
            ]);

            if (sensorRes.ok) setSensors(await sensorRes.json());
            if (predRes.ok) setPrediction(await predRes.json());
            if (blockRes.ok) setBlocks(await blockRes.json());

        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // SOCKET LISTENERS
        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));

        socket.on('sensor_update', (data: SensorData) => {
            setSensors(data);
        });

        socket.on('prediction_update', (data: PredictionData) => {
            setPrediction(data);
        });

        socket.on('block_mined', (newBlock: BlockData) => {
            // Prepend new block
            setBlocks(prev => [newBlock, ...prev].slice(0, 10)); // Keep last 10
        });

        socket.on('new_alert', (alert: any) => {
            setAlertMsg({ msg: alert.message, type: 'warning' });
            // Auto hide
            setTimeout(() => setAlertMsg(null), 5000);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('sensor_update');
            socket.off('prediction_update');
            socket.off('block_mined');
            socket.off('new_alert');
        };
    }, []);

    const handleSimulate = async () => {
        setSimulating(true);
        try {
            // Generate random realistic values
            // Simulating LOW MOISTURE (<30) approx 20% of the time to trigger auto-action
            const isDry = Math.random() < 0.2;

            const payload = {
                moisture: isDry ? 25 : parseFloat((Math.random() * (85 - 20) + 20).toFixed(1)), // Force trigger if isDry
                ph: parseFloat((Math.random() * (8.5 - 5.5) + 5.5).toFixed(1)),
                temperature: parseFloat((Math.random() * (35 - 15) + 15).toFixed(1)),
                humidity: parseFloat((Math.random() * (90 - 40) + 40).toFixed(1))
            };

            await fetch(`${API_BASE}/api/sensors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // No need to fetchData() manually, socket will update us!

        } catch (err) {
            console.error("Simulation failed", err);
        } finally {
            setSimulating(false);
        }
    };

    if (loading && !sensors) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin text-green-600"><RefreshCw size={32} /></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12 relative">

            {/* Global Alert Toast */}
            {alertMsg && (
                <div className="fixed top-24 right-4 z-50 bg-white border-l-4 border-amber-500 shadow-2xl p-4 rounded-xl flex items-center animate-bounce">
                    <div className="mr-3 bg-amber-100 p-2 rounded-full text-amber-600">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800">System Alert</h4>
                        <p className="text-sm text-gray-600">{alertMsg.msg}</p>
                    </div>
                </div>
            )}

            {/* Header handled by Navigation in App.tsx typically, but adding a dashboard header here */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <Database className="mr-3 text-green-600" />
                            AgroCommand Center
                        </h1>
                        <div className="flex items-center space-x-4 mt-1">
                            <p className="text-sm text-gray-500">Live IoT Stream • AI Analysis • Blockchain Verified</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                <Wifi size={12} className="mr-1" />
                                {isConnected ? 'WebSocket Connected' : 'Disconnected'}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleSimulate}
                        disabled={simulating}
                        className={`flex items-center space-x-2 px-6 py-2 rounded-full font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 ${simulating ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-blue-600 hover:shadow-green-500/30'}`}
                    >
                        <Zap size={18} className={simulating ? 'animate-spin' : ''} />
                        <span>{simulating ? 'Sending Data...' : 'Simulate IoT Data'}</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Live Sensor Grid</h2>
                            <p className="text-gray-500 font-medium mt-1">Real-time IoT monitoring across your farm network</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className={`px-4 py-2 rounded-full font-bold text-sm flex items-center shadow-sm transition-all ${isConnected
                                ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-500/20'
                                : 'bg-red-100 text-red-700 ring-1 ring-red-500/20'
                                }`}>
                                <div className={`w-2.5 h-2.5 rounded-full mr-2 ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                                {isConnected ? 'LIVE (WebSocket)' : 'Disconnected'}
                            </div>
                        </div>
                    </div>

                    {/* Sensor Grid - Premium Spacing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <SensorGauge
                            label="Soil Moisture"
                            value={sensors?.moisture || 0}
                            unit="%"
                            max={100}
                            icon={Droplet}
                            color="text-blue-500"
                            warningLow={30}
                        />
                        <SensorGauge
                            label="Temperature"
                            value={sensors?.temperature || 0}
                            unit="°C"
                            max={50}
                            icon={Thermometer}
                            color="text-orange-500"
                            warningHigh={40}
                        />
                        <SensorGauge
                            label="Humidity"
                            value={sensors?.humidity || 0}
                            unit="%"
                            max={100}
                            icon={Wind}
                            color="text-teal-500"
                        />
                        <SensorGauge
                            label="Soil pH"
                            value={sensors?.ph || 0}
                            unit="pH"
                            max={14}
                            icon={Activity}
                            color="text-purple-500"
                            warningLow={5.5}
                            warningHigh={7.5}
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleSimulate}
                            disabled={simulating}
                            className="flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold shadow-sm hover:shadow-md hover:bg-gray-50 transition-all active:scale-[0.98]"
                        >
                            <RefreshCw size={18} className={`mr-2 ${simulating ? 'animate-spin text-gray-500' : 'text-indigo-500'}`} />
                            <span>{simulating ? 'Sending Data...' : 'Simulate Sensor Update'}</span>
                        </button>
                    </div>

                    {/* Grid for Action Center and Blockchain Feed */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <ActionCenter prediction={prediction} />
                        </div>
                        <div>
                            <BlockchainFeed blocks={blocks} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgroCommand;
