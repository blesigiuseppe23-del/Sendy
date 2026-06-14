import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Scale, MapPin, ArrowRight, Check, Sparkles, Zap, TrendingDown, Truck, Loader2 } from 'lucide-react';
import { CARRIERS, getCarrierRate } from '../services/carriers';
import { useShipmentStore } from '../store/shipmentStore';
import { formatPrice } from '../utils/formatters';
import { Skeleton } from '../components/Skeleton';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/Toast';

const CarrierSkeletonCard = () => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <Skeleton variant="text" className="w-24 h-8" />
      <Skeleton variant="text" className="w-20 h-4" />
    </div>
    <Skeleton variant="text" className="w-full h-4 mb-2" />
    <Skeleton variant="text" className="w-3/4 h-4" />
    <div className="mt-4 pt-4 border-t border-slate-700">
      <Skeleton variant="text" className="w-32 h-8" />
    </div>
  </div>
);

export const Compare = () => {
  const navigate = useNavigate();
  const { success } = useToast();
  const { setPackage, setSelectedCarrier, setPricing } = useShipmentStore();
  const [formData, setFormData] = useState({
    peso: '',
    lunghezza: '',
    larghezza: '',
    altezza: '',
    capMittente: '',
    capDestinatario: '',
  });
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCompare = async () => {
    const peso = parseFloat(formData.peso) || 0;
    const lunghezza = parseFloat(formData.lunghezza) || 0;
    const larghezza = parseFloat(formData.larghezza) || 0;
    const altezza = parseFloat(formData.altezza) || 0;

    if (peso <= 0 || lunghezza <= 0 || larghezza <= 0 || altezza <= 0) {
      return;
    }

    setIsLoading(true);
    setResults(null);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const pesoVolumetrico = (lunghezza * larghezza * altezza) / 5000;
    const pesoDeterminante = Math.max(peso, pesoVolumetrico);

    const carrierResults = CARRIERS.map((carrier) => {
      const rate = getCarrierRate(carrier.id);
      const basePrice = (pesoVolumetrico * rate) + (peso * 2.50);
      return {
        ...carrier,
        price: Math.max(basePrice, 6.50),
      };
    }).sort((a, b) => a.price - b.price);

    setResults({
      pesoVolumetrico,
      pesoDeterminante,
      carriers: carrierResults,
    });

    setIsLoading(false);
  };

  const handleSelectCarrier = (carrier) => {
    const peso = parseFloat(formData.peso) || 0;
    const lunghezza = parseFloat(formData.lunghezza) || 0;
    const larghezza = parseFloat(formData.larghezza) || 0;
    const altezza = parseFloat(formData.altezza) || 0;

    const pesoVolumetrico = (lunghezza * larghezza * altezza) / 5000;
    const pesoDeterminante = Math.max(peso, pesoVolumetrico);

    setPackage({
      peso,
      lunghezza,
      larghezza,
      altezza,
      pesoVolumetrico,
      pesoDeterminante,
    });

    setSelectedCarrier(carrier);
    setPricing({
      base: carrier.price,
      total: carrier.price,
      floorDelivery: 0,
      insurance: 0,
    });

    success(`${carrier.name} selezionato!`);
    navigate('/shipment?step=3');
  };

  const isFormValid =
    parseFloat(formData.peso) > 0 &&
    parseFloat(formData.lunghezza) > 0 &&
    parseFloat(formData.larghezza) > 0 &&
    parseFloat(formData.altezza) > 0;

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-emerald-600/20 flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Compara i Corrieri</h1>
          <p className="text-slate-400">Trova il miglior prezzo per la tua spedizione</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Scale className="w-4 h-4 inline mr-2" />
                Peso (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.peso}
                onChange={(e) => handleChange('peso', e.target.value)}
                placeholder="es. 2.5"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Lunghezza (cm)
              </label>
              <input
                type="number"
                value={formData.lunghezza}
                onChange={(e) => handleChange('lunghezza', e.target.value)}
                placeholder="es. 30"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Larghezza (cm)
              </label>
              <input
                type="number"
                value={formData.larghezza}
                onChange={(e) => handleChange('larghezza', e.target.value)}
                placeholder="es. 20"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Altezza (cm)
              </label>
              <input
                type="number"
                value={formData.altezza}
                onChange={(e) => handleChange('altezza', e.target.value)}
                placeholder="es. 15"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                CAP Mittente
              </label>
              <input
                type="text"
                maxLength={5}
                value={formData.capMittente}
                onChange={(e) => handleChange('capMittente', e.target.value)}
                placeholder="es. 00100"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                CAP Destinatario
              </label>
              <input
                type="text"
                maxLength={5}
                value={formData.capDestinatario}
                onChange={(e) => handleChange('capDestinatario', e.target.value)}
                placeholder="es. 20100"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <button
            onClick={handleCompare}
            disabled={!isFormValid || isLoading}
            className={`w-full mt-6 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
              isFormValid && !isLoading
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-slate-700 opacity-50 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <BarChart3 className="w-5 h-5" />
                Confronta corrieri
              </>
            )}
          </button>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[1, 2, 3].map((i) => (
                <CarrierSkeletonCard key={i} />
              ))}
            </motion.div>
          )}

          {results && !isLoading && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Volumetric info */}
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 flex justify-between">
                <span className="text-slate-400">Peso volumetrico: </span>
                <span className="text-white font-semibold">{results.pesoVolumetrico.toFixed(2)} kg</span>
              </div>

              {/* Carrier cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.carriers.map((carrier, idx) => (
                  <motion.div
                    key={carrier.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`relative bg-slate-800/50 border-2 rounded-2xl p-6 transition-all ${
                      idx === 0 ? 'border-emerald-600' : 'border-slate-700'
                    }`}
                  >
                    {idx === 0 && (
                      <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-xs font-semibold text-white flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        Più economico
                      </div>
                    )}
                    {carrier.id === 'dhl' && (
                      <div className="absolute -top-3 left-4 px-3 py-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full text-xs font-semibold text-white flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Più veloce
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
                        <Truck className="w-4 h-4" />
                        <span className="text-sm">{carrier.delivery}</span>
                      </div>
                    </div>

                    <p className="text-slate-300 text-sm mb-4">{carrier.description}</p>

                    <div className="pt-4 border-t border-slate-700">
                      <p className="text-slate-400 text-sm">Prezzo</p>
                      <p className="text-3xl font-bold text-white my-2">{formatPrice(carrier.price)}</p>
                      <button
                        onClick={() => handleSelectCarrier(carrier)}
                        className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all"
                      >
                        Scegli
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Toast toasts={[]} removeToast={() => {}} />
    </div>
  );
};

export default Compare;
