import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const PICKUP_POINTS = [
  { id: 1, nome: "Tabaccheria Roma Centro", indirizzo: "Via del Corso 12, Roma", orari: "Lun-Sab 8:00-20:00", distanza: "0.3 km" },
  { id: 2, nome: "Edicola Termini", indirizzo: "Piazza dei Cinquecento 5, Roma", orari: "Lun-Dom 6:00-22:00", distanza: "0.8 km" },
  { id: 3, nome: "Farmacia Centrale", indirizzo: "Via Nazionale 45, Roma", orari: "Lun-Ven 9:00-19:00", distanza: "1.2 km" },
  { id: 4, nome: "Supermercato Conad", indirizzo: "Via Tuscolana 88, Roma", orari: "Lun-Dom 8:00-21:00", distanza: "1.5 km" },
  { id: 5, nome: "Bar Sport", indirizzo: "Via Appia 200, Roma", orari: "Lun-Sab 7:00-19:00", distanza: "2.1 km" }
];

const COUNTRIES = [
  "Italia", "Francia", "Germania", "Spagna", "Regno Unito",
  "Portogallo", "Olanda", "Belgio", "Austria", "Svizzera",
  "Polonia", "Romania", "Grecia", "Repubblica Ceca", "Ungheria",
  "Svezia", "Norvegia", "Danimarca", "Finlandia", "Irlanda",
  "USA", "Canada", "Australia", "Giappone", "Cina"
];

const EXTRA_EU_COUNTRIES = ["USA", "Canada", "Australia", "Giappone", "Cina"];

const LOYALTY_LEVELS = [
  { name: "Bronzo", min: 0, max: 999, color: "#CD7F32", perks: ["5% sconto"] },
  { name: "Argento", min: 1000, max: 4999, color: "#C0C0C0", perks: ["10% sconto", "Priorità supporto"] },
  { name: "Oro", min: 5000, max: 9999, color: "#FFD700", perks: ["15% sconto", "Ritiro prioritario", "Assicurazione estesa gratis"] },
  { name: "Platino", min: 10000, max: 999999, color: "#E5E4E2", perks: ["20% sconto", "Corriere dedicato", "Supporto 24/7", "Express gratis 1/mese"] }
];

const initialState = {
  // Auth state
  isLoggedIn: false,
  user: {
    nome: '',
    cognome: '',
    email: '',
  },

  // Shipment type
  shipmentType: 'national', // 'national' or 'international'
  destinationCountry: 'Italia',
  customsDescription: '',
  declaredValue: 0,

  // Shipment state
  currentStep: 1,
  sender: {
    nome: '',
    cognome: '',
    telefono: '',
    email: '',
    indirizzo: '',
    citofono: '',
    piano: '',
    scala: '',
    note: '',
    paese: 'Italia',
    deliveryMode: 'home', // 'home' or 'pickup'
    pickupPoint: null,
  },
  recipient: {
    nome: '',
    cognome: '',
    telefono: '',
    email: '',
    indirizzo: '',
    citofono: '',
    piano: '',
    scala: '',
    note: '',
    paese: 'Italia',
    deliveryMode: 'home', // 'home' or 'pickup'
    pickupPoint: null,
  },
  package: {
    peso: 0,
    lunghezza: 0,
    larghezza: 0,
    altezza: 0,
    pesoVolumetrico: 0,
    pesoDeterminante: 0,
    measuredByAI: false,
    aiConfidence: 0,
  },
  selectedCarrier: null,
  services: {
    standard: true,
    floorDelivery: false,
    insurance: {
      basic: true, // Always true - free up to 49€
      extended: false,
      value: 0,
    },
    giftMode: false,
    giftMessage: '',
  },
  pricing: {
    base: 0,
    floorDelivery: 0,
    insurance: 0,
    fuelSurcharge: 0,
    total: 0,
  },
  payment: {
    mode: 'sender',
    senderAmount: 0,
    recipientAmount: 0,
    senderPercent: 100,
    paymentLink: '',
    method: 'card',
    contrassegnoExtra: 0,
  },
  order: {
    id: '',
    tracking: '',
    createdAt: null,
  },

  // Scheduled pickup
  pickupSchedule: {
    date: '',
    timeSlot: '',
  },

  // Loyalty
  loyalty: {
    points: 1250,
    totalShipments: 8,
    savedAmount: 24.50,
    referrals: 2,
    history: [
      { date: "13/06/2026", desc: "Spedizione SDY-A1B2C3D4", points: +180 },
      { date: "12/06/2026", desc: "Bonus prima spedizione", points: +200 },
      { date: "11/06/2026", desc: "Invito amico", points: +500 },
      { date: "10/06/2026", desc: "Riscatto sconto 5%", points: -500 },
      { date: "08/06/2026", desc: "Spedizione SDY-E5F6G7H8", points: +120 }
    ],
  },

  // Chat
  chat: {
    isOpen: false,
    messages: [],
    unreadCount: 0,
  },

  // Recent shipments
  recentShipments: [],
};

