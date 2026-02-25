import { useState, useEffect } from 'react';
import { Cpu, Database, Cloud, Wifi, Activity, Zap, Server, CheckCircle, XCircle } from 'lucide-react';
import { API_BASE } from '../services/apiConfig';

const Technology = () => {
  const [systemStatus, setSystemStatus] = useState({
    api: 'checking',
    database: 'checking',
    mlEngine: 'checking'
  });

  useEffect(() => {
    // Simulate/Real check of system health
    const checkHealth = async () => {
      try {
        await fetch(`${API_BASE}/api/sensors/latest`);
        setSystemStatus(prev => ({ ...prev, api: 'online', database: 'online' }));
      } catch (e) {
        setSystemStatus(prev => ({ ...prev, api: 'offline', database: 'offline' }));
      }

      try {
        await fetch(`${API_BASE}/api/predictions/latest`);
        setSystemStatus(prev => ({ ...prev, mlEngine: 'online' }));
      } catch (e) {
        setSystemStatus(prev => ({ ...prev, mlEngine: 'offline' }));
      }
    };

    checkHealth();
  }, []);

  const StatusBadge = ({ status }: { status: string }) => (
    status === 'online'
      ? <span className="flex items-center text-green-600 font-bold text-sm"><CheckCircle size={16} className="mr-1" /> Operational</span>
      : status === 'checking'
        ? <span className="flex items-center text-amber-600 font-bold text-sm"><Activity size={16} className="mr-1 animate-pulse" /> Checking...</span>
        : <span className="flex items-center text-red-600 font-bold text-sm"><XCircle size={16} className="mr-1" /> Offline</span>
  );

  const techStack = [
    {
      icon: Wifi,
      title: 'IoT Sensors',
      items: ['Soil Moisture Sensors', 'pH Meters', 'Temperature Sensors', 'Humidity Sensors', 'Water Flow Meters'],
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: Cpu,
      title: 'AI/ML Models',
      items: ['XGBoost & Random Forest', 'Time-Series Forecasting', 'Anomaly Detection', 'Predictive Analytics'],
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      icon: Database,
      title: 'Blockchain',
      items: ['SHA-256 Hashing', 'Immutable Ledger', 'Smart Contracts', 'Transaction Security'],
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      icon: Cloud,
      title: 'Cloud Platform',
      items: ['Real-time Data Processing', 'Scalable Storage', 'API Integration', 'Edge Computing'],
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
  ];

  return (
    <section className="py-16 pt-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Technology Stack
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cutting-edge technologies powering next-generation agriculture
          </p>
        </div>

        {/* Live System Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-16 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Activity className="mr-2 text-blue-600" /> System Status Monitor
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
              <div className="flex items-center"><Server size={20} className="mr-3 text-gray-400" /> API Gateway</div>
              <StatusBadge status={systemStatus.api} />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
              <div className="flex items-center"><Database size={20} className="mr-3 text-gray-400" /> MongoDB Atlas</div>
              <StatusBadge status={systemStatus.database} />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
              <div className="flex items-center"><Cpu size={20} className="mr-3 text-gray-400" /> ML Inference Engine</div>
              <StatusBadge status={systemStatus.mlEngine} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {techStack.map((tech, index) => (
            <div key={index} className={`${tech.bg} p-8 rounded-xl shadow-lg hover:shadow-xl transition-all`}>
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-md">
                <tech.icon className={tech.color} size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{tech.title}</h3>
              <ul className="space-y-2">
                {tech.items.map((item, idx) => (
                  <li key={idx} className="text-gray-700 text-sm flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Workflow Diagram (Static but enhanced) */}
        <div className="bg-white rounded-2xl shadow-xl p-10">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            System Workflow
          </h3>
          {/* ... (Keep existing workflow visualization) ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Data Collection', desc: 'IoT sensors continuously monitor soil parameters', icon: Wifi },
              { step: '02', title: 'AI Analysis', desc: 'ML models process data for insights', icon: Cpu },
              { step: '03', title: 'Blockchain Storage', desc: 'Data is hashed and stored immutably', icon: Database },
              { step: '04', title: 'Actionable Output', desc: 'Farmers receive alerts and market data', icon: Zap }
            ].map((item, index) => (
              <div key={index} className="relative text-center group">
                <div className="bg-gradient-to-br from-green-400 to-blue-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <item.icon className="text-white" size={36} />
                </div>
                <div className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">STEP {item.step}</div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technology;
