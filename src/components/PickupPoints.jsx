import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Navigation, Check, X } from 'lucide-react';
import { useShipmentStore } from '../store/shipmentStore';

export const PickupPointsModal = ({ isOpen, onClose, who, onSelect }) => {
  const { PICKUP_POINTS } = useShipmentStore();
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (point) => {
    setSelectedId(point.id);
    onSelect(point);
  };

  const handleConfirm = () => {
    const point = PICKUP_POINTS.find(p => p.id === selectedId);
    if (point) {
      onSelect(point);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-800 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-600" />
            <h3 className="font-semibold text-white">Seleziona Punto di Ritiro</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {PICKUP_POINTS.map((point) => (
            <motion.button
              key={point.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(point)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedId === point.id
                  ? 'border-sky-600 bg-sky-600/10'
                  : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedId === point.id ? 'bg-sky-600' : 'bg-slate-700'
                }`}>
                  {selectedId === point.id ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <MapPin className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">{point.nome}</p>
                  <p className="text-slate-400 text-sm">{point.indirizzo}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      {point.orari}
                    </span>
                    <span className="flex items-center gap-1 text-sky-600 font-medium">
                      <Navigation className="w-3 h-3" />
                      {point.distanza}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleConfirm}
            disabled={!selectedId}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              selectedId
                ? 'bg-sky-600 hover:bg-sky-700 text-white'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            Conferma punto ritiro
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const DeliveryModeToggle = ({ who, value, onChange }) => {
  return (
    <div className="flex gap-3 mt-4 p-1 bg-slate-900 rounded-lg">
      <button
        onClick={() => onChange('home')}
        className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
          value === 'home'
            ? 'bg-sky-600 text-white'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <MapPin className="w-4 h-4" />
        Ritiro a domicilio
      </button>
      <button
        onClick={() => onChange('pickup')}
        className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
          value === 'pickup'
            ? 'bg-sky-600 text-white'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <Navigation className="w-4 h-4" />
        Punto di Ritiro
      </button>
    </div>
  );
};

export default PickupPointsModal;