export const useShipmentStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Constants
      PICKUP_POINTS,
      COUNTRIES,
      EXTRA_EU_COUNTRIES,
      LOYALTY_LEVELS,

      // Auth actions
      setUser: (user) => set({ user: { ...get().user, ...user } }),
      setLoggedIn: (status) => set({ isLoggedIn: status }),
      login: (userData) => set({
        isLoggedIn: true,
        user: { ...userData },
        recentShipments: [
          { id: 'SDY-ABC12345', tracking: 'SDY-ABC12345', carrier: 'DHL', status: 'Consegnato', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
          { id: 'SDY-DEF67890', tracking: 'SDY-DEF67890', carrier: 'GLS', status: 'In transito', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
          { id: 'SDY-GHI11223', tracking: 'SDY-GHI11223', carrier: 'BRT', status: 'In lavorazione', date: new Date().toISOString() },
        ]
      }),
      logout: () => set({
        isLoggedIn: false,
        user: { nome: '', cognome: '', email: '' },
        recentShipments: []
      }),

      // Shipment type actions
      setShipmentType: (type) => set({ shipmentType: type }),
      setDestinationCountry: (country) => set({ destinationCountry: country }),
      setCustomsDescription: (desc) => set({ customsDescription: desc }),
      setDeclaredValue: (value) => set({ declaredValue: value }),

      // Shipment actions
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 9) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

      setSender: (senderData) => set({ sender: { ...get().sender, ...senderData } }),
      setRecipient: (recipientData) => set({ recipient: { ...get().recipient, ...recipientData } }),
      setPackage: (packageData) => set({ package: { ...get().package, ...packageData } }),
      setSelectedCarrier: (carrier) => set({ selectedCarrier: carrier }),
      setServices: (servicesData) => set({ services: { ...get().services, ...servicesData } }),
      setInsurance: (insuranceData) => set({ services: { ...get().services, insurance: { ...get().services.insurance, ...insuranceData } } }),
      setPricing: (pricingData) => set({ pricing: { ...get().pricing, ...pricingData } }),
      setPayment: (paymentData) => set({ payment: { ...get().payment, ...paymentData } }),
      setOrder: (orderData) => set({ order: { ...get().order, ...orderData } }),

      // Pickup point actions
      setPickupPoint: (who, point) => set({
        [who]: { ...get()[who], pickupPoint: point }
      }),
      setDeliveryMode: (who, mode) => set({
        [who]: { ...get()[who], deliveryMode: mode }
      }),

      // Scheduled pickup actions
      setPickupSchedule: (date, timeSlot) => set({
        pickupSchedule: { date, timeSlot }
      }),

      // Loyalty actions
      addPoints: (amount) => set((state) => ({
        loyalty: {
          ...state.loyalty,
          points: state.loyalty.points + amount,
          history: [
            { date: new Date().toLocaleDateString('it-IT'), desc: `Spedizione ${state.order.id || 'completata'}`, points: +amount },
            ...state.loyalty.history
          ]
        }
      })),
      redeemPoints: (amount) => set((state) => ({
        loyalty: {
          ...state.loyalty,
          points: state.loyalty.points - amount,
          history: [
            { date: new Date().toLocaleDateString('it-IT'), desc: 'Riscatto premio', points: -amount },
            ...state.loyalty.history
          ]
        }
      })),
      getLoyaltyLevel: () => {
        const points = get().loyalty.points;
        for (let i = LOYALTY_LEVELS.length - 1; i >= 0; i--) {
          if (points >= LOYALTY_LEVELS[i].min) return LOYALTY_LEVELS[i];
        }
        return LOYALTY_LEVELS[0];
      },
      getNextLevel: () => {
        const points = get().loyalty.points;
        for (const level of LOYALTY_LEVELS) {
          if (points < level.min) return level;
        }
        return null;
      },

      // Chat actions
      openChat: () => set({ chat: { ...get().chat, isOpen: true } }),
      closeChat: () => set({ chat: { ...get().chat, isOpen: false } }),
      addChatMessage: (message) => set((state) => ({
        chat: {
          ...state.chat,
          messages: [...state.chat.messages, { ...message, id: Date.now(), timestamp: new Date().toISOString() }],
          unreadCount: message.sender === 'bot' ? state.chat.unreadCount + 1 : state.chat.unreadCount
        }
      })),
      clearUnread: () => set({ chat: { ...get().chat, unreadCount: 0 } }),

      addRecentShipment: (shipment) => set((state) => ({
        recentShipments: [shipment, ...state.recentShipments].slice(0, 10)
      })),

      resetAll: () => set({
        currentStep: 1,
        sender: initialState.sender,
        recipient: initialState.recipient,
        package: initialState.package,
        selectedCarrier: null,
        services: initialState.services,
        pricing: initialState.pricing,
        payment: initialState.payment,
        order: initialState.order,
        shipmentType: 'national',
        destinationCountry: 'Italia',
        customsDescription: '',
        declaredValue: 0,
        pickupSchedule: initialState.pickupSchedule,
      }),
    }),
    {
      name: 'sendy-shipment-storage',
      version: 4,
    }
  )
);

export const getStepTitle = (step) => {
  const titles = {
    1: 'Mittente & Destinatario',
    2: 'Dati Pacco',
    3: 'Seleziona Corriere',
    4: 'Servizi Accessori',
    5: 'Riepilogo',
    6: 'Pagamento',
    7: 'Conferma',
    8: 'Successo',
    9: 'Completato',
  };
  return titles[step] || '';
};

export default useShipmentStore;
