import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, MapPin, Phone, Mail, MessageSquare, Building2, DoorOpen, Layers, FileText,
  Globe, Calendar, Clock, Navigation, ChevronDown, AlertCircle
} from 'lucide-react';
import { personSchema } from '../utils/validators';
import { useShipmentStore } from '../store/shipmentStore';
import { PickupPointsModal, DeliveryModeToggle } from './PickupPoints';

const InputField = ({ icon: Icon, label, register, name, errors, type = 'text', placeholder, optional = false }) => (
  <div className="space-y-1">
    <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
      {Icon && <Icon className="w-4 h-4 text-slate-500" />}
      {label} {!optional && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type}
      {...register(name)}
      placeholder={placeholder}
      className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-all ${
        errors[name] ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-sky-600'
      }`}
    />
    {errors[name] && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-400 text-xs"
      >
        {errors[name].message}
      </motion.p>
    )}
  </div>
);

const SelectField = ({ icon: Icon, label, value, onChange, options, placeholder }) => (
  <div className="space-y-1">
    <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
      {Icon && <Icon className="w-4 h-4 text-slate-500" />}
      {label} <span className="text-red-400">*</span>
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white appearance-none focus:outline-none focus:border-sky-600"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
    </div>
  </div>
);

export const ShipmentForm = ({ onComplete }) => {
  const {
    sender, recipient, setSender, setRecipient,
    shipmentType, setShipmentType,
    destinationCountry, setDestinationCountry,
    customsDescription, setCustomsDescription,
    declaredValue, setDeclaredValue,
    COUNTRIES, EXTRA_EU_COUNTRIES,
    pickupSchedule, setPickupSchedule,
  } = useShipmentStore();

  const [showPickupModal, setShowPickupModal] = useState(false);
  const [pickupTarget, setPickupTarget] = useState(null);

  const senderForm = useForm({
    resolver: zodResolver(personSchema),
    defaultValues: sender,
    mode: 'onChange',
  });

  const recipientForm = useForm({
    resolver: zodResolver(personSchema),
    defaultValues: recipient,
    mode: 'onChange',
  });

  useEffect(() => {
    const subscription = senderForm.watch((data) => {
      if (senderForm.formState.isValid) {
        setSender(data);
      }
    });
    return () => subscription.unsubscribe();
  }, [senderForm.watch, setSender]);

  useEffect(() => {
    const subscription = recipientForm.watch((data) => {
      if (recipientForm.formState.isValid) {
        setRecipient(data);
      }
    });
    return () => subscription.unsubscribe();
  }, [recipientForm.watch, setRecipient]);

  const isFormValid = senderForm.formState.isValid && recipientForm.formState.isValid;

  const handleSubmit = () => {
    if (isFormValid) {
      onComplete();
    }
  };

  const handleOpenPickupModal = (who) => {
    setPickupTarget(who);
    setShowPickupModal(true);
  };

  const handleSelectPickupPoint = (point) => {
    if (pickupTarget === 'sender') {
      setSender({ pickupPoint: point });
    } else {
      setRecipient({ pickupPoint: point });
    }
  };

  const handleDeliveryModeChange = (who, mode) => {
    if (who === 'sender') {
      setSender({ deliveryMode: mode, pickupPoint: null });
    } else {
      setRecipient({ deliveryMode: mode, pickupPoint: null });
    }
  };

  const isExtraEU = EXTRA_EU_COUNTRIES.includes(destinationCountry);

  // Available time slots
  const timeSlots = [
    { id: 'morning', label: 'Mattina 8:00 - 12:00' },
    { id: 'noon', label: 'Mezzogiorno 12:00 - 14:00' },
    { id: 'afternoon', label: 'Pomeriggio 14:00 - 18:00' },
    { id: 'evening', label: 'Sera 18:00 - 20:00' },
  ];

  // Generate dates for next 30 days (excluding Sundays)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0) { // Exclude Sunday
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-8">
      {/* Shipment Type Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3 p-1 bg-slate-800 rounded-xl"
      >
        <button
          onClick={() => setShipmentType('national')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
            shipmentType === 'national'
              ? 'bg-sky-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Spedizione Nazionale
        </button>
        <button
          onClick={() => setShipmentType('international')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
            shipmentType === 'international'
              ? 'bg-sky-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          Spedizione Internazionale
        </button>
      </motion.div>

      {/* International fields */}
      <AnimatePresence>
        {shipmentType === 'international' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-sky-600/10 border border-sky-600/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-sky-600" />
              <span className="font-medium text-white">Spedizione Internazionale</span>
            </div>
            <SelectField
              icon={Globe}
              label="Paese Destinazione"
              value={destinationCountry}
              onChange={setDestinationCountry}
              options={COUNTRIES}
              placeholder="Seleziona paese"
            />

            {isExtraEU && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 space-y-4"
              >
                <div className="p-3 bg-amber-600/10 border border-amber-600/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                    <p className="text-amber-500 text-sm">
                      Le spese doganali sono a carico del destinatario
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    Descrizione contenuto pacco *
                  </label>
                  <input
                    type="text"
                    value={customsDescription}
                    onChange={(e) => setCustomsDescription(e.target.value)}
                    placeholder="es: Abbigliamento, Elettronica, Libri..."
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Valore dichiarato (€) *
                  </label>
                  <input
                    type="number"
                    value={declaredValue}
                    onChange={(e) => setDeclaredValue(Number(e.target.value))}
                    placeholder="es: 150"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-600"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mittente */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-sky-600/20 flex items-center justify-center">
              <User className="w-5 h-5 text-sky-600" />
            </div>
            <h3 className="text-lg font-semibold text-white">Mittente</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Nome"
                name="nome"
                register={senderForm.register}
                errors={senderForm.formState.errors}
                placeholder="Mario"
              />
              <InputField
                label="Cognome"
                name="cognome"
                register={senderForm.register}
                errors={senderForm.formState.errors}
                placeholder="Rossi"
              />
            </div>
            <InputField
              icon={Phone}
              label="Telefono"
              name="telefono"
              type="tel"
              register={senderForm.register}
              errors={senderForm.formState.errors}
              placeholder="+39 333 1234567"
            />
            <InputField
              icon={Mail}
              label="Email"
              name="email"
              type="email"
              register={senderForm.register}
              errors={senderForm.formState.errors}
              placeholder="mario.rossi@email.it"
            />

            {/* Delivery Mode Toggle */}
            <DeliveryModeToggle
              who="sender"
              value={sender.deliveryMode}
              onChange={(mode) => handleDeliveryModeChange('sender', mode)}
            />

            {sender.deliveryMode === 'home' ? (
              <>
                <InputField
                  icon={MapPin}
                  label="Indirizzo"
                  name="indirizzo"
                  register={senderForm.register}
                  errors={senderForm.formState.errors}
                  placeholder="Via Roma 123"
                />
                <div className="grid grid-cols-3 gap-4">
                  <InputField
                    icon={DoorOpen}
                    label="Citofono"
                    name="citofono"
                    register={senderForm.register}
                    errors={senderForm.formState.errors}
                    optional
                    placeholder="A"
                  />
                  <InputField
                    icon={Building2}
                    label="Piano"
                    name="piano"
                    register={senderForm.register}
                    errors={senderForm.formState.errors}
                    optional
                    placeholder="2"
                  />
                  <InputField
                    icon={Layers}
                    label="Scala"
                    name="scala"
                    register={senderForm.register}
                    errors={senderForm.formState.errors}
                    optional
                    placeholder="A"
                  />
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <button
                  type="button"
                  onClick={() => handleOpenPickupModal('sender')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    sender.pickupPoint
                      ? 'border-sky-600 bg-sky-600/10'
                      : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                  }`}
                >
                  {sender.pickupPoint ? (
                    <div>
                      <div className="flex items-center gap-2 text-sky-600 font-medium">
                        <Navigation className="w-4 h-4" />
                        {sender.pickupPoint.nome}
                      </div>
                      <p className="text-slate-400 text-sm mt-1">{sender.pickupPoint.indirizzo}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Navigation className="w-4 h-4" />
                      Seleziona un punto di ritiro
                    </div>
                  )}
                </button>
              </motion.div>
            )}

            <InputField
              icon={MessageSquare}
              label="Note"
              name="note"
              register={senderForm.register}
              errors={senderForm.formState.errors}
              optional
              placeholder="Istruzioni per il corriere..."
            />
          </div>
        </motion.div>

        {/* Destinatario */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-white">Destinatario</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Nome"
                name="nome"
                register={recipientForm.register}
                errors={recipientForm.formState.errors}
                placeholder="Giuseppe"
              />
              <InputField
                label="Cognome"
                name="cognome"
                register={recipientForm.register}
                errors={recipientForm.formState.errors}
                placeholder="Verdi"
              />
            </div>
            <InputField
              icon={Phone}
              label="Telefono"
              name="telefono"
              type="tel"
              register={recipientForm.register}
              errors={recipientForm.formState.errors}
              placeholder="+39 333 9876543"
            />
            <InputField
              icon={Mail}
              label="Email"
              name="email"
              type="email"
              register={recipientForm.register}
              errors={recipientForm.formState.errors}
              placeholder="giuseppe.verdi@email.it"
            />

            {/* Delivery Mode Toggle */}
            <DeliveryModeToggle
              who="recipient"
              value={recipient.deliveryMode}
              onChange={(mode) => handleDeliveryModeChange('recipient', mode)}
            />

            {recipient.deliveryMode === 'home' ? (
              <>
                <InputField
                  icon={MapPin}
                  label="Indirizzo"
                  name="indirizzo"
                  register={recipientForm.register}
                  errors={recipientForm.formState.errors}
                  placeholder="Via Milano 456"
                />
                <div className="grid grid-cols-3 gap-4">
                  <InputField
                    icon={DoorOpen}
                    label="Citofono"
                    name="citofono"
                    register={recipientForm.register}
                    errors={recipientForm.formState.errors}
                    optional
                    placeholder="B"
                  />
                  <InputField
                    icon={Building2}
                    label="Piano"
                    name="piano"
                    register={recipientForm.register}
                    errors={recipientForm.formState.errors}
                    optional
                    placeholder="3"
                  />
                  <InputField
                    icon={Layers}
                    label="Scala"
                    name="scala"
                    register={recipientForm.register}
                    errors={recipientForm.formState.errors}
                    optional
                    placeholder="B"
                  />
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <button
                  type="button"
                  onClick={() => handleOpenPickupModal('recipient')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    recipient.pickupPoint
                      ? 'border-sky-600 bg-sky-600/10'
                      : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                  }`}
                >
                  {recipient.pickupPoint ? (
                    <div>
                      <div className="flex items-center gap-2 text-sky-600 font-medium">
                        <Navigation className="w-4 h-4" />
                        {recipient.pickupPoint.nome}
                      </div>
                      <p className="text-slate-400 text-sm mt-1">{recipient.pickupPoint.indirizzo}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Navigation className="w-4 h-4" />
                      Seleziona un punto di ritiro
                    </div>
                  )}
                </button>
              </motion.div>
            )}

            <InputField
              icon={MessageSquare}
              label="Note"
              name="note"
              register={recipientForm.register}
              errors={recipientForm.formState.errors}
              optional
              placeholder="Istruzioni per il corriere..."
            />
          </div>
        </motion.div>
      </div>

      {/* Scheduled Pickup Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-amber-600/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Programma il ritiro</h3>
            <p className="text-slate-400 text-sm">Scegli data e fascia oraria</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Seleziona una data
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {getAvailableDates().slice(0, 14).map((date) => (
                <button
                  key={date}
                  onClick={() => setPickupSchedule(date, pickupSchedule.timeSlot)}
                  className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 transition-all text-sm ${
                    pickupSchedule.date === date
                      ? 'border-sky-600 bg-sky-600/10 text-white'
                      : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {formatDate(date)}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Seleziona fascia oraria
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setPickupSchedule(pickupSchedule.date, slot.id)}
                  className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                    pickupSchedule.timeSlot === slot.id
                      ? 'border-sky-600 bg-sky-600/10 text-white'
                      : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span className="text-xs">{slot.label}</span>
                </button>
              ))}
            </div>
          </div>

          {pickupSchedule.date && pickupSchedule.timeSlot && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-sky-600/10 border border-sky-600/30 rounded-lg"
            >
              <p className="text-sky-600 text-sm">
                Il corriere arriverà nella fascia selezionata. Riceverai conferma via email.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={handleSubmit}
        disabled={!isFormValid}
        className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
          isFormValid
            ? 'bg-sky-600 hover:bg-sky-700 cursor-pointer'
            : 'bg-slate-700 cursor-not-allowed opacity-50'
        }`}
      >
        Continua
      </motion.button>

      {/* Pickup Points Modal */}
      <PickupPointsModal
        isOpen={showPickupModal}
        onClose={() => setShowPickupModal(false)}
        who={pickupTarget}
        onSelect={handleSelectPickupPoint}
      />
    </div>
  );
};

export default ShipmentForm;
