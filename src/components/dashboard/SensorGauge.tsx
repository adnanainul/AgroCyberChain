import { LucideIcon } from 'lucide-react';

interface SensorGaugeProps {
    label: string;
    value: number;
    unit: string;
    icon: LucideIcon;
    color: string;
    max: number;
    warningLow?: number;
    warningHigh?: number;
}

const SensorGauge = ({ label, value, unit, icon: Icon, color, max, warningLow = 0, warningHigh = max }: SensorGaugeProps) => {
    // Calculate percentage for circular progress
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const circumference = 2 * Math.PI * 40; // reduced radius to 40
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Determine if warning
    const isWarning = value < warningLow || value > warningHigh;
    const displayColor = isWarning ? 'text-red-500' : color;
    const strokeColor = isWarning ? '#Ef4444' : 'currentColor';

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gray-200 group">
            <div className={`absolute top-0 right-0 p-4 opacity-5 bg-current rounded-bl-3xl ${displayColor}`}>
                {/* Background accent */}
            </div>

            <div className={`absolute top-4 right-4 opacity-10 transition-transform group-hover:scale-110 duration-500 ${displayColor}`}>
                <Icon size={48} />
            </div>

            <div className="relative w-32 h-32 mb-4">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        className="text-gray-100"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="64"
                        cy="64"
                        r="40"
                        stroke={strokeColor}
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className={`${!isWarning && color} transition-all duration-1000 ease-out`}
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Icon size={24} className={`mb-1 transition-colors ${displayColor}`} />
                    <span className={`text-2xl font-bold tracking-tight ${displayColor}`}>{value}</span>
                    <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">{unit}</span>
                </div>
            </div>

            <h3 className="font-bold text-gray-800 text-sm tracking-wide uppercase">{label}</h3>
        </div>
    );
};

export default SensorGauge;
