import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  User,
  MapPin,
  Link2,
  Copy,
  Check,
  Wallet,
  Split,
  Truck,
  Lock,
  Banknote,
  Loader2,
  QrCode,
  ExternalLink,
} from 'lucide-react';
import { useShipmentStore } from '../store/shipmentStore';
import { formatPrice } from '../utils/formatters';
import { useToast } from '../hooks/useToast';

const generatePaymentLink = () => {
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `https://sendy.app/pay/SDY-${code}`;
};

export const PaymentSplit = ({ onComplete, onBack }) => {
  const { pricing, payment, setPayment, recipient } = useShipmentStore();
  const { success, error } = useToast();
  const [paymentMode, setPaymentMode] = useState('sender');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [sliderValue, setSliderValue] = useState(50);
  const [paymentLink] = useState(generatePaymentLink());
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const handleCardChange = (field, value) => {
    let formatted = value;

    if (field === 'number') {
      formatted = value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    }
    if (field === 'expiry') {
      const clean = value.replace(/\D/g, '');
      if (clean.length >= 2) {
        formatted = `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
      } else {
        formatted = clean;
      }
    }
    if (field === 'cvv') {
      formatted = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardData((prev) => ({ ...prev, [field]: formatted }));
  };

  useEffect(() => {
    let senderAmount = pricing.total || 0;
    let recipientAmount = 0;
    let senderPercent = 100;
    let contrassegnoExtra = paymentMethod === 'contrassegno' ? 3 : 0;
    const totalWithExtra = (pricing.total || 0) + contrassegnoExtra;

    if (paymentMode === 'recipient') {
      senderPercent = 0;
      senderAmount = 0;
      recipientAmount = totalWithExtra;
    } else if (paymentMode === 'split') {
      senderPercent = sliderValue;
      senderAmount = (totalWithExtra * sliderValue) / 100;
      recipientAmount = totalWithExtra - senderAmount;
    }

    setPayment({
      mode: paymentMode,
      senderPercent,
      senderAmount,
      recipientAmount,
      paymentLink: paymentMode === 'recipient' ? paymentLink : '',
      method: paymentMethod,
      contrassegnoExtra,
    });
  }, [paymentMode, sliderValue, pricing.total, paymentMethod]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(paymentLink);
      setCopied(true);
      success('Link copiato negli appunti!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      error('Errore durante la copia');
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      success('Pagamento confermato!');
      onComplete();
    } catch (e) {
      error('Errore durante il pagamento');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalWithExtra = (pricing.total || 0) + (paymentMethod === 'contrassegno' ? 3 : 0);

  const paymentOptions = [
    { id: 'sender', label: 'Pago io (Mittente)', icon: User },
    { id: 'recipient', label: 'Paga il Destinatario', icon: MapPin },
    { id: 'split', label: 'Dividiamo', icon: Split },
  ];

  const methodOptions = [
    { id: 'card', label: 'Carta di Credito/Debito', icon: CreditCard },
    { id: 'contrassegno', label: 'Contrassegno', icon: Banknote, extra: 3 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-sky-600/20 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-sky-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Pagamento</h3>
          <p className="text-slate-400 text-sm">Scegli chi paga e il metodo</p>
        </div>
      </div>

      {/* Who Pays */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paymentOptions.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPaymentMode(option.id)}
            className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
              paymentMode === option.id
                ? 'border-sky-600 bg-sky-600/10'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
            }`}
          >
            <option.icon
              className={`w-8 h-8 ${
                paymentMode === option.id ? 'text-sky-600' : 'text-slate-600'
              }`}
            />
            <span className="font-medium text-white text-center text-sm">{option.label}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* SENDER PAYS */}
        {paymentMode === 'sender' && (
          <motion.div
            key="sender"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Payment Method Selection */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <h4 className="font-medium text-white mb-4">Metodo di pagamento</h4>
              <div className="space-y-3">
                {methodOptions.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
                      paymentMethod === method.id
                        ? 'border-sky-600 bg-sky-600/10'
                        : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? 'text-sky-600' : 'text-slate-500'}`} />
                      <span className="text-white">{method.label}</span>
                      {method.extra && (
                        <span className="text-xs text-amber-500 bg-amber-600/10 px-2 py-0.5 rounded">
                          +€{method.extra}
                        </span>
                      )}
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === method.id ? 'border-sky-600 bg-sky-600' : 'border-slate-600'
                    }`}>
                      {paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Form */}
            {paymentMethod === 'card' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400 text-sm">Dati carta protetti</span>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Numero carta</label>
                  <input
                    type="text"
                    value={cardData.number}
                    onChange={(e) => handleCardChange('number', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-600 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Scadenza</label>
                    <input
                      type="text"
                      value={cardData.expiry}
                      onChange={(e) => handleCardChange('expiry', e.target.value)}
                      placeholder="MM/AA"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">CVV</label>
                    <input
                      type="text"
                      value={cardData.cvv}
                      onChange={(e) => handleCardChange('cvv', e.target.value)}
                      placeholder="123"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Nome intestatario</label>
                  <input
                    type="text"
                    value={cardData.name}
                    onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Mario Rossi"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-600"
                  />
                </div>
              </motion.div>
            )}

            {/* Contrassegno Note */}
            {paymentMethod === 'contrassegno' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-amber-600/10 border border-amber-600/30 rounded-xl p-5"
              >
                <div className="flex items-start gap-3">
                  <Banknote className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Pagamento alla consegna</p>
                    <p className="text-slate-400 text-sm mt-1">
                      Il corriere ritirerà il pagamento in contanti alla consegna.
                      Preparare l'importo esatto.
                    </p>
                    <p className="text-amber-500 text-sm mt-2">
                      Costo aggiuntivo: +€3.00 per gestione contrassegno
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl flex justify-between items-center">
              <span className="text-white font-medium">Totale da pagare</span>
              <span className="text-sky-600 font-bold text-2xl">{formatPrice(totalWithExtra)}</span>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing || (paymentMethod === 'card' && (!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name))}
              className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Pagamento in corso...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Paga {formatPrice(totalWithExtra)}
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* RECIPIENT PAYS */}
        {paymentMode === 'recipient' && (
          <motion.div
            key="recipient"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-600/20 flex items-center justify-center">
                <Truck className="w-8 h-8 text-amber-600" />
              </div>
              <p className="text-slate-400 mb-2">Il destinatario pagherà alla consegna</p>
              <p className="text-3xl font-bold text-white">{formatPrice(totalWithExtra)}</p>
              {paymentMethod === 'contrassegno' && (
                <p className="text-amber-500 text-sm mt-2">Include €3.00 per contrassegno</p>
              )}
            </div>

            {/* Payment Link */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Link2 className="w-5 h-5 text-sky-600" />
                <span className="font-medium text-white">Link di pagamento</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={paymentLink}
                  readOnly
                  className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-sky-400 font-mono text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
                    copied ? 'bg-green-600' : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              {/* QR Code Placeholder */}
              <div className="mt-4 p-8 bg-white rounded-xl">
                <div className="w-32 h-32 mx-auto bg-slate-100 rounded-lg flex items-center justify-center border-4 border-slate-200">
                  <QrCode className="w-20 h-20 text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm text-center mt-3">
                  Scannerizza il QR code per pagare
                </p>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generazione...
                </>
              ) : (
                <>
                  Conferma e genera link
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* SPLIT */}
        {paymentMode === 'split' && (
          <motion.div
            key="split"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-300">Percentuale Mittente</span>
                <span className="text-2xl font-bold text-sky-600">{sliderValue}%</span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />

              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>0% Mittente</span>
                <span>50% ciascuno</span>
                <span>100% Mittente</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-4 bg-emerald-600/10 border border-emerald-600/30 rounded-xl text-center">
                  <div className="w-10 h-10 mx-auto rounded-full bg-emerald-600/20 flex items-center justify-center mb-3">
                    <User className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-slate-400 text-sm">Mittente paga</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {formatPrice((totalWithExtra * sliderValue) / 100)}
                  </p>
                  <p className="text-emerald-600 text-sm">{sliderValue}%</p>
                </div>
                <div className="p-4 bg-amber-600/10 border border-amber-600/30 rounded-xl text-center">
                  <div className="w-10 h-10 mx-auto rounded-full bg-amber-600/20 flex items-center justify-center mb-3">
                    <MapPin className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="text-slate-400 text-sm">Destinatario paga</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {formatPrice((totalWithExtra * (100 - sliderValue)) / 100)}
                  </p>
                  <p className="text-amber-600 text-sm">{100 - sliderValue}%</p>
                </div>
              </div>

              {sliderValue < 100 && (
                <div className="mt-4 p-4 bg-slate-900/50 rounded-lg">
                  <p className="text-slate-400 text-sm mb-2">Link per il destinatario:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={paymentLink}
                      readOnly
                      className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sky-400 font-mono text-xs"
                    />
                    <button
                      onClick={handleCopyLink}
                      className={`px-3 py-2 rounded flex items-center gap-1 ${
                        copied ? 'bg-green-600' : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Conferma...
                </>
              ) : (
                <>
                  <Split className="w-5 h-5" />
                  Conferma e paga {formatPrice((totalWithExtra * sliderValue) / 100)}
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-4 mt-6">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onBack}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all"
        >
          Indietro
        </motion.button>
      </div>
    </div>
  );
};

export default PaymentSplit;
