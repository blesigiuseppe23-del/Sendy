import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { getStepTitle } from '../store/shipmentStore';
import { useShipmentStore } from '../store/shipmentStore';

const steps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const ProgressStepper = () => {
  const { currentStep } = useShipmentStore();

  return (
    <div className="w-full">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center group">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: step <= currentStep ? '#0284c7' : '#334155',
                  borderColor: step < currentStep ? '#0284c7' : step === currentStep ? '#0284c7' : '#475569',
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  step < currentStep ? 'text-white' : step === currentStep ? 'text-white' : 'text-slate-500'
                }`}
              >
                {step < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{step}</span>
                )}
              </motion.div>
              <span
                className={`mt-2 text-xs font-medium transition-colors ${
                  step <= currentStep ? 'text-sky-600' : 'text-slate-500'
                }`}
              >
                {getStepTitle(step)}
              </span>
            </div>
            {step < 10 && (
              <div className="flex-1 h-0.5 mx-2 mt-[-24px]">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: step < currentStep ? '#0284c7' : '#475569',
                  }}
                  className="h-full transition-colors"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm">Step {currentStep} di 10</span>
          <span className="text-sky-600 font-semibold text-sm">{getStepTitle(currentStep)}</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / 10) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full bg-sky-600 rounded-full"
          />
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step) => (
            <motion.div
              key={step}
              initial={false}
              animate={{
                scale: step === currentStep ? 1.2 : 1,
                opacity: step <= currentStep ? 1 : 0.3,
              }}
              className={`w-2 h-2 rounded-full ${
                step < currentStep ? 'bg-sky-600' : step === currentStep ? 'bg-sky-600' : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressStepper;
