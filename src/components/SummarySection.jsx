import { motion } from 'framer-motion';
import {
  User,
  MapPin,
  Package,
  Truck,
  Settings,
  CreditCard,
  Check,
} from 'lucide-react';
import { useShipmentStore } from '../store/shipmentStore';
import { formatPrice } from '../utils/formatters';

export const SummarySection = ({ onComplete, onBack }) => {
  const {
    sender,
    recipient,
    package: pkg,
    selectedCarrier,
    services,
    pricing,
    payment,
  } = useShipmentStore();

  const sections = [
    {
      icon: User,
      title: 'Mittente',
      color: 'sky',
      data: [
        { label: 'Nome', value: `${sender.nome} ${sender.cognome}` },
        { label: 'Indirizzo', value: sender.indirizzo },
        { label: 'Telefono', value: sender.telefono },
        { label: 'Email', value: sender.email },
        ...(sender.piano ? [{ label: 'Piano', value: sender.piano }] : []),
        ...(sender.scala ? [{ label: 'Scala', value: sender.scala }] : []),
      ],
    },
    {
      icon: MapPin,
      title: 'Destinatario',
      color: 'emerald',
      data: [
        { label: 'Nome', value: `${recipient.nome} ${recipient.cognome}` },
        { label: 'Indirizzo', value: recipient.indirizzo },
        { label: 'Telefono', value: recipient.telefono },
        { label: 'Email', value: recipient.email },
        ...(recipient.piano ? [{ label: 'Piano', value: recipient.piano }] : []),
        ...(recipient.scala ? [{ label: 'Scala', value: recipient.scala }] : []),
      ],
    },
    {
      icon: Package,
      title: 'Pacco',
      color: 'amber',
      data: [
        { label: 'Peso reale', value: `${pkg.peso} kg` },
        { label: 'Peso volumetrico', value: `${pkg.pesoVolumetrico?.toFixed(2)} kg` },
        { label: 'Peso determinante', value: `${pkg.pesoDeterminante?.toFixed(2)} kg` },
        { label: 'Dimensioni', value: `${pkg.lunghezza} × ${pkg.larghezza} × ${pkg.altezza} cm` },
      ],
    },
    {
      icon: Truck,
      title: 'Corriere',
      color: 'orange',
      data: [
        { label: 'Nome', value: selectedCarrier?.name },
        { label: 'Consegna stimata', value: selectedCarrier?.delivery },
      ],
    },
    {
      icon: Settings,
      title: 'Servizi',
      color: 'purple',
      data: [
        { label: 'Standard', value: 'Incluso' },
        ...(services.floorDelivery ? [{ label: 'Consegna al piano', value: '+€5.00' }] : []),
        ...(services.insurance ? [{ label: `Assicurazione`, value: `+${formatPrice(services.insuredValue > 0 ? Math.max(4, services.insuredValue * 0.02) : 4)}` }] : []),
        ...(services.giftMode ? [{ label: 'Modalità regalo', value: 'Gratis' }] : []),
      ],
    },
    {
      icon: CreditCard,
      title: 'Pagamento',
      color: 'pink',
      data: payment.mode === 'sender'
        ? [{ label: 'Modalità', value: 'Pagamento completo mittente' }, { label: 'Totale', value: formatPrice(pricing.total) }]
        : payment.mode === 'recipient'
        ? [{ label: 'Modalità', value: 'Pagamento destinatario' }, { label: 'Totale', value: formatPrice(pricing.total) }]
        : [
            { label: 'Modalità', value: 'Split payment' },
            { label: 'Mittente', value: `${formatPrice(payment.senderAmount)} (${payment.senderPercent}%)` },
            { label: 'Destinatario', value: `${formatPrice(payment.recipientAmount)} (${100 - payment.senderPercent}%)` },
          ],
    },
  ];

  const colorClasses = {
    sky: { bg: 'bg-sky-600/20', border: 'border-sky-600', text: 'text-sky-600' },
    emerald: { bg: 'bg-emerald-600/20', border: 'border-emerald-600', text: 'text-emerald-600' },
    amber: { bg: 'bg-amber-600/20', border: 'border-amber-600', text: 'text-amber-600' },
    orange: { bg: 'bg-orange-600/20', border: 'border-orange-600', text: 'text-orange-600' },
    purple: { bg: 'bg-purple-600/20', border: 'border-purple-600', text: 'text-purple-600' },
    pink: { bg: 'bg-pink-600/20', border: 'border-pink-600', text: 'text-pink-600' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-sky-600/20 flex items-center justify-center">
          <Check className="w-5 h-5 text-sky-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Riepilogo Ordine</h3>
          <p className="text-slate-400 text-sm">Controlla i dati prima di procedere</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section, idx) => {
          const colors = colorClasses[section.color];
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                  <section.icon className={`w-4 h-4 ${colors.text}`} />
                </div>
                <h4 className="font-semibold text-white">{section.title}</h4>
              </div>
              <div className="space-y-2 text-sm">
                {section.data.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Total */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 bg-gradient-to-r from-sky-600/20 to-emerald-600/20 border border-sky-600/30 rounded-2xl"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-sm">Totale da pagare</p>
            <p className="text-3xl font-bold text-white mt-1">{formatPrice(pricing.total)}</p>
          </div>
          {payment.mode === 'split' && (
            <div className="text-right">
              <p className="text-slate-400 text-sm">Tu paghi</p>
              <p className="text-xl font-bold text-sky-600">{formatPrice(payment.senderAmount)}</p>
            </div>
          )}
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
          className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <CreditCard className="w-5 h-5" />
          Procedi al pagamento
        </motion.button>
      </div>
    </div>
  );
};

export default SummarySection;
