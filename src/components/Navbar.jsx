import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Menu, X, User, Truck, BarChart3, LogOut, HelpCircle, MapPin, FileText, Star, Globe } from 'lucide-react';
import { useShipmentStore } from '../store/shipmentStore';

const navLinks = [
  { to: '/home', label: 'Home' },
  { to: '/shipment', label: 'Spedisci' },
  { to: '/compare', label: 'Compara' },
  { to: '/tracking', label: 'Tracking' },
  { to: '/loyalty', label: 'Fedeltà', icon: Star },
  { to: '/faq', label: 'FAQ' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout, isLoggedIn, loyalty, shipmentType } = useShipmentStore();

  const userInitials = `${user.nome?.charAt(0) || ''}${user.cognome?.charAt(0) || ''}`.toUpperCase() || 'U';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/auth');
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    setShowDropdown(false);
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/home" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Package className="h-8 w-8 text-sky-600" />
              </motion.div>
              <span className="text-2xl font-bold text-white group-hover:text-sky-600 transition-colors">
                SENDY
              </span>
            </Link>

            {shipmentType === 'international' && (
              <span className="hidden md:flex items-center gap-1 px-2 py-1 bg-sky-600/20 text-sky-400 text-xs rounded-full">
                <Globe className="w-3 h-3" />
                Internazionale
              </span>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                    isActive
                      ? 'text-white bg-sky-600/20 border border-sky-600'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* User Avatar & Points */}
          <div className="hidden md:flex items-center gap-4 relative" ref={dropdownRef}>
            {/* Points Badge */}
            <button
              onClick={() => navigate('/loyalty')}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-600/20 text-amber-500 rounded-full text-sm font-medium hover:bg-amber-600/30 transition-colors"
            >
              <Star className="w-4 h-4" />
              {loyalty?.points?.toLocaleString() || 0} pt
            </button>

            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                {userInitials}
              </div>
              <span className="text-slate-300 text-sm hidden lg:block">
                {user.nome || 'Utente'}
              </span>
            </button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-56 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-700">
                    <p className="text-white font-medium">
                      {user.nome} {user.cognome}
                    </p>
                    <p className="text-slate-400 text-xs truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => handleMenuItemClick('/profile')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Il mio profilo
                    </button>
                    <button
                      onClick={() => handleMenuItemClick('/tracking')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      Le mie spedizioni
                    </button>
                    <button
                      onClick={() => handleMenuItemClick('/loyalty')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <Star className="w-4 h-4" />
                      Punti fedeltà
                    </button>
                    <button
                      onClick={() => handleMenuItemClick('/faq')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <HelpCircle className="w-4 h-4" />
                      Aiuto
                    </button>
                  </div>
                  <div className="py-1 border-t border-slate-700">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-slate-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <span className="flex items-center gap-1 px-2 py-1 bg-amber-600/20 text-amber-500 text-xs rounded-full">
              <Star className="w-3 h-3" />
              {loyalty?.points?.toLocaleString() || 0}
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {userInitials}
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-slate-900 border-b border-slate-800 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                      isActive
                        ? 'text-white bg-sky-600/20 border border-sky-600'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </NavLink>
              ))}
              <div className="px-4 py-3 border-t border-slate-700 mt-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-400 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
