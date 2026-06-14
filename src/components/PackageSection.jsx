import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Scale, Ruler, Weight, ArrowLeftRight, Sparkles } from 'lucide-react';
import { packageSchema } from '../utils/validators';
import { useShipmentStore } from '../store/shipmentStore';
import AIMeasurement from './AICameraMeasurement';

const AnimatedNumber = ({ value, suffix = '', decimals = 2 }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      const start = displayValue;
      const end = value;
      const duration = 300;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * easeOut;
        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(end);
          prevValue.current = end;
        }
      };

      requestAnimationFrame(animate);
    }
  }, [value]);

  return (
    <span className="tabular-nums">
      {displayValue.toFixed(decimals)}{suffix}
    </span>
  );
};

export const PackageSection = ({ onComplete, onBack }) => {
  const { package: pkg, setPackage, setPricing, selectedCarrier } = useShipmentStore();
  const [showManualForm, setShowManualForm] = useState(false);
  const [volumetricData, setVolumetricData] = useState({
    pesoVolumetrico: 0,
    pesoDeterminante: 0,
  });

  const form = useForm({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      peso: pkg.peso || '',
      lunghezza: pkg.lunghezza || '',
      larghezza: pkg.larghezza || '',
      altezza: pkg.altezza || '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const subscription = form.watch((data) => {
      const peso = parseFloat(data.peso) || 0;
      const lunghezza = parseFloat(data.lunghezza) || 0;
      const larghezza = parseFloat(data.larghezza) || 0;
      const altezza = parseFloat(data.altezza) || 0;

      const pesoVolumetrico = (lunghezza * larghezza * altezza) / 5000;
      const pesoDeterminante = Math.max(peso, pesoVolumetrico);

      setVolumetricData({
        pesoVolumetrico,
        pesoDeterminante,
      });

      if (form.formState.isValid) {
        setPackage({
          peso,
          lunghezza,
          larghezza,
          altezza,
          pesoVolumetrico,
          pesoDeterminante,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, form.formState.isValid, setPackage]);

  const handleAIComplete = (dimensions) => {
    setPackage(dimensions);
    form.setValue('lunghezza', dimensions.lunghezza);
    form.setValue('larghezza', dimensions.larghezza);
    form.setValue('altezza', dimensions.altezza);
    setShowManualForm(true);

    const pesoVolumetrico = dimensions.pesoVolumetrico;
    setVolumetricData({
      pesoVolumetrico,
      pesoDeterminante: pesoVolumetrico,
    });
  };

  const handleSubmit = () => {
    const peso = parseFloat(form.watch('peso')) || 0;
    const pv = volumetricData.pesoVolumetrico || 0;
    const pd = Math.max(peso, pv);

    setPackage({
      peso,
      lunghezza: parseFloat(form.watch('lunghezza')) || 0,
      larghezza: parseFloat(form.watch('larghezza')) || 0,
      altezza: parseFloat(form.watch('altezza')) || 0,
      pesoVolumetrico: pv,
      pesoDeterminante: pd,
    });

    if (form.formState.isValid) {
      onComplete();
    }
  };

  const hasData = form.watch('lunghezza') > 0 && form.watch('larghezza') > 0;
  const errors = form.formState.errors;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Fields */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-sky-600/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-sky-600" />
            </div>
            <h3 className="text-lg font-semibold text-white">Dimensioni e Peso</h3>
          </div>

          {/* AI Measurement */}
          <AIMeasurement onComplete={handleAIComplete} />

          {/* Manual Form */}
          <AnimatePresence>
            {showManualForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-slate-700"
              >
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                      <Weight className="w-4 h-4 text-slate-500" />
                      Peso (kg) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...form.register('peso', { valueAsNumber: true })}
                      className={`w-full px-4 py-3 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-all ${
                        errors.peso ? 'border-red-500' : 'border-slate-700 focus:border-sky-600'
                      }`}
                      placeholder="2.5"
                    />
                    {errors.peso && (
                      <p className="text-red-400 text-xs mt-1">{errors.peso.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-1">
                        <Ruler className="w-3 h-3" />
                        Lungh. (cm)
                      </label>
                      <input
                        type="number"
                        {...form.register('lunghezza', { valueAsNumber: true })}
                        className={`w-full px-3 py-3 bg-slate-900 border rounded-lg text-white focus:outline-none transition-all ${
                          errors.lunghezza ? 'border-red-500' : 'border-slate-700 focus:border-sky-600'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">
                        Largh. (cm)
                      </label>
                      <input
                        type="number"
                        {...form.register('larghezza', { valueAsNumber: true })}
                        className={`w-full px-3 py-3 bg-slate-900 border rounded-lg text-white focus:outline-none transition-all ${
                          errors.larghezza ? 'border-red-500' : 'border-slate-700 focus:border-sky-600'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">
                        Alt. (cm)
                      </label>
                      <input
                        type="number"
                        {...form.register('altezza', { valueAsNumber: true })}
                        className={`w-full px-3 py-3 bg-slate-900 border rounded-lg text-white focus:outline-none transition-all ${
                          errors.altezza ? 'border-red-500' : 'border-slate-700 focus:border-sky-600'
                        }`}
                      />
                    </div>
                  </div>

                  {/* AI confidence badge */}
                  {pkg.measuredByAI && (
                    <div className="flex items-center gap-2 text-sm text-sky-600">
                      <Sparkles className="w-4 h-4" />
                      <span>Misurato con AI ({pkg.aiConfidence}% confidenza)</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Real-time Calculation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/20 flex items-center justify-center">
              <Scale className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-white">Calcolo in Tempo Reale</h3>
          </div>

          <AnimatePresence mode="wait">
            {!hasData ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Inserisci i dati del pacco per vedere il calcolo</p>
              </motion.div>
            ) : (
              <motion.div
                key="data"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Weight className="w-4 h-4" />
                    Peso reale
                  </span>
                  <AnimatedNumber value={form.watch('peso') || 0} suffix=" kg" />
                </div>

                <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-400 flex items-center gap-2">
                    <ArrowLeftRight className="w-4 h-4" />
                    Peso volumetrico
                  </span>
                  <AnimatedNumber value={volumetricData.pesoVolumetrico} suffix=" kg" />
                </div>

                <div className="flex justify-between items-center p-4 bg-sky-600/10 border border-sky-600/30 rounded-lg">
                  <span className="text-sky-400 flex items-center gap-2 font-medium">
                    <Scale className="w-4 h-4" />
                    Peso determinante
                  </span>
                  <AnimatedNumber
                    value={volumetricData.pesoDeterminante}
                    suffix=" kg"
                  />
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Ruler className="w-4 h-4" />
                    <span>Dimensioni:</span>
                    <span className="text-white font-medium">
                      {form.watch('lunghezza') || 0} × {form.watch('larghezza') || 0} × {form.watch('altezza') || 0} cm
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

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
          onClick={handleSubmit}
          disabled={!form.formState.isValid}
          className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
            form.formState.isValid
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

export default PackageSection;
