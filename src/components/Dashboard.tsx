import { useState, useEffect } from 'react';
import { Activity, Droplets, ThermometerSun, Wind, Users, MapPin, Lock } from 'lucide-react';
import { API_BASE } from '../services/apiConfig';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('monitoring');
  const [sensorData, setSensorData] = useState<any>(null);
  const [predictions, setPredictions] = useState<any>(null);
  const [marketListings, setMarketListings] = useState<any[]>([]);
  const [blockchainRecords, setBlockchainRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic auto-seed on mount for demo purposes
    // IN REAL APP: Remove this auto-seed call
    fetch(`${API_BASE}/api/seed`, { method: 'POST' })
      .then(() => loadDashboardData())
      .catch(err => console.error("Seeding failed", err));
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch sensor data
      const sensorRes = await fetch(`${API_BASE}/api/sensors/latest`);
      const sensorJson = await sensorRes.json();
      if (sensorJson) setSensorData(sensorJson);

      // Fetch predictions
      const predsRes = await fetch(`${API_BASE}/api/predictions/latest`);
      const predsJson = await predsRes.json();
      if (predsJson) setPredictions(predsJson);

      // Fetch market listings
      const marketRes = await fetch(`${API_BASE}/api/markets`);
      const marketJson = await marketRes.json();
      if (marketJson) setMarketListings(marketJson);

      // Fetch blockchain records
      const blockRes = await fetch(`${API_BASE}/api/blockchain`);
      const blockJson = await blockRes.json();
      if (blockJson) setBlockchainRecords(blockJson);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const SensorCard = ({ icon: Icon, label, value, status }: any) => (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <Icon className="text-blue-600" size={32} />
        <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
          Live
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <p className="text-sm text-green-600 font-semibold">Status: {status}</p>
    </div>
  );

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Real-Time Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Monitor your farm, get AI recommendations, and connect with buyers
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-gray-200 flex flex-wrap">
            {['monitoring', 'predictions', 'market', 'blockchain'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-semibold transition-colors ${activeTab === tab
                  ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {tab === 'monitoring' && 'IoT Monitoring'}
                {tab === 'predictions' && 'AI Predictions'}
                {tab === 'market' && 'Market Linkage'}
                {tab === 'blockchain' && 'Blockchain'}
              </button>
            ))}
          </div>

          <div className="p-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <p className="mt-4 text-gray-600">Loading data...</p>
              </div>
            ) : (
              <>
                {activeTab === 'monitoring' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">Live Sensor Data</h3>
                      <button
                        onClick={async () => {
                          setLoading(true);
                          try {
                            // Generate random sensor data
                            const payload = {
                              moisture: Math.random() * 60 + 20, // 20-80
                              ph: Math.random() * 4 + 4,         // 4-8
                              temperature: Math.random() * 20 + 15, // 15-35
                              humidity: Math.random() * 40 + 30    // 30-70
                            };

                            await fetch(`${API_BASE}/api/sensors`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(payload)
                            });

                            // Reload to see new Prediction & Block
                            await loadDashboardData();
                          } catch (e) {
                            console.error(e);
                            setLoading(false);
                          }
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-colors flex items-center"
                      >
                        <Activity className="mr-2" size={18} />
                        Simulate Field Data
                      </button>
                    </div>

                    {sensorData ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <SensorCard
                          icon={Droplets}
                          label="Soil Moisture"
                          value={`${sensorData.moisture.toFixed(1)}%`}
                          status={sensorData.moisture > 40 && sensorData.moisture < 60 ? 'Optimal' : 'Alert'}
                        />
                        <SensorCard
                          icon={Activity}
                          label="pH Level"
                          value={sensorData.ph.toFixed(1)}
                          status={sensorData.ph >= 6 && sensorData.ph <= 7.5 ? 'Good' : 'Attention'}
                        />
                        <SensorCard
                          icon={ThermometerSun}
                          label="Temperature"
                          value={`${sensorData.temperature.toFixed(1)}°C`}
                          status="Normal"
                        />
                        <SensorCard
                          icon={Wind}
                          label="Humidity"
                          value={`${sensorData.humidity.toFixed(1)}%`}
                          status="Optimal"
                        />
                      </div>
                    ) : (
                      <p className="text-gray-500">No sensor data available</p>
                    )}
                  </div>
                )}

                {activeTab === 'predictions' && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">AI-Powered Recommendations</h3>
                    {predictions ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-100 p-6 rounded-xl shadow-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-bold text-gray-900">Recommended Crop</h4>
                            <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                              {predictions.crop_confidence}%
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">{predictions.recommended_crop}</p>
                        </div>
                        <div className="bg-blue-100 p-6 rounded-xl shadow-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-bold text-gray-900">Next Irrigation</h4>
                            <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                              {predictions.irrigation_confidence}%
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">{predictions.irrigation_time}</p>
                        </div>
                        <div className="bg-amber-100 p-6 rounded-xl shadow-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-bold text-gray-900">Soil Health</h4>
                            <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                              {predictions.soil_confidence}%
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">{predictions.soil_health}</p>
                        </div>
                        <div className="bg-purple-100 p-6 rounded-xl shadow-lg">
                          <h4 className="text-lg font-bold text-gray-900 mb-3">Expected Yield</h4>
                          <p className="text-2xl font-bold text-gray-900">{predictions.predicted_yield?.toFixed(2)} tons/ha</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No predictions available</p>
                    )}
                  </div>
                )}

                {activeTab === 'market' && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Buyers & Market Prices</h3>
                    {marketListings.length > 0 ? (
                      <div className="space-y-4">
                        {marketListings.map((market) => (
                          <div key={market.id} className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex flex-wrap items-center justify-between mb-4">
                              <div className="flex items-center space-x-4">
                                <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center">
                                  <Users className="text-white" size={24} />
                                </div>
                                <div>
                                  <h4 className="text-xl font-bold text-gray-900">{market.buyer_name}</h4>
                                  <p className="text-sm text-gray-600 flex items-center">
                                    <MapPin size={14} className="mr-1" />
                                    {market.location}
                                  </p>
                                </div>
                              </div>
                              <span className={`px-4 py-2 rounded-full font-semibold ${market.demand_level === 'High' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                {market.demand_level} Demand
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Crop Required</p>
                                <p className="font-semibold text-gray-900">{market.crop_type}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Quantity</p>
                                <p className="font-semibold text-gray-900">{market.quantity_tons} tons</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Price per Ton</p>
                                <p className="font-semibold text-green-600">₹{market.price_per_ton.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No market listings available</p>
                    )}
                  </div>
                )}

                {activeTab === 'blockchain' && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Blockchain Transaction Records</h3>
                    {blockchainRecords.length > 0 ? (
                      <div className="space-y-4">
                        {blockchainRecords.map((record) => (
                          <div key={record.id} className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl shadow-lg">
                            <div className="flex flex-wrap items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-4 mb-3">
                                  <span className="bg-purple-600 text-white px-3 py-1 rounded-lg font-mono text-sm">
                                    #{record.block_number}
                                  </span>
                                  <span className="font-semibold text-gray-900">{record.data_type}</span>
                                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                                    <Lock size={12} className="mr-1" />
                                    {record.verified ? 'Verified' : 'Pending'}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  <p className="mb-2">Timestamp: {new Date(record.timestamp).toLocaleString()}</p>
                                  <p className="font-mono bg-gray-100 px-3 py-1 rounded inline-block text-xs break-all">
                                    {record.current_hash.substring(0, 32)}...
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No blockchain records available</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
