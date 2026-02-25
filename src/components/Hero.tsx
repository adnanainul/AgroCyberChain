import { Sprout, TrendingUp, Shield, Globe } from 'lucide-react';
import Features from './Features';
import Technology from './Technology';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <>
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              {t('hero.title').split('Platform')[0]}
              <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mt-2">
                {t('hero.title').includes('Platform') ? 'Platform' : (t('hero.title').split(' ').pop())}
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex justify-center gap-4 mb-12">
              <button className="px-8 py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/30">
                {t('hero.cta.start')}
              </button>
              <button className="px-8 py-3 bg-white text-green-700 border border-green-200 rounded-full font-bold hover:bg-green-50 transition-colors">
                {t('hero.cta.learn')}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              {/* Feature Highlights */}
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sprout className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('hero.feat.iot.title')}</h3>
                <p className="text-gray-600">{t('hero.feat.iot.desc')}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('hero.feat.ai.title')}</h3>
                <p className="text-gray-600">{t('hero.feat.ai.desc')}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-amber-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('hero.feat.chain.title')}</h3>
                <p className="text-gray-600">{t('hero.feat.chain.desc')}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('hero.feat.market.title')}</h3>
                <p className="text-gray-600">{t('hero.feat.market.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Sections */}
      <div id="features-section">
        <Features />
      </div>
      <div id="technology-section">
        <Technology />
      </div>
    </>
  );
};

export default Hero;
