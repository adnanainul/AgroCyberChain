import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    en: {
        // Navigation
        "nav.home": "Home",
        "nav.models": "ML Models",
        "nav.market": "Marketplace",
        "nav.dashboard": "Dashboard",
        "nav.connect": "Connect Wallet",
        "nav.technology": "Technology",
        "nav.products": "Products",
        "nav.orders": "My Orders",
        "nav.contact": "Contact",

        // Hero
        "hero.title": "Decentralized Smart Agriculture Platform",
        "hero.subtitle": "Empowering farmers with AI-driven insights, secure blockchain supply chains, and direct market access.",
        "hero.cta.start": "Get Started",
        "hero.cta.learn": "Learn More",
        "hero.stat.farmers": "Farmers Onboarded",
        "hero.stat.crops": "Crops Monitored",

        // Hero Features
        "hero.feat.iot.title": "IoT Monitoring",
        "hero.feat.iot.desc": "Real-time soil, weather, and crop health tracking",
        "hero.feat.ai.title": "AI Predictions",
        "hero.feat.ai.desc": "ML-powered crop recommendations and yield forecasting",
        "hero.feat.chain.title": "Blockchain Security",
        "hero.feat.chain.desc": "Tamper-proof data integrity with SHA-256",
        "hero.feat.market.title": "Market Linkage",
        "hero.feat.market.desc": "Direct access to buyers across India",

        // ML Models Page
        "ml.header.title": "AI Intelligence Center",
        "ml.header.subtitle": "Simulate environmental conditions and get real-time crop recommendations.",
        "ml.live.title": "Live Prediction Engine",
        "ml.live.desc": "Enter sensor parameters to test the model",
        "ml.form.location": "Location / City",
        "ml.form.getWeather": "Get Weather",
        "ml.form.temp": "Temperature",
        "ml.form.humidity": "Humidity",
        "ml.form.ph": "Soil pH",
        "ml.form.moisture": "Moisture",
        "ml.form.run": "Run Prediction Model",
        "ml.result.title": "Model Output",
        "ml.result.crop": "Recommended Crop",
        "ml.result.confidence": "Confidence Score",
        "ml.result.yield": "Predicted Yield",
        "ml.result.irrigation": "Irrigation Advice",
        "ml.result.wait": "Ready for Analysis",
        "ml.result.waitDesc": "Enter parameters and run the model to generate real-time insights.",

        // Marketplace Page
        "market.banner.farmer": "Farmer Dashboard",
        "market.banner.customer": "Customer Dashboard",
        "market.banner.desc.farmer": "Sell your harvest and find buyers.",
        "market.banner.desc.customer": "Browse crops and post your requirements.",
        "market.form.title.sell": "List Crop for Sale",
        "market.form.title.buy": "Post Crop Requirement",
        "market.form.crop": "Crop Type",
        "market.form.qty": "Quantity",
        "market.form.price": "Price",
        "market.form.loc": "Location",
        "market.form.contact": "Contact",
        "market.btn.post.sell": "Post Sell Offer",
        "market.btn.post.buy": "Post Buy Request",
        "market.tabs.sell": "Sell Offers",
        "market.tabs.buy": "Buy Requests",
        "market.tabs.all": "All Listings",
        "market.card.sell": "Sell Offer",
        "market.card.buy": "Buy Request",
        "market.btn.buy": "Buy Now",
        "market.btn.contact": "Contact",

        // ML Models
        "ml.title": "Prediction Engine",
        "ml.subtitle": "AI-powered crop analysis for maximum yield",
        "ml.inputs": "Environmental Inputs",
        "ml.analyze": "Run Simulation",
        "ml.disease.title": "AI Disease Diagnosis",
        "ml.disease.desc": "Upload a leaf image to detect diseases instantly.",
        "ml.disease.btn": "Analyze Leaf Health",

        // General
        "loading": "Loading...",
        "market.escrow.title": "Secure Transaction",
        "market.escrow.total_value": "Total Value",
        "market.escrow.contract_id": "Contract ID",
        "market.escrow.info.title": "This transaction will be secured by a <strong>Smart Contract Escrow</strong>.",
        "market.escrow.info.desc": "Funds are locked on the blockchain until goods are verified.",
        "market.escrow.btn.cancel": "Cancel",
        "market.escrow.btn.lock": "Lock Funds",
        "market.escrow.step.locked": "Locked",
        "market.escrow.step.transit": "Transit",
        "market.escrow.step.released": "Released",
        "market.escrow.status.init.title": "Initiating Smart Contract...",
        "market.escrow.status.init.desc": "Verifying wallet balance and creating escrow vault.",
        "market.escrow.status.locked.title": "Funds Secured Safely",
        "market.escrow.status.locked.desc": "The seller has been notified. Funds will be held until you confirm delivery.",
        "market.escrow.btn.simulate": "Simulate Delivery & Release",
        "market.escrow.status.released.title": "Transaction Complete!",
        "market.escrow.status.released.desc": "Funds have been released to the seller wallet.",
        "market.escrow.btn.close": "Close & Record on Blockchain",

        // New Crop Idea
        "suggestion.title": "Suggest New Crop",
        "suggestion.desc": "Don't see the crop you want? Suggest it to our farmers!",
        "suggestion.crop_name": "Crop Name",
        "suggestion.description": "Why do you want this?",
        "suggestion.success": "Suggestion submitted successfully!",
        "suggestion.error": "Failed to submit. Please try again.",
        "market.btn.suggest": "Suggest New Crop",

        // New Crop Idea
        "market.idea.btn": "Suggest New Crop",
        "market.idea.title": "Suggest a New Crop",
        "market.idea.desc": "Can't find what you need? Tell local farmers what to grow next season.",
        "market.idea.form.name": "Crop Name",
        "market.idea.form.price": "Expected Price (₹/Ton)",
        "market.idea.form.reason": "Why should farmers grow this?",
        "market.idea.form.reason.ph": "e.g., High demand in local markets, upcoming festival requirements...",
        "market.idea.submit": "Submit Suggestion",
        "market.idea.success": "Suggestion sent to network! Farmers will see your request.",
    },
    hi: {
        // Navigation
        "nav.home": "होम",
        "nav.models": "एमएल मॉडल",
        "nav.market": "बाजार",
        "nav.dashboard": "डैशबोर्ड",
        "nav.connect": "वॉलेट कनेक्ट",
        "nav.technology": "तकनीक",
        "nav.products": "उत्पाद",
        "nav.orders": "मेरे आदेश",
        "nav.contact": "संपर्क करें",

        // Hero
        "hero.title": "विकेंद्रीकृत स्मार्ट कृषि मंच",
        "hero.subtitle": "किसानों को एआई-संचालित अंतर्दृष्टि, सुरक्षित ब्लॉकचेन आपूर्ति श्रृंखला और सीधे बाजार पहुंच के साथ सशक्त बनाना।",
        "hero.cta.start": "शुरू करें",
        "hero.cta.learn": "और जानें",
        "hero.stat.farmers": "किसान जुड़े",
        "hero.stat.crops": "फसलें निगरानी में",

        // Hero Features
        "hero.feat.iot.title": "IoT निगरानी",
        "hero.feat.iot.desc": "रीयल-टाइम मिट्टी, मौसम और फसल स्वास्थ्य ट्रैकिंग",
        "hero.feat.ai.title": "एआई भविष्यवाणियां",
        "hero.feat.ai.desc": "एमएल-संचालित फसल सिफारिशें और उपज पूर्वानुमान",
        "hero.feat.chain.title": "ब्लॉकचेन सुरक्षा",
        "hero.feat.chain.desc": "SHA-256 के साथ छेड़छाड़-रहित डेटा अखंडता",
        "hero.feat.market.title": "बाजार संपर्क",
        "hero.feat.market.desc": "पूरे भारत में खरीदारों तक सीधी पहुंच",

        // ML Models Page
        "ml.header.title": "एआई इंटेलिजेंस सेंटर",
        "ml.header.subtitle": "पर्यावरणीय स्थितियों का अनुकरण करें और रीयल-टाइम फसल सिफारिशें प्राप्त करें।",
        "ml.live.title": "लाइव भविष्यवाणी इंजन",
        "ml.live.desc": "मॉडल का परीक्षण करने के लिए सेंसर पैरामीटर दर्ज करें",
        "ml.form.location": "स्थान / शहर",
        "ml.form.getWeather": "मौसम प्राप्त करें",
        "ml.form.temp": "तापमान",
        "ml.form.humidity": "नमी (ह्यूमिडिटी)",
        "ml.form.ph": "मिट्टी का पीएच",
        "ml.form.moisture": "नमी (मॉइस्चर)",
        "ml.form.run": "भविष्यवाणी मॉडल चलाएं",
        "ml.result.title": "मॉडल आउटपुट",
        "ml.result.crop": "अनुशंसित फसल",
        "ml.result.confidence": "विश्वास स्कोर",
        "ml.result.yield": "अनुमानित उपज",
        "ml.result.irrigation": "सिंचाई सलाह",
        "ml.result.wait": "विश्लेषण के लिए तैयार",
        "ml.result.waitDesc": "रीयल-टाइम अंतर्दृष्टि उत्पन्न करने के लिए पैरामीटर दर्ज करें और मॉडल चलाएं।",

        // Marketplace Page
        "market.banner.farmer": "किसान डैशबोर्ड",
        "market.banner.customer": "ग्राहक डैशबोर्ड",
        "market.banner.desc.farmer": "अपनी फसल बेचें और खरीदार खोजें।",
        "market.banner.desc.customer": "फसलें ब्राउज़ करें और अपनी आवश्यकताएं पोस्ट करें।",
        "market.form.title.sell": "बिक्री के लिए फसल सूचीबद्ध करें",
        "market.form.title.buy": "फसल की आवश्यकता पोस्ट करें",
        "market.form.crop": "फसल का प्रकार",
        "market.form.qty": "मात्रा",
        "market.form.price": "कीमत",
        "market.form.loc": "स्थान",
        "market.form.contact": "संपर्क",
        "market.btn.post.sell": "बिक्री प्रस्ताव पोस्ट करें",
        "market.btn.post.buy": "खरीद अनुरोध पोस्ट करें",
        "market.tabs.sell": "बिक्री प्रस्ताव",
        "market.tabs.buy": "खरीद अनुरोध",
        "market.tabs.all": "सभी लिस्टिंग",
        "market.card.sell": "बिक्री प्रस्ताव",
        "market.card.buy": "खरीद अनुरोध",
        "market.btn.buy": "अभी खरीदें",
        "market.btn.contact": "संपर्क करें",

        // ML Models
        "ml.title": "भविष्यवाणी इंजन",
        "ml.subtitle": "अधिकतम उपज के लिए एआई-संचालित फसल विश्लेषण",
        "ml.inputs": "पर्यावरण इनपुट",
        "ml.analyze": "सिमुलेशन चलाएं",
        "ml.disease.title": "एआई रोग निदान",
        "ml.disease.desc": "बीमारियों का तुरंत पता लगाने के लिए पत्ती की छवि अपलोड करें।",
        "ml.disease.btn": "पत्ती स्वास्थ्य का विश्लेषण करें",

        // General
        "loading": "लोड हो रहा है...",
        "market.escrow.title": "सुरक्षित लेनदेन",
        "market.escrow.total_value": "कुल मूल्य",
        "market.escrow.contract_id": "अनुबंध आईडी",
        "market.escrow.info.title": "यह लेन-देन <strong>स्मार्ट कॉन्ट्रैक्ट एस्क्रो</strong> द्वारा सुरक्षित किया जाएगा।",
        "market.escrow.info.desc": "सामान सत्यापित होने तक फंड ब्लॉकचेन पर लॉक कर दिए जाते हैं।",
        "market.escrow.btn.cancel": "रद्द करें",
        "market.escrow.btn.lock": "फंड लॉक करें",
        "market.escrow.step.locked": "लॉक किया गया",
        "market.escrow.step.transit": "पारगमन (Transit)",
        "market.escrow.step.released": "जारी किया गया",
        "market.escrow.status.init.title": "स्मार्ट कॉन्ट्रैक्ट शुरू हो रहा है...",
        "market.escrow.status.init.desc": "वॉलेट बैलेंस और एस्क्रो वॉल्ट निर्माण का सत्यापन किया जा रहा है।",
        "market.escrow.status.locked.title": "फंड सुरक्षित रूप से लॉक हैं",
        "market.escrow.status.locked.desc": "विक्रेता को सूचित कर दिया गया है। जब तक आप डिलीवरी की पुष्टि नहीं करते, तब तक फंड को रोक कर रखा जाएगा।",
        "market.escrow.btn.simulate": "डिलीवरी और रिलीज़ का अनुकरण करें",
        "market.escrow.status.released.title": "लेन-देन पूरा हुआ!",
        "market.escrow.status.released.desc": "विक्रेता के वॉलेट में फंड जारी कर दिए गए हैं।",
        "market.escrow.btn.close": "बंद करें और ब्लॉकचेन पर रिकॉर्ड करें",

        // New Crop Idea
        "suggestion.title": "नई फसल का सुझाव दें",
        "suggestion.desc": "क्या आपको अपनी पसंद की फसल नहीं मिल रही? हमारे किसानों को सुझाव दें!",
        "suggestion.crop_name": "फसल का नाम",
        "suggestion.description": "आप यह क्यों चाहते हैं?",
        "suggestion.success": "सुझाव सफलतापूर्वक जमा किया गया!",
        "suggestion.error": "जमा करने में विफल। कृपया पुन: प्रयास करें।",
        "market.btn.suggest": "नई फसल का सुझाव दें",

        // New Crop Idea
        "market.idea.btn": "नई फसल का सुझाव दें",
        "market.idea.title": "नई फसल का सुझाव दें",
        "market.idea.desc": "जो चाहिए वो नहीं मिल रहा? स्थानीय किसानों को बताएं कि अगले सीजन में क्या उगाना है।",
        "market.idea.form.name": "फसल का नाम",
        "market.idea.form.price": "अपेक्षित कीमत (₹/टन)",
        "market.idea.form.reason": "किसानों को यह क्यों उगाना चाहिए?",
        "market.idea.form.reason.ph": "उदा., स्थानीय बाजारों में उच्च मांग, आगामी त्योहार की आवश्यकताएं...",
        "market.idea.submit": "सुझाव जमा करें",
        "market.idea.success": "सुझाव नेटवर्क को भेजा गया! किसान आपका अनुरोध देखेंगे।",
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('en');

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
