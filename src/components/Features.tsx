import { AlertCircle, Droplets, Target, Users, DollarSign, TrendingUp } from 'lucide-react';

const Features = () => {
  const challenges = [
    {
      icon: Target,
      title: 'Limited Market Access',
      description: 'Farmers struggle to reach profitable markets in other states',
      color: 'text-red-600',
      bg: 'bg-red-100'
    },
    {
      icon: AlertCircle,
      title: 'Crop Monitoring',
      description: 'Inability to monitor crops continuously leads to losses',
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    },
    {
      icon: Droplets,
      title: 'Resource Wastage',
      description: 'Delayed irrigation and fertilizer decisions waste resources',
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      icon: AlertCircle,
      title: 'Connectivity Issues',
      description: 'Weak 2G/3G networks restrict modern tool adoption',
      color: 'text-gray-600',
      bg: 'bg-gray-100'
    },
  ];

  const solutions = [
    {
      icon: Droplets,
      title: 'IoT Sensor Grid',
      description: 'Monitor soil moisture, pH, temperature, humidity, and water flow in real-time',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: TrendingUp,
      title: 'AI/ML Intelligence',
      description: 'Predict optimal sowing time, detect diseases, schedule irrigation, and estimate yield',
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      icon: Target,
      title: 'Blockchain Ledger',
      description: 'Store crop records, sensor logs, and supply-chain transactions securely',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      icon: Users,
      title: 'Market Connectivity',
      description: 'Connect farmers to buyers, wholesalers, and vendors showing demand and pricing',
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      icon: DollarSign,
      title: 'Profit Optimization',
      description: 'Suggest high-profit crops and provide market price insights',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            The Challenge & Solution
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforming traditional farming with cutting-edge technology
          </p>
        </div>

        <div className="mb-20">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Challenges Farmers Face
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {challenges.map((challenge, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className={`${challenge.bg} w-14 h-14 rounded-full flex items-center justify-center mb-4`}>
                  <challenge.icon className={challenge.color} size={28} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{challenge.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{challenge.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Comprehensive Solution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <div key={index} className={`${solution.bg} p-8 rounded-xl hover:shadow-xl transition-all transform hover:-translate-y-1`}>
                <div className={`bg-white w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-md`}>
                  <solution.icon className={solution.color} size={32} />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">{solution.title}</h4>
                <p className="text-gray-700 leading-relaxed">{solution.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Project Aim</h3>
          <p className="text-gray-700 text-lg leading-relaxed max-w-5xl mx-auto text-center">
            To develop an IoT–AI–Blockchain based Smart Agriculture and Market-Connectivity System that
            continuously monitors field health, automates irrigation and fertilizer operations, predicts best seed
            and crop timing, ensures data integrity using blockchain, and connects farmers directly to high-profit
            customers and wholesalers in other states, providing real-time demand and price information.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
