import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot, Sparkles, Mic, MicOff } from 'lucide-react';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

const KNOWLEDGE_BASE = [
    {
        keywords: ['hello', 'hi', 'hey', 'start', 'greetings'],
        response: "Hello! I'm AgroBot, your AI farming assistant. How can I help you today?"
    },
    {
        keywords: ['weather', 'rain', 'forecast', 'sunny', 'temp'],
        response: "Today's Forecast: Mostly Sunny, 32°C (89°F). Humidity: 60%. \n\nPrediction: No rain expected for the next 3 days. Good conditions for spraying pesticides."
    },
    {
        keywords: ['price', 'rate', 'cost', 'market', 'mandi'],
        response: "Latest Market Rates (per quintal):\n• Wheat: ₹2,150\n• Rice (Basmati): ₹3,800\n• Cotton: ₹6,400\n• Tomato: ₹1,200\n\nRates updated 2 hours ago from major mandis."
    },
    {
        keywords: ['water', 'irrigate', 'moisture', 'wet'],
        response: "Irrigation Advice: \n1. Check Soil Moisture first (Ideal: 40-60%).\n2. Best Time: Early morning (6-8 AM) to reduce evaporation.\n3. Avoid watering in high heat to prevent mold growth."
    },
    {
        keywords: ['disease', 'sick', 'yellow', 'spots', 'blight', 'fungus'],
        response: "If you see yellow spots or signs of disease, please use our 'AI Disease Diagnosis' tool on the **ML Models** page. Upload a photo of the leaf and I'll analyze it instantly for you!"
    },
    {
        keywords: ['fertilizer', 'urea', 'dap', 'npk', 'soil'],
        response: "Fertilizer Guide:\n• Nitrogen (Urea): Promotes leafy growth.\n• Phosphorus (DAP): Strengthens roots.\n• Potassium (MOP): Improves fruit quality.\n\nAlways test your Soil pH before applying!"
    },
    {
        keywords: ['help', 'options', 'menu'],
        response: "I can help with:\n• Crop Prices\n• Weather Forecasts\n• Irrigation Tips\n• Disease Diagnosis\n• Pest Control\n• Harvest Timing\n\nJust ask me anything!"
    },
    {
        keywords: ['pest', 'insect', 'bug', 'aphid', 'worm', 'caterpillar'],
        response: "Pest Control Guide:\n🐛 Aphids: Spray neem oil solution (5ml/L water) every 7 days.\n🐜 Stem Borers: Use Chlorpyrifos 2.5% spray.\n🦗 Whiteflies: Yellow sticky traps + Imidacloprid spray.\n\n⚠️ Always spray in the evening to avoid harming bees!"
    },
    {
        keywords: ['harvest', 'cut', 'pick', 'reap', 'ready', 'ripe', 'collect'],
        response: "Harvest Timing Guide:\n🌾 Wheat: Harvest when 90% grains turn golden (about 110-120 days).\n🍅 Tomato: Pick when fully red and firm.\n🌽 Corn: Ready when silk turns dark brown & husks are tight.\n\n💡 Tip: Harvest in the morning to maintain freshness!"
    },
    {
        keywords: ['schedule', 'when', 'apply', 'fertilize', 'month', 'application'],
        response: "Fertilizer Schedule Guide:\n📅 Week 0 (Sowing): Apply DAP (Phosphorus) for root development.\n📅 Week 3: Top dress with Urea (Nitrogen) for leaf growth.\n📅 Week 6: Apply MOP (Potassium) to improve fruit quality.\n\n🔬 Always soil-test before following a generic schedule!"
    }
];

const AgroBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! I'm AgroBot. Ask me about prices, weather, or farming tips!", sender: 'bot' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const toggleChat = () => setIsOpen(!isOpen);

    // Voice Command Logic
    const [isListening, setIsListening] = useState(false);

    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Voice commands are not supported in this browser. Please use Chrome.");
            return;
        }

        if (isListening) {
            setIsListening(false);
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            handleSend(transcript); // Auto-send
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const processResponse = (userInput: string) => {
        const lowerInput = userInput.toLowerCase();
        let match = KNOWLEDGE_BASE.find(item =>
            item.keywords.some(keyword => lowerInput.includes(keyword))
        );

        if (!match) {
            // Default response if no keyword matched
            return "I'm still learning! Try asking about 'Weather', 'Market Prices', or 'Watering tips'.";
        }
        return match.response;
    };

    const handleSend = (overrideText?: string) => {
        const textToSend = overrideText || input;
        if (!textToSend.trim()) return;

        // Add User Message
        const userMsg: Message = { id: Date.now(), text: textToSend, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI Delay
        setTimeout(() => {
            const botResponse = processResponse(textToSend);
            const botMsg: Message = { id: Date.now() + 1, text: botResponse, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1200);
    };

    const quickChips = [
        "Check Market Prices",
        "Watering Advice",
        "Weather Forecast",
        "Disease Help",
        "Pest Control",
        "Harvest Timing"
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Trigger Button */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-3 group border-4 border-white/20"
                >
                    <div className="relative">
                        <MessageSquare size={26} className="fill-current" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-green-600"></span>
                    </div>
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap text-lg">
                        Ask AgroBot
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-[350px] sm:w-[380px] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col animate-fade-in-up h-[600px] max-h-[80vh]">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-700 to-emerald-600 p-4 flex justify-between items-center text-white shadow-md z-10">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full border border-white/30 backdrop-blur-sm">
                                <Bot size={24} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight">AgroBot AI</h3>
                                <p className="text-[11px] text-green-100 flex items-center gap-1.5 opacity-90">
                                    <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse shadow-[0_0_8px_rgba(134,239,172,0.8)]"></span>
                                    Online & Ready
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleChat}
                            className="hover:bg-white/20 p-2 rounded-full transition-colors active:scale-90"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4 scroll-smooth">
                        <div className="text-center text-xs text-gray-400 my-2 font-medium uppercase tracking-wider">
                            Today
                        </div>

                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 max-w-[90%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.sender === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                                    }`}>
                                    {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>
                                <div
                                    className={`p-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${msg.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    {/* Render newlines properly */}
                                    {msg.text.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line}
                                            {i !== msg.text.split('\n').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="self-start flex gap-3 animate-pulse">
                                <div className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center">
                                    <Bot size={14} />
                                </div>
                                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none text-gray-500 text-xs italic flex items-center gap-2 shadow-sm">
                                    <Sparkles size={12} className="animate-spin text-amber-500" /> AgroBot is typing...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Chips */}
                    <div className="bg-gray-50 px-4 pb-2 pt-0 flex gap-2 overflow-x-auto no-scrollbar mask-linear-fade">
                        {quickChips.map((chip, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(chip)}
                                className="whitespace-nowrap px-3 py-1.5 bg-white border border-green-200 text-green-700 text-xs font-semibold rounded-full hover:bg-green-50 hover:border-green-300 transition-colors shadow-sm active:scale-95 flex-shrink-0"
                            >
                                {chip}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
                        <button
                            onClick={handleVoiceInput}
                            className={`p-2.5 rounded-xl transition-all active:scale-95 shadow-md ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about crops, weather..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-sm text-gray-900 placeholder-gray-400 font-medium"
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim()}
                            className="bg-green-600 text-white p-2.5 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-md hover:shadow-lg"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgroBot;
