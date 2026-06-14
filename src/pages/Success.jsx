import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Package,
  Download,
  Mail,
  ArrowRight,
  Copy,
  ExternalLink,
  Share2,
  Printer,
  Star,
  Sparkles,
  PartyPopper,
} from 'lucide-react';
import { useShipmentStore } from '../store/shipmentStore';
import { formatPrice, formatDateTime } from '../utils/formatters';
import { downloadPDF } from '../services/pdf';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/Toast';

const Confetti = () => {
  const colors = ['#FFD700', '#FF69B4', '#00CED1', '#32CD32', '#FF6347', '#8A2BE2'];
  const confettiCount = 50;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {[...Array(confettiCount)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * window.innerWidth,
            y: -20,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 20,
            rotate: Math.random() * 720 - 360,
            opacity: 0,
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            delay: Math.random() * 0.5,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            width: Math.random() * 10 + 5,
            height: Math.random() * 10 + 5,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          }}
        />
      ))}
    </div>
  );
};

export const Success = () => {
  const navigate = useNavigate();
  const { toasts, removeToast, success, error } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [pointsEarned, setPointsEarned] = useState(0);
  const {
    sender,
    recipient,
    package: pkg,
    selectedCarrier,
    services,
    pricing,
    order,
    resetAll,
    addPoints,
    loyalty,
  } = useShipmentStore();

  useEffect(() => {
    if (!order.id) {
      navigate('/shipment');
    }

    // Calculate and add points
    const basePoints = Math.floor((pricing.total || 0) * 10);
    const bonusPoints = 50;
    const totalPoints = basePoints + bonusPoints;

    const timer = setTimeout(() => {
      setPointsEarned(totalPoints);
      addPoints(totalPoints);
    }, 1500);

    // Hide confetti after animation
    const confettiTimer = setTimeout(() => setShowConfetti(false), 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(confettiTimer);
    };
  }, [order.id, navigate, pricing.total, addPoints]);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await downloadPDF({
        sender,
        recipient,
        package: pkg,
        selectedCarrier,
        services,
        pricing,
        order,
      });
      success('Lettera di vettura scaricata con successo!');
    } catch (e) {
      error('Errore durante il download. Riprova.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyTracking = async () => {
    try {
      await navigator.clipboard.writeText(order.tracking);
      setCopied(true);
      success('Codice tracking copiato!');
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      error('Errore durante la copia');
    }
  };

  const handleNewShipment = () => {
    resetAll();
    navigate('/shipment');
  };

  if (!order.id) {
    return null;
  }

  const newTotalPoints = loyalty.points + pointsEarned;

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      {/* Confetti Animation */}
      <AnimatePresence>{showConfetti && <Confetti />}</AnimatePresence>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
            className="w-28 h-28 mx-auto mb-6 rounded-full bg-green-600/20 border-4 border-green-500 flex items-center justify-center"
          >
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <CheckCircle className="w-14 h-14 text-green-500" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Spedizione confermata!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 max-w-md mx-auto"
          >
            Il tuo ordine è stato elaborato con successo.
            Riceverai una conferma via email a breve.
          </motion.p>
        </motion.div>

        {/* Points Earned Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mb-8 p-6 bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-600/30 rounded-2xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2, type: 'spring', stiffness: 400 }}
                className="w-14 h-14 rounded-xl bg-amber-600/30 flex items-center justify-center"
              >
                <Star className="w-7 h-7 text-amber-500" />
              </motion.div>
              <div>
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Punti guadagnati!
                </h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  className="text-amber-500 text-2xl font-bold"
                >
                  +{pointsEarned} punti
                </motion.p>
                <p className="text-slate-400 text-sm">
                  Totale: {newTotalPoints.toLocaleString()} punti
                </p>
              </div>
            </div>
            <Link
              to="/loyalty"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              Vedi premi
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="text-center md:text-left">
              <p className="text-slate-400 text-sm mb-1">Numero ordine</p>
              <p className="text-2xl font-bold text-white">{order.id}</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-400 text-sm mb-1">Codice tracking</p>
              <div className="flex items-center justify-center md:justify-end gap-2">
                <p className="text-2xl font-bold text-sky-600">{order.tracking}</p>
                <button
                  onClick={handleCopyTracking}
                  className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Corriere</p>
                <p className="text-white font-semibold">{selectedCarrier?.name}</p>
              </div>
              <div>
                <p className="text-slate-400">Consegna stimata</p>
                <p className="text-white">{selectedCarrier?.delivery}</p>
              </div>
              <div>
                <p className="text-slate-400">Data ordine</p>
                <p className="text-white">{formatDateTime(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-slate-400">Totale pagato</p>
                <p className="text-sky-600 font-bold">{formatPrice(pricing.total)}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Download in corso...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Scarica Lettera di Vettura
              </>
            )}
          </button>

          <Link
            to={`/tracking?code=${order.tracking}`}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-all"
          >
            <Package className="w-5 h-5" />
            Traccia spedizione
            <ExternalLink className="w-4 h-4 ml-1" />
          </Link>
        </motion.div>

        {/* Email notification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-sky-600/20 flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">
                Email di conferma inviata
              </h3>
              <p className="text-slate-400 text-sm">
                Abbiamo inviato una email di conferma a{' '}
                <span className="text-white">{sender.email}</span> con tutti i dettagli
                della spedizione e la lettera di vettura in allegato.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Gift mode message */}
        {services.giftMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="bg-pink-600/10 border border-pink-600/30 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-pink-600/20 flex items-center justify-center">
                <span className="text-xl">🎁</span>
              </div>
              <h3 className="text-white font-semibold">Modalità Regalo attiva</h3>
            </div>
            <p className="text-slate-300 text-sm mb-3">
              I prezzi sono stati nascosti dalla lettera di vettura.
            </p>
            {services.giftMessage && (
              <div className="bg-gradient-to-r from-pink-600/20 to-amber-600/20 rounded-lg p-4">
                <p className="text-white italic">"{services.giftMessage}"</p>
              </div>
            )}
          </motion.div>
        )}

        {/* New shipment */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <button
            onClick={handleNewShipment}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl border border-slate-700 transition-all"
          >
            Nuova spedizione
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Success;
