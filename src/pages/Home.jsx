import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PackagePlus,
  MapPin,
  BarChart3,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Star,
  MessageCircle,
  Globe,
} from 'lucide-react';
import { useShipmentStore } from '../store/shipmentStore';
import { formatDateTime } from '../utils/formatters';

const actionCards = [
  {
    id: 'ship',
    icon: PackagePlus,
    title: 'Spedisci',
    description: 'Crea una nuova spedizione',
    color: 'sky',
    gradient: 'from-sky-600 to-blue-600',
    path: '/shipment',
  },
  {
    id: 'track',
    icon: MapPin,
    title: 'Traccia',
    description: 'Monitora la tua spedizione',
    color: 'violet',
    gradient: 'from-violet-600 to-purple-600',
    path: '/tracking',
  },
  {
    id: 'compare',
    icon: BarChart3,
    title: 'Compara',
    description: 'Confronta prezzi corrieri',
    color: 'emerald',
    gradient: 'from-emerald-600 to-teal-600',
    path: '/compare',
  },
];

const statusColors = {
  'Consegnato': 'text-green-500 bg-green-600/20',
  'In transito': 'text-sky-500 bg-sky-600/20',
  'In lavorazione': 'text-amber-500 bg-amber-600/20',
};

export const Home = () => {
  const navigate = useNavigate();
  const { user, recentShipments, loyalty, getLoyaltyLevel, chat, openChat } = useShipmentStore();
  const currentLevel = getLoyaltyLevel();

  const userInitials = `${user.nome?.charAt(0) || ''}${user.cognome?.charAt(0) || ''}`.toUpperCase() || 'U';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600/5 via-transparent to-slate-900" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {userInitials}
              </div>
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Ciao, {user.nome || 'Utente'}!
            </h1>
            <p className="text-slate-400 text-lg">Cosa vuoi fare oggi?</p>
          </motion.div>

          {/* Action Cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8"
          >
            {actionCards.map((card) => (
              <motion.div
                key={card.id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={card.path}
                  className="block bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center hover:border-slate-600 transition-all group"
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <card.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{card.title}</h3>
                  <p className="text-slate-400 text-sm">{card.description}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Loyalty Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-amber-600/20 flex items-center justify-center">
                    <Star className="w-7 h-7 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      Guadagna punti ad ogni spedizione
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: currentLevel?.color + '30', color: currentLevel?.color }}
                      >
                        {currentLevel?.name}
                      </span>
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-amber-500 font-bold">{loyalty?.points?.toLocaleString() || 0}</span>
                      <span className="text-slate-400 text-sm">punti</span>
                    </div>
                  </div>
                </div>
                <Link
                  to="/loyalty"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                >
                  Vedi premi
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Support Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-emerald-600/20 flex items-center justify-center relative">
                    <MessageCircle className="w-7 h-7 text-emerald-600" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Serve aiuto?</h4>
                    <p className="text-slate-400 text-sm flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
                      Supporto online
                    </p>
                  </div>
                </div>
                <button
                  onClick={openChat}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                >
                  Chatta con noi
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recent Shipments Section */}
      <section className="py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-500" />
                Le tue ultime spedizioni
              </h2>
              <p className="text-slate-400 text-sm mt-1">Monitora lo stato delle tue spedizioni</p>
            </div>
            <Link
              to="/tracking"
              className="text-sky-600 hover:text-sky-500 text-sm flex items-center gap-1"
            >
              Vedi tutte
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {recentShipments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-800/30 border border-slate-700 rounded-xl p-8 text-center"
            >
              <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Non hai ancora spedizioni</p>
              <Link
                to="/shipment"
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-all"
              >
                Crea la tua prima spedizione
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {recentShipments.map((shipment) => {
                const statusClass = statusColors[shipment.status] || statusColors['In lavorazione'];

                return (
                  <motion.div
                    key={shipment.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate(`/tracking?code=${shipment.tracking}`)}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 cursor-pointer hover:border-slate-600 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sky-600 font-mono font-semibold">{shipment.tracking}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusClass}`}
                      >
                        {shipment.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{shipment.carrier}</span>
                      <span className="text-slate-500">{formatDateTime(shipment.date)}</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
