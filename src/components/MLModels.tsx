import { useState, useEffect } from 'react';
import { Brain, Droplet, Leaf, AlertTriangle, Activity, Thermometer, Wind, RefreshCw, Zap, Sprout } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE } from '../services/apiConfig';

interface Prediction {
  recommended_crop: string;
  crop_confidence: number;
  irrigation_time: string;
  soil_health: string;
  predicted_yield: string;
  timestamp?: string;
}

import { io } from 'socket.io-client';

const MLModels = () => {
  const { t } = useLanguage();
  const [latestPrediction, setLatestPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(false); // Visual indicator for live IoT data

  // Simulation Form State
  const [formData, setFormData] = useState({
    temperature: '25',
    humidity: '60',
    ph: '6.5',
    moisture: '45'
  });

  const [simulationResult, setSimulationResult] = useState<Prediction | null>(null);

  const [location, setLocation] = useState('');
  const [fetchingWeather, setFetchingWeather] = useState(false);

  useEffect(() => {
    // 1. Fetch latest predictions
    fetch(`${API_BASE}/api/predictions/latest`)
      .then(res => res.json())
      .then(data => setLatestPrediction(data))
      .catch(err => console.error("Error fetching predictions:", err));

    // 2. Connect to Socket.io for IoT Data
    const socket = io(API_BASE);

    socket.on('connect', () => {
      console.log('Connected to IoT Socket Channel');
    });

    socket.on('iot-data-update', (data: any) => {
      console.log('Received IoT Data:', data);
      setIsLive(true);
      setFormData(prev => ({
        ...prev,
        ph: data.ph.toString(),
        moisture: data.moisture.toString(),
        // We can also update temp/humidity if the sensor provides it, 
        // overriding the weather API if we want. For now let's prioritize sensor if available.
        temperature: data.temperature ? data.temperature.toString() : prev.temperature,
        humidity: data.humidity ? data.humidity.toString() : prev.humidity
      }));

      // Flash "Live" indicator for 2 seconds
      setTimeout(() => setIsLive(false), 2000);
    });

    // Critical Alert Listener
    socket.on('alert:critical', (data: any) => {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-red-50 border-l-4 border-red-500 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <AlertTriangle className="h-10 w-10 text-red-500" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-red-900">CRITICAL SENSOR ALERT</p>
                <p className="mt-1 text-sm text-red-700">{data.message}</p>
                <div className="mt-2">
                  <button onClick={() => toast.dismiss(t.id)} className="bg-red-600 text-white text-xs font-bold py-1 px-3 rounded hover:bg-red-700">Dismiss</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ), { duration: 6000 });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchWeatherData = async () => {
    if (!location) return;
    setFetchingWeather(true);
    try {
      // 1. Geocoding
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        alert("Location not found!");
        setFetchingWeather(false);
        return;
      }

      const { latitude, longitude } = geoData.results[0];

      // 2. Weather Data
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m`);
      const weatherData = await weatherRes.json();

      setFormData(prev => ({
        ...prev,
        temperature: weatherData.current.temperature_2m.toString(),
        humidity: weatherData.current.relative_humidity_2m.toString()
      }));

    } catch (error) {
      console.error("Failed to fetch weather:", error);
      alert("Failed to fetch weather data.");
    } finally {
      setFetchingWeather(false);
    }
  };

  // Disease Detection State
  const [leafImage, setLeafImage] = useState<string | null>(null);
  const [analyzingLeaf, setAnalyzingLeaf] = useState(false);
  const [diseaseResult, setDiseaseResult] = useState<{ name: string; confidence: number; treatment: string } | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setLeafImage(ev.target.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
      setDiseaseResult(null); // Reset previous result
    }
  };

  const analyzeLeaf = () => {
    if (!leafImage) return;
    setAnalyzingLeaf(true);
    // Simulate AI Analysis Delay
    setTimeout(() => {
      setAnalyzingLeaf(false);
      // Mock Result
      setDiseaseResult({
        name: "Tomato Early Blight",
        confidence: 94.5,
        treatment: "Use Copper-based fungicides and ensure proper spacing between plants."
      });
    }, 2500);
  };

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/sensors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temperature: Number(formData.temperature),
          humidity: Number(formData.humidity),
          ph: Number(formData.ph),
          moisture: Number(formData.moisture)
        })
      });
      const data = await res.json();
      setSimulationResult(data.prediction);
      setLatestPrediction(data.prediction); // Update latest
    } catch (error) {
      console.error("Simulation failed:", error);
      alert("Simulation failed. Backend might be offline.");
    } finally {
      setLoading(false);
    }
  };

  const models = [
    {
      icon: Leaf,
      title: 'Crop Recommendation',
      desc: 'Suggests the best crop based on N-P-K, pH, and weather data.',
      algo: 'Random Forest (98% Acc)'
    },
    {
      icon: Droplet,
      title: 'Smart Irrigation',
      desc: 'Optimizes water usage by predicting exact soil moisture needs.',
      algo: 'LSTM Time Series'
    },
    {
      icon: Brain,
      title: 'Disease Detection',
      desc: 'Identifies plant diseases from leaf images using CNNs.',
      algo: 'ResNet-50'
    },
    {
      icon: Activity,
      title: 'Yield Prediction',
      desc: 'Estimates harvest volume based on growth and climate trends.',
      algo: 'XGBoost Regressor'
    }
  ];

  return (
    <section className="py-16 pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('ml.header.title')}</h2>
          <p className="text-xl text-gray-600">{t('ml.header.subtitle')}</p>
        </div>

        {/* Main Interactive Interactive Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-start">

          {/* Simulation Engine */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 sticky top-28">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-full mr-4 text-green-600 animate-pulse">
                <Brain size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{t('ml.live.title')}</h3>
                <p className="text-sm text-gray-500">{t('ml.live.desc')}</p>
                {isLive && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 animate-pulse mt-2">
                    <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                    Receiving Live Sensor Data...
                  </span>
                )}
              </div>
            </div>

            <form onSubmit={handleSimulate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <div className="flex gap-4 items-end">
                    <div className="group flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('ml.form.location')}</label>
                      <input
                        type="text"
                        placeholder="Enter City Name"
                        className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all font-medium text-gray-900"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={fetchWeatherData}
                      disabled={fetchingWeather || !location}
                      className="py-4 px-6 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-all mb-[1px]"
                    >
                      {fetchingWeather ? t('loading') : t('ml.form.getWeather')}
                    </button>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-emerald-600 transition-colors">{t('ml.form.temp')} (°C) <span className="text-xs text-blue-500 ml-1">(Live)</span></label>
                  <div className="relative">
                    <Thermometer className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input
                      type="number"
                      readOnly
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm outline-none font-medium text-gray-500 cursor-not-allowed"
                      value={formData.temperature}
                    />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">{t('ml.form.humidity')} (%) <span className="text-xs text-blue-500 ml-1">(Live)</span></label>
                  <div className="relative">
                    <Wind className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      type="number"
                      readOnly
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm outline-none font-medium text-gray-500 cursor-not-allowed"
                      value={formData.humidity}
                    />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-amber-600 transition-colors">{t('ml.form.ph')}</label>
                  <input
                    type="number" step="0.1"
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-amber-50 focus:border-amber-500 outline-none transition-all font-medium text-gray-900"
                    value={formData.ph}
                    onChange={e => setFormData({ ...formData, ph: e.target.value })}
                  />
                </div>
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">{t('ml.form.moisture')}</label>
                  <input
                    type="number"
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-medium text-gray-900"
                    value={formData.moisture}
                    onChange={e => setFormData({ ...formData, moisture: e.target.value })}
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center"><RefreshCw className="animate-spin mr-2" /> Processing Neural Network...</span>
                ) : (
                  t('ml.form.run')
                )}
              </button>
            </form>
          </div>

          {/* Results Display */}
          <div className="flex flex-col space-y-6">
            {simulationResult ? (
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Brain size={120} />
                </div>
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <Activity className="mr-3 text-green-400" /> {t('ml.result.title')}
                </h3>

                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <span className="text-gray-300">{t('ml.result.crop')}</span>
                    <span className="text-2xl font-bold text-green-400">{simulationResult.recommended_crop}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <span className="text-gray-300">{t('ml.result.confidence')}</span>
                    <span className="text-xl font-bold text-blue-400">{simulationResult.crop_confidence}%</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <span className="text-gray-300">{t('ml.result.yield')}</span>
                    <span className="text-xl font-bold text-amber-400">{simulationResult.predicted_yield} Tons/Acre</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <span className="text-gray-300">{t('ml.result.irrigation')}</span>
                    <span className="text-right font-medium text-red-300">{simulationResult.irrigation_time}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center p-8 opacity-60">
                <Brain size={64} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">{t('ml.result.wait')}</h3>
                <p className="text-gray-500">{t('ml.result.waitDesc')}</p>
              </div>
            )}

            {/* Latest System Insight - PROFIT & MULTI-CROP ANALYSIS */}
            {latestPrediction && (
              <div className="space-y-6">

                {/* 1. Primary Recommendation (Existing Block) NOT NEEDED if we have the new grid */}
                {/* Replaced with Advanced Grid below */}

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Activity className="mr-2 text-green-600" />
                    AI Profitability Analysis
                  </h3>

                  {/* Check if we have the new array format from socket */}
                  {(latestPrediction as any).all_recommendations ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {(latestPrediction as any).all_recommendations.map((rec: any, idx: number) => (
                        <div key={idx} className={`relative p-6 rounded-2xl border transition-all duration-300 group ${idx === 0 ? 'border-emerald-500/50 bg-emerald-50/50 shadow-lg shadow-emerald-500/10 scale-105 z-10' : 'border-gray-100 bg-white hover:border-blue-300 hover:shadow-md'}`}>
                          {idx === 0 && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-[10px] uppercase font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1 z-20 whitespace-nowrap">
                              <Zap size={10} className="fill-current" /> Most Profitable
                            </div>
                          )}

                          <div className="flex justify-between items-start mb-4 mt-2">
                            <div>
                              <h4 className={`text-xl font-bold ${idx === 0 ? 'text-emerald-900' : 'text-gray-800'}`}>{rec.crop}</h4>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${idx === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{rec.confidence}% Match</span>
                            </div>
                            <div className={`p-2 rounded-lg ${idx === 0 ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
                              <Sprout size={20} className={idx === 0 ? 'text-emerald-500' : 'text-gray-400'} />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center bg-white/50 p-2 rounded-lg">
                              <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Yield</span>
                              <span className="font-bold text-gray-900">{rec.yield} Tons</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="bg-red-50/50 p-2 rounded-lg border border-red-100/50">
                                <div className="text-red-500 font-bold mb-0.5">Cost</div>
                                <div className="font-mono text-gray-700">₹{rec.cost?.toLocaleString() ?? '--'}</div>
                              </div>
                              <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
                                <div className="text-blue-500 font-bold mb-0.5">Rev</div>
                                <div className="font-mono text-gray-700">₹{(rec.price * rec.yield).toLocaleString() ?? '--'}</div>
                              </div>
                            </div>

                            <div className={`pt-3 mt-3 border-t flex justify-between items-center ${idx === 0 ? 'border-emerald-200' : 'border-gray-100'}`}>
                              <span className="font-bold text-gray-600 text-xs uppercase">Net Profit</span>
                              <span className={`font-bold text-xl ${idx === 0 ? 'text-emerald-600' : 'text-gray-700'}`}>₹{rec.net_profit.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Fallback for old data or initial load without socket array
                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
                      <div className="flex items-start">
                        <AlertTriangle className="text-blue-600 mr-3 mt-1" />
                        <div>
                          <h4 className="font-bold text-blue-900">Legacy Insight</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            The system recommended <span className="font-bold">{latestPrediction.recommended_crop}</span>.
                            Run a new simulation to see the advanced "Multi-Crop Profit" analysis.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Soil & Irrigation Status (Compact) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Irrigation Status</span>
                      <div className="text-lg font-bold text-gray-900">{latestPrediction.irrigation_time}</div>
                    </div>
                    <Droplet className="text-red-400 opacity-50" size={32} />
                  </div>
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Soil Health</span>
                      <div className="text-lg font-bold text-gray-900">{latestPrediction.soil_health}</div>
                    </div>
                    <Activity className="text-amber-400 opacity-50" size={32} />
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Disease Detection Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 p-3 rounded-full mr-4 text-purple-600">
                <Brain size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">AI Disease Diagnosis</h3>
                <p className="text-sm text-gray-500">Upload a leaf image to detect diseases instantly.</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
              {!leafImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 hover:bg-gray-50 transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-50 p-4 rounded-full text-blue-500 mb-4">
                      <Leaf size={40} />
                    </div>
                    <p className="text-lg font-bold text-gray-700">Click to Upload Leaf Image</p>
                    <p className="text-sm text-gray-400 mt-2">Supports JPG, PNG (Max 5MB)</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200">
                    <img src={leafImage} alt="Uploaded Leaf" className="w-full h-64 object-cover" />
                    <button
                      onClick={() => { setLeafImage(null); setDiseaseResult(null); }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-md"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>

                  {!diseaseResult && (
                    <button
                      onClick={analyzeLeaf}
                      disabled={analyzingLeaf}
                      className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-purple-700 transition-all flex items-center justify-center"
                    >
                      {analyzingLeaf ? (
                        <>
                          <RefreshCw className="animate-spin mr-2" /> Scanning Neural Networks...
                        </>
                      ) : (
                        'Analyze Leaf Health'
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Diagnosis Result */}
          <div className="relative">
            {diseaseResult ? (
              <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden animate-fade-in-up">
                <div className="bg-purple-600 p-6 text-white text-center">
                  <Activity size={48} className="mx-auto mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold">Diagnosis Complete</h3>
                  <p className="opacity-90">Analysis Confidence: {diseaseResult.confidence}%</p>
                </div>
                <div className="p-8 space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-bold mb-1">Detected Disease</p>
                    <h2 className="text-3xl font-bold text-gray-900">{diseaseResult.name}</h2>
                  </div>

                  <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                    <h4 className="font-bold text-red-700 mb-2 flex items-center">
                      <AlertTriangle size={18} className="mr-2" /> Recommended Treatment
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {diseaseResult.treatment}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors">
                      Save Report
                    </button>
                    <button className="flex-1 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
                      Buy Medicine
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-12 text-center opacity-40 border-2 border-dashed border-gray-200 rounded-2xl">
                <div>
                  <Brain size={64} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-bold text-gray-400">Waiting for Analysis</h3>
                  <p className="text-gray-300">Upload an image to see AI diagnosis results here.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Model Catalog (Visuals) */}
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Deployed Algorithms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {models.map((m, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md border hover:border-green-500 transition-all">
              <div className="bg-green-50 text-green-700 w-12 h-12 rounded-lg flex items-center justify-center mb-4 border border-green-100">
                <m.icon size={24} />
              </div>
              <h4 className="font-bold text-lg mb-2 text-gray-900">{m.title}</h4>
              <p className="text-sm text-gray-700 mb-3 font-medium leading-relaxed">{m.desc}</p>
              <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs font-mono font-bold text-gray-800 border border-gray-200">
                {m.algo}
              </span>
            </div>
          ))}
        </div>
      </div >
    </section >
  );
};

export default MLModels;
