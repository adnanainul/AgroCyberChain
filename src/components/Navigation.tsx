import { Menu, X, Sprout, Globe } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { colorMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  /* Define all items with specific role requirements */
  const allNavItems = [
    { path: '/', label: 'nav.home', roles: ['guest', 'farmer', 'customer'] },
    { path: '/models', label: 'nav.models', roles: ['farmer'] },
    { path: '/blockchain', label: 'nav.technology', roles: ['farmer'] },
    { path: '/dashboard', label: 'nav.dashboard', roles: ['farmer'] },
    { path: '/marketplace', label: 'nav.market', roles: ['farmer', 'customer'] },
    { path: '/products', label: 'nav.products', roles: ['farmer'] },
    { path: '/orders', label: 'nav.orders', roles: ['farmer'] },
    { path: '/contact', label: 'nav.contact', roles: ['farmer', 'customer'] },
  ];

  // Determine current role (guest if not logged in)
  const currentRole = isAuthenticated && user?.role ? user.role : 'guest';

  // Filter items
  const navItems = allNavItems.filter(item => item.roles.includes(currentRole));

  // Dynamic classes
  const activeClass = colorMode === 'green' ? 'text-green-700 border-green-600' : colorMode === 'blue' ? 'text-blue-700 border-blue-600' : 'text-gray-900 border-gray-900';
  const btnClass = colorMode === 'green' ? 'text-green-700' : colorMode === 'blue' ? 'text-blue-700' : 'text-gray-800';

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${colorMode === 'blue' ? 'from-blue-500 to-indigo-600' : 'from-green-500 to-emerald-600'} text-white shadow-lg shadow-green-500/20`}>
              <Sprout size={24} className="fill-current" />
            </div>
            <Link to="/" className={`text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${colorMode === 'blue' ? 'from-blue-700 to-indigo-700' : 'from-green-700 to-emerald-700'}`}>
              AgroChain
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-bold text-gray-700 transition-colors"
            >
              <Globe size={16} />
              <span>{language === 'en' ? 'EN' : 'HI'}</span>
            </button>

            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `px-1 py-2 text-sm font-bold transition-all duration-200 border-b-2 ${isActive
                  ? `${activeClass}`
                  : `text-gray-600 border-transparent hover:border-gray-300 hover:text-gray-900`
                  }`}
              >
                {t(item.label)}
              </NavLink>
            ))}

            {!isAuthenticated ? (
              <>
                <Link to="/login" className={`px-4 py-2 text-sm font-bold transition-colors ${btnClass} hover:bg-gray-50 rounded-lg`}>
                  Login
                </Link>
                <Link to="/signup" className={`px-5 py-2.5 text-sm font-bold text-white rounded-full transition-all shadow-md transform hover:-translate-y-0.5 ${colorMode === 'blue' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30' : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-green-500/30'}`}>
                  Signup
                </Link>
              </>
            ) : (
              <Link
                to="/profile"
                className={`flex items-center space-x-2 pl-4 border-l border-gray-200`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm font-bold text-sm ring-2 ring-offset-2 transition-all ${colorMode === 'blue' ? 'bg-blue-100 text-blue-800 ring-blue-100' : 'bg-green-100 text-green-800 ring-green-100'}`}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-900 leading-none">{user?.name}</span>
                  <span className="text-[10px] text-gray-500 font-medium capitalize leading-none mt-1">{user?.role}</span>
                </div>
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `block w-full text-left px-4 py-3 rounded-xl text-base font-bold mb-1 ${isActive
                  ? `${colorMode === 'blue' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                {t(item.label)}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
