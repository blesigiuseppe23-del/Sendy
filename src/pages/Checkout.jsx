import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, User, MapPin, Package, Truck, Settings, ArrowLeft } from 'lucide-react';
import { useShipmentStore } from '../store/shipmentStore';
import { formatPrice } from '../utils/formatters';

export const Checkout = () => {
  const navigate = useNavigate();
  const {
    sender,
    recipient,
    package: pkg,
    selectedCarrier,
    services,
    pricing,
    payment,
    nextStep,
    currentStep,
  } = useShipmentStore();

  useEffect(() => {
    if (!selectedCarrier || !pricing.total) {
      navigate('/shipment');
    }
  }, [selectedCarrier, pricing.total, navigate]);

  const handleProceed = () => {
    navigate('/shipment');
  };

  if (!selectedCarrier || !pricing.total) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 mt-4">Caricamento...</p>
        </div>
      </div>
    );
  }

  const details = [
    {
      icon: User,
      title: 'Mittente',
      color: 'sky',
      items: [
        `${sender.nome} ${sender.cognome}`,
        sender.indirizzo,
        sender.telefono,
        sender.email,
      ],
    },
    {
      icon: MapPin,
      title: 'Destinatario',
      color: 'emerald',
      items: [
        `${recipient.nome} ${recipient.cognome}`,
        recipient.indirizzo,
        recipient.telefono,
        recipient.email,
      ],
    },
    {
      icon: Package,
      title: 'Pacco',
      color: 'amber',
      items: [
        `Peso: ${pkg.peso} kg (Vol: ${pkg.pesoVolumetrico?.toFixed(2)} kg)`,
        `Dimensioni: ${pkg.lunghezza}x${pkg.larghezza}x${pkg.altezza} cm`,
        `Peso determinante: ${pkg.pesoDeterminante?.toFixed(2)} kg`,
      ],
    },
    {
      icon: Truck,
      title: 'Corriere',
      color: 'orange',
      items: [
        selectedCarrier.name,
        `Consegna: ${selectedCarrier.delivery}`,
      ],
    },
  ];

  const activeServices = [
    { name: 'Servizio Standard', price: 0 },
    ...(services.floorDelivery ? [{ name: 'Consegna al piano', price: 5 }] : []),
    ...(services.insurance ? [{ name: 'Assicurazione extra', price: Math.max(4, services.insuredValue * 0.02) }] : []),
    ...(services.giftMode ? [{ name: 'Modalità regalo', price: 0 }] : []),
  ];

  const colorClasses = {
    sky: { bg: 'bg-sky-600/20', border: 'border-sky-600', text: 'text-sky-600' },
    emerald: { bg: 'bg-emerald-600/20', border: 'border-emerald-600', text: 'text-emerald-600' },
    amber: { bg: 'bg-amber-600/20', border: 'border-amber-600', text: 'text-amber-600' },
    orange: { bg: 'bg-orange-600/20', border: 'border-orange-600', text: 'text-orange-600' },
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sky-600/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Riepilogo Ordine</h1>
                <p className="text-slate-400 text-sm">Controlla i dettagli prima di procedere</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Connessione sicura</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {details.map((section, idx) => {
              const colors = colorClasses[section.color];
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                      <section.icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <h3 className="font-semibold text-white">{section.title}</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    {section.items.map((item, i) => (
                      <p key={i} className="text-slate-300">{item}</p>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-white">Servizi attivi</h3>
            </div>
            <div className="space-y-3">
              {activeServices.map((service, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">{service.name}</span>
                  <span className="text-white font-medium">
                    {service.price === 0 ? 'Incluso' : `+${formatPrice(service.price)}`}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Payment Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-sky-600/10 to-emerald-600/10 border border-sky-600/30 rounded-2xl p-6"
          >
            <div className="space-y-3">
              <div className="flex justify-between text-slate-300">
                <span>Prezzo base</span>
                <span>{formatPrice(pricing.base)}</span>
              </div>
              {pricing.extras > 0 && (
                <div className="flex justify-between text-slate-300">
                  <span>Servizi extra</span>
                  <span>{formatPrice(pricing.extras)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-sky-600/30 flex justify-between">
                <span className="text-white font-semibold text-lg">TOTALE</span>
                <span className="text-sky-600 font-bold text-2xl">{formatPrice(pricing.total)}</span>
              </div>
            </div>
          </motion.div>

          {/* Payment mode info */}
          {payment.mode !== 'sender' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-slate-400 p-4 bg-slate-800/30 rounded-lg"
            >
              {payment.mode === 'split' && (
                <p>Split payment: Mittente {formatPrice(payment.senderAmount)} ({payment.senderPercent}%) | Destinatario {formatPrice(payment.recipientAmount)} ({100 - payment.senderPercent}%)</p>
              )}
              {payment.mode === 'recipient' && (
                <p>Il destinatario pagherà {formatPrice(pricing.total)} alla consegna tramite il link di pagamento.</p>
              )}
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => navigate('/shipment')}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Modifica
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleProceed}
              className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              Procedi al pagamento
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
