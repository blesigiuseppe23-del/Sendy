import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Search,
  Truck,
  MapPin,
  Check,
  Clock,
  ArrowRight,
  AlertCircle,
  Home,
  Mail,
  Loader2,
} from 'lucide-react';
import { trackShipment } from '../services/tracking';
import { formatDateTime } from '../utils/formatters';
import { Skeleton, TrackingSkeleton } from '../components/Skeleton';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/Toast';

const steps = [
  { id: 'created', label: 'Ordine creato', icon: Package },
  { id: 'processing', label: 'In lavorazione', icon: Mail },
  { id: 'transit', label: 'In transito', icon: Truck },
  { id: 'delivered', label: 'Consegnato', icon: Check },
];

const getMockTrackingStatus = (trackingCode) => {
  const now = new Date();
  const isCompleted = Math.random() > 0.5;
  const isDelivered = Math.random() > 0.8;

  const timeline = [
    {
      id: 'created',
      status: 'Ordine creato',
      date: new Date(now - 48 * 60 * 60 * 1000).toISOString(),
      completed: true,
    },
    {
      id: 'processing',
      status: 'In lavorazione',
      description: 'Il pacco è stato ritirato dal magazzino',
      date: new Date(now - 36 * 60 * 60 * 1000).toISOString(),
      completed: true,
    },
    {
      id: 'transit',
      status: 'In transito',
      description: 'Il pacco è in viaggio verso la destinazione',
      date: new Date(now - 12 * 60 * 60 * 1000).toISOString(),
      completed: isCompleted || isDelivered,
      active: !isDelivered,
    },
    {
      id: 'delivered',
      status: 'Consegnato',
      date: isDelivered ? new Date(now - 1 * 60 * 60 * 1000).toISOString() : null,
      completed: isDelivered,
    },
  ];

  let currentStatus = 'In transito';
  if (isDelivered) currentStatus = 'Consegnato';
  else if (!isCompleted) currentStatus = 'In lavorazione';

  return {
    trackingCode,
    carrier: ['DHL', 'GLS', 'BRT', 'SDA'][Math.floor(Math.random() * 4)],
    estimatedDelivery: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    timeline,
    status: currentStatus,
  };
};

const iconMap = {
  Package,
  Mail,
  Truck,
  Check,
};

export const Tracking = () => {
  const [searchParams] = useSearchParams();
  const [trackingCode, setTrackingCode] = useState(searchParams.get('code') || '');
  const [tracking, setTracking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toasts, removeToast, error } = useToast();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setTrackingCode(code);
      handleSearch(code);
    }
  }, [searchParams]);

  const handleSearch = async (code = trackingCode) => {
    if (!code || code.length < 5) {
      error('Inserisci un codice tracking valido');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setTracking(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = getMockTrackingStatus(code.toUpperCase());
      setTracking(result);
    } catch (e) {
      error('Errore durante la ricerca. Riprova.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getCarrierColor = (carrier) => {
    const colors = {
      DHL: { bg: 'bg-yellow-400', text: 'text-black' },
      GLS: { bg: 'bg-orange-500', text: 'text-white' },
      BRT: { bg: 'bg-red-600', text: 'text-white' },
      SDA: { bg: 'bg-blue-600', text: 'text-white' },
    };
    return colors[carrier] || { bg: 'bg-slate-600', text: 'text-white' };
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sky-600/20 flex items-center justify-center">
            <Search className="w-10 h-10 text-sky-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Traccia la tua spedizione
          </h1>
          <p className="text-slate-400 max-w-md mx-auto">
            Inserisci il codice tracking per verificare lo stato della tua spedizione in tempo reale.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''))}
              onKeyPress={handleKeyPress}
              placeholder="Inserisci codice tracking (es. SDY-ABCD12345)"
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-600 transition-colors font-mono"
              maxLength={20}
            />
            <button
              onClick={() => handleSearch()}
              disabled={isLoading}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span>Cerca</span>
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8"
            >
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-sky-600 animate-spin mx-auto mb-4" />
                  <p className="text-slate-400">Ricerca spedizione in corso...</p>
                </div>
              </div>
            </motion.div>
          )}

          {!isLoading && tracking && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-700">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Codice tracking</p>
                  <p className="text-2xl font-bold text-white font-mono">{tracking.trackingCode}</p>
                </div>
                <div className="text-left md:text-right">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getCarrierColor(tracking.carrier).bg}`}>
                    <span className={`font-bold ${getCarrierColor(tracking.carrier).text}`}>
                      {tracking.carrier}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-sky-600 animate-pulse" />
                <span className="text-sky-600 font-semibold text-lg">{tracking.status}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300 mb-8">
                <Clock className="w-4 h-4" />
                <span>Consegna stimata: {formatDateTime(tracking.estimatedDelivery)}</span>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-slate-700" />

                <div className="space-y-6">
                  {tracking.timeline.map((step, index) => {
                    const Icon = iconMap[steps[index]?.icon] || Package;
                    const isCompleted = step.completed;
                    const isActive = step.active && !isCompleted;
                    const isLast = index === tracking.timeline.length - 1;

                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        {/* Icon circle */}
                        <div
                          className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isCompleted
                              ? 'bg-sky-600'
                              : isActive
                              ? 'bg-sky-600/20 border-2 border-sky-600 animate-pulse'
                              : 'bg-slate-800 border-2 border-slate-700'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-5 h-5 text-white" />
                          ) : (
                            <Icon className={`w-5 h-5 ${isActive ? 'text-sky-600' : 'text-slate-500'}`} />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                          <p
                            className={`font-semibold ${
                              isCompleted ? 'text-white' : isActive ? 'text-sky-600' : 'text-slate-500'
                            }`}
                          >
                            {step.status}
                          </p>
                          {step.description && (
                            <p className="text-slate-400 text-sm mt-1">
                              {step.description}
                            </p>
                          )}
                          {step.date && (
                            <p className="text-slate-500 text-xs mt-2">
                              {formatDateTime(step.date)}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {!isLoading && hasSearched && !tracking && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-12 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-600/20 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Spedizione non trovata
              </h3>
              <p className="text-slate-400">
                Il codice inserito non corrisponde a nessuna spedizione.
                Verifica di aver digitato correttamente.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Tracking;
