import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, User, MapPin, Truck, Settings, CreditCard, Check, Shield } from 'lucide-react';
import { useShipmentStore, getStepTitle } from '../store/shipmentStore';
import { ShipmentForm } from '../components/ShipmentForm';
import { PackageSection } from '../components/PackageSection';
import { CarrierCard } from '../components/CarrierCard';
import { ServicesSection } from '../components/ServicesSection';
import { PaymentSplit } from '../components/PaymentSplit';
import { SummarySection } from '../components/SummarySection';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/Toast';
import { generateOrderId, generateTracking } from '../services/tracking';

const steps = [
  { id: 1, title: 'Mittente & Destinatario', icon: User },
  { id: 2, title: 'Dati Pacco', icon: Package },
  { id: 3, title: 'Seleziona Corriere', icon: Truck },
  { id: 4, title: 'Servizi Accessori', icon: Settings },
  { id: 5, title: 'Riepilogo', icon: Check },
  { id: 6, title: 'Pagamento', icon: CreditCard },
  { id: 7, title: 'Conferma', icon: Shield },
];

export const Shipment = () => {
  const navigate = useNavigate();
  const { toasts, removeToast, success, error } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    currentStep,
    setStep,
    setOrder,
    resetAll,
  } = useShipmentStore();

  const nextStep = () => setStep(Math.min(currentStep + 1, 7));
  const prevStep = () => setStep(Math.max(currentStep - 1, 1));

  const handlePaymentComplete = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const orderId = generateOrderId();
      const trackingCode = generateTracking();
      setOrder({
        id: orderId,
        tracking: trackingCode,
        createdAt: new Date().toISOString(),
      });
      success('Ordine confermato con successo!');
      navigate('/success');
    } catch (e) {
      error('Errore durante la conferma. Riprova.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ShipmentForm onComplete={nextStep} />;
      case 2:
        return <PackageSection onComplete={nextStep} onBack={prevStep} />;
      case 3:
        return <CarrierCard onComplete={nextStep} onBack={prevStep} />;
      case 4:
        return <ServicesSection onComplete={nextStep} onBack={prevStep} />;
      case 5:
        return <SummarySection onComplete={nextStep} onBack={prevStep} />;
      case 6:
        return <PaymentSplit onComplete={handlePaymentComplete} onBack={prevStep} />;
      default:
        return null;
    }
  };

  const progressBarWidth = `${(currentStep / 7) * 100}%`;

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 mx-auto border-4 border-sky-600 border-t-transparent rounded-full"
              />
              <h3 className="text-xl font-semibold text-white mt-8">Elaborazione in corso...</h3>
              <p className="text-slate-400 mt-2">Attendere prego, non lasciare la pagina.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Nuova Spedizione</h1>
          <p className="text-slate-400">Completa tutti i passaggi per spedire il tuo pacco</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-slate-800 rounded-2xl p-4 md:p-6">
            {/* Desktop: Step indicators */}
            <div className="hidden md:flex items-center justify-between mb-4">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex flex-col items-center ${
                      currentStep >= step.id ? '' : 'opacity-50'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        currentStep > step.id
                          ? 'bg-sky-600'
                          : currentStep === step.id
                          ? 'bg-sky-600/20 border-2 border-sky-600'
                          : 'bg-slate-700'
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <step.icon
                          className={`w-6 h-6 ${
                            currentStep === step.id ? 'text-sky-600' : 'text-slate-500'
                          }`}
                        />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium ${
                        currentStep >= step.id ? 'text-sky-600' : 'text-slate-500'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`h-0.5 w-24 mx-2 mt-[-18px] ${
                        currentStep > step.id ? 'bg-sky-600' : 'bg-slate-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Mobile: Simplified progress */}
            <div className="md:hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Passo {currentStep} di 7</span>
                <span className="text-sky-600 font-medium">{steps[currentStep - 1]?.title}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: progressBarWidth }}
                className="h-full bg-gradient-to-r from-sky-600 to-cyan-400 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Step Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Shipment;
