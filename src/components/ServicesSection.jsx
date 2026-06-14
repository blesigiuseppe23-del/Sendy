import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Gift,
  Shield,
  Building2,
  Check,
  Sparkles,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { useShipmentStore } from '../store/shipmentStore';
import { formatPrice } from '../utils/formatters';

export const ServicesSection = ({ onComplete, onBack }) => {
  const { services, setInsurance, setServices, pricing, setPricing } = useShipmentStore();
  const [localServices, setLocalServices] = useState({
    floorDelivery: services.floorDelivery,
    extendedInsurance: services.insurance?.extended || false,
    insuredValue: services.insurance?.value || 0,
    giftMode: services.giftMode,
    giftMessage: services.giftMessage,
  });

  useEffect(() => {
    let extras = 0;
    if (localServices.floorDelivery) extras += 5;
    if (localServices.extendedInsurance) extras += 4;

    const total = (pricing.base || 0) + extras;
    setPricing({ ...pricing, extras, total });

    setServices({
      floorDelivery: localServices.floorDelivery,
      giftMode: localServices.giftMode,
      giftMessage: localServices.giftMessage,
    });

    setInsurance({
      basic: true,
      extended: localServices.extendedInsurance,
      value: localServices.insuredValue,
    });
  }, [localServices]);

  const handleServiceToggle = (serviceKey) => {
    setLocalServices((prev) => ({
      ...prev,
      [serviceKey]: !prev[serviceKey],
    }));
  };

  const handleInsuredValueChange = (value) => {
    const numValue = Math.min(10000, Math.max(50, Number(value)));
    setLocalServices((prev) => ({
      ...prev,
      insuredValue: numValue,
    }));
  };

  const handleGiftMessageChange = (message) => {
    if (message.length <= 200) {
      setLocalServices((prev) => ({
        ...prev,
        giftMessage: message,
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-sky-600/20 flex items-center justify-center">
          <Settings className="w-5 h-5 text-sky-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Servizi Accessori</h3>
          <p className="text-slate-400 text-sm">Personalizza la tua spedizione</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Free Basic Insurance - Always included */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl border-2 border-green-600/50 bg-green-600/5"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-white">Assicurazione Base</h4>
                <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-semibold rounded-full">
                  INCLUSA GRATIS
                </span>
              </div>
              <p className="text-slate-300 text-sm mt-1">
                Ogni spedizione è assicurata gratuitamente fino a 49€
              </p>
              <p className="text-slate-500 text-xs mt-2">
                In caso di smarrimento o danneggiamento rimborsiamo fino a 49€
              </p>
            </div>
            <div className="text-green-500 font-semibold">Gratis</div>
          </div>
        </motion.div>

        {/* Extended Insurance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-5 rounded-xl border-2 transition-all ${
            localServices.extendedInsurance
              ? 'border-amber-600 bg-amber-600/10'
              : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
          }`}
        >
          <div className="flex items-start gap-4">
            <button
              onClick={() => handleServiceToggle('extendedInsurance')}
              className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                localServices.extendedInsurance
                  ? 'bg-amber-600/20 border-amber-600 border-2'
                  : 'border-2 border-slate-600'
              }`}
            >
              {localServices.extendedInsurance && <Check className="w-4 h-4 text-amber-600" />}
            </button>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-600" />
                    Assicurazione Estesa
                  </h4>
                  <p className="text-slate-400 text-sm mt-1">
                    Estendi la copertura oltre i 49€
                  </p>
                  <p className="text-amber-500 text-xs mt-2">
                    Valore minimo assicurabile: €50
                  </p>
                </div>
                <span className="font-semibold text-white">+€4.00</span>
              </div>

              <AnimatePresence>
                {localServices.extendedInsurance && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-slate-700"
                  >
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Valore assicurato
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">€</span>
                      <input
                        type="number"
                        value={localServices.insuredValue || ''}
                        onChange={(e) => handleInsuredValueChange(e.target.value)}
                        placeholder="Min €50 - Max €10.000"
                        className="w-full pl-8 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-600"
                        min="50"
                        max="10000"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Copertura fino a €{localServices.insuredValue || 50}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Servizio Standard */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-xl border-2 border-sky-600/30 bg-sky-600/10"
        >
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-sky-600/30 flex items-center justify-center">
              <Check className="w-4 h-4 text-sky-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-sky-600" />
                    Servizio Standard
                  </h4>
                  <p className="text-slate-400 text-sm mt-1">
                    Tracking base, notifica email di consegna, assistenza clienti
                  </p>
                </div>
                <span className="text-slate-500 font-semibold">Incluso</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Consegna al Piano */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-5 rounded-xl border-2 transition-all ${
            localServices.floorDelivery
              ? 'border-emerald-600 bg-emerald-600/10'
              : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
          }`}
        >
          <div className="flex items-start gap-4">
            <button
              onClick={() => handleServiceToggle('floorDelivery')}
              className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                localServices.floorDelivery
                  ? 'bg-emerald-600/20 border-emerald-600 border-2'
                  : 'border-2 border-slate-600'
              }`}
            >
              {localServices.floorDelivery && <Check className="w-4 h-4 text-emerald-600" />}
            </button>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    Consegna al Piano
                  </h4>
                  <p className="text-slate-400 text-sm mt-1">
                    Il corriere consegna direttamente all'appartamento
                  </p>
                </div>
                <span className="font-semibold text-white">+€5.00</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modalità Regalo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-5 rounded-xl border-2 transition-all ${
            localServices.giftMode
              ? 'border-pink-600 bg-pink-600/10'
              : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
          }`}
        >
          <div className="flex items-start gap-4">
            <button
              onClick={() => handleServiceToggle('giftMode')}
              className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                localServices.giftMode
                  ? 'bg-pink-600/20 border-pink-600 border-2'
                  : 'border-2 border-slate-600'
              }`}
            >
              {localServices.giftMode && <Check className="w-4 h-4 text-pink-600" />}
            </button>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <Gift className="w-5 h-5 text-pink-600" />
                    Modalità Regalo
                  </h4>
                  <p className="text-slate-400 text-sm mt-1">
                    Nascondi i prezzi e includi un biglietto personalizzato
                  </p>
                </div>
                <span className="text-slate-500 font-semibold">Gratis</span>
              </div>

              <AnimatePresence>
                {localServices.giftMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-slate-700 space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Messaggio d'auguri ({localServices.giftMessage.length}/200)
                      </label>
                      <textarea
                        value={localServices.giftMessage}
                        onChange={(e) => handleGiftMessageChange(e.target.value)}
                        placeholder="Scrivi un messaggio speciale..."
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-pink-600 resize-none"
                      />
                    </div>

                    <div className="p-4 bg-slate-900/50 rounded-xl border border-pink-600/30">
                      <div className="flex items-center gap-2 text-pink-600 text-sm mb-2">
                        <Gift className="w-4 h-4" />
                        <span className="font-medium">Anteprima biglietto</span>
                      </div>
                      <div className="bg-gradient-to-br from-pink-600/10 to-amber-600/10 rounded-lg p-4 text-center">
                        <p className="text-white italic">
                          {localServices.giftMessage || 'Il tuo messaggio apparirà qui...'}
                        </p>
                        <p className="text-slate-400 text-xs mt-2">
                          Questo pacco è un regalo speciale
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Lock className="w-4 h-4" />
                      <span>I prezzi saranno nascosti nel PDF della lettera di vettura</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Riepilogo Prezzi */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-6 bg-slate-800/50 border border-slate-700 rounded-2xl"
      >
        <h4 className="text-lg font-semibold text-white mb-4">Riepilogo Prezzi</h4>
        <div className="space-y-3">
          <div className="flex justify-between text-slate-300">
            <span>Prezzo base spedizione</span>
            <span>{formatPrice(pricing.base || 0)}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Assicurazione base (fino a €49)</span>
            <span>Inclusa</span>
          </div>
          {localServices.extendedInsurance && (
            <div className="flex justify-between text-slate-300">
              <span>+ Assicurazione estesa (fino a €{localServices.insuredValue || 50})</span>
              <span>+€4.00</span>
            </div>
          )}
          {localServices.floorDelivery && (
            <div className="flex justify-between text-slate-300">
              <span>+ Consegna al piano</span>
              <span>+€5.00</span>
            </div>
          )}
          <div className="pt-3 border-t border-slate-700 flex justify-between">
            <span className="text-white font-semibold text-lg">TOTALE</span>
            <span className="text-sky-600 font-bold text-2xl">{formatPrice(pricing.total || 0)}</span>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-4">
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
          className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-all"
        >
          Continua
        </motion.button>
      </div>
    </div>
  );
};

export default ServicesSection;
