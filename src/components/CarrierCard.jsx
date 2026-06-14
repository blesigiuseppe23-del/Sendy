import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Clock, Check, Sparkles } from 'lucide-react';
import { CARRIERS, getCarrierRate } from '../services/carriers';
import { useShipmentStore } from '../store/shipmentStore';
import { formatPrice } from '../utils/formatters';
import { Skeleton } from './Skeleton';

const CarrierSkeleton = () => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <Skeleton variant="text" className="w-24 h-8" />
      <Skeleton variant="text" className="w-20 h-4" />
    </div>
    <Skeleton variant="text" className="w-full h-4 mb-2" />
    <Skeleton variant="text" className="w-3/4 h-4 mb-4" />
    <div className="flex justify-between items-center pt-4 border-t border-slate-700">
      <Skeleton variant="text" className="w-20 h-6" />
      <Skeleton variant="button" className="w-24 h-10" />
    </div>
  </div>
);

const CarrierItem = ({ carrier, isSelected, onSelect, price, isBest }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onSelect(carrier)}
    className={`relative w-full text-left p-6 rounded-2xl border-2 transition-all ${
      isSelected
        ? 'border-sky-600 bg-sky-600/10'
        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
    }`}
  >
    {isBest && (
      <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-xs font-semibold text-white flex items-center gap-1">
        <Sparkles className="w-3 h-3" />
        Miglior prezzo
      </div>
    )}

    <div className="flex items-center justify-between mb-4">
      <div
        className="text-2xl font-bold px-3 py-1 rounded"
        style={{
          backgroundColor: carrier.color + '20',
          color: carrier.color,
        }}
      >
        {carrier.logo}
      </div>
      <div className="flex items-center gap-2 text-slate-400">
        <Clock className="w-4 h-4" />
        <span className="text-sm">{carrier.delivery}</span>
      </div>
    </div>

    <p className="text-slate-300 text-sm mb-2">{carrier.description}</p>
    <div className="flex flex-wrap gap-2 mb-4">
      {carrier.features.map((feature, idx) => (
        <span
          key={idx}
          className="text-xs px-2 py-1 bg-slate-700/50 rounded-full text-slate-400"
        >
          {feature}
        </span>
      ))}
    </div>

    <div className="flex justify-between items-center pt-4 border-t border-slate-700">
      <div>
        <p className="text-slate-400 text-xs">Prezzo</p>
        <p className="text-2xl font-bold text-white">{formatPrice(price)}</p>
      </div>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isSelected ? 'bg-sky-600' : 'border-2 border-slate-600'
        }`}
      >
        {isSelected && <Check className="w-5 h-5 text-white" />}
      </div>
    </div>
  </motion.button>
);

export const CarrierCard = ({ onComplete, onBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { package: pkg, selectedCarrier, setSelectedCarrier, setPricing, services } = useShipmentStore();

  const calculateCarrierPrice = (carrier) => {
    const pesoReale = pkg.peso || 0;
    const pesoVolumetrico = pkg.pesoVolumetrico || 0;
    const rate = getCarrierRate(carrier.id);

    const basePrice = (pesoVolumetrico * rate) + (pesoReale * 2.50);
    return Math.max(basePrice, 6.50);
  };

  const carriersWithPrices = CARRIERS.map((carrier) => ({
    ...carrier,
    price: calculateCarrierPrice(carrier),
  })).sort((a, b) => a.price - b.price);

  const bestPrice = carriersWithPrices[0]?.price;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedCarrier && pkg.pesoDeterminante > 0) {
      const price = calculateCarrierPrice(selectedCarrier);
      setPricing({
        ...useShipmentStore.getState().pricing,
        base: price,
        total: price,
      });
    }
  }, [selectedCarrier]);

  const handleSelect = (carrier) => {
    setSelectedCarrier(carrier);
    const price = calculateCarrierPrice(carrier);
    setPricing({
      ...useShipmentStore.getState().pricing,
      base: price,
      total: price,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-sky-600/20 flex items-center justify-center">
          <Truck className="w-5 h-5 text-sky-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Seleziona Corriere</h3>
          <p className="text-slate-400 text-sm">Confronta i migliori corrieri per la tua spedizione</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {[1, 2, 3].map((i) => (
              <CarrierSkeleton key={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {carriersWithPrices.map((carrier) => (
              <CarrierItem
                key={carrier.id}
                carrier={carrier}
                isSelected={selectedCarrier?.id === carrier.id}
                onSelect={handleSelect}
                price={carrier.price}
                isBest={carrier.price === bestPrice}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-4 mt-8">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onBack}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all"
        >
          Indietro
        </motion.button>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onComplete}
          disabled={!selectedCarrier}
          className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all ${
            selectedCarrier
              ? 'bg-sky-600 hover:bg-sky-700 cursor-pointer'
              : 'bg-slate-700 cursor-not-allowed opacity-50'
          }`}
        >
          Continua
        </motion.button>
      </div>
    </div>
  );
};

export default CarrierCard;
