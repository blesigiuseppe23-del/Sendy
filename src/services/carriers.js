export const CARRIERS = [
  {
    id: 'dhl',
    name: 'DHL',
    rate: 3.2,
    delivery: '1-2 giorni',
    color: '#FFCC00',
    textColor: '#000000',
    logo: 'DHL',
    description: 'Spedizioni express internazionali',
    features: ['Tracking realtime', 'Assicurazione inclusa fino a 100€', 'Consegna in giornata disponibile'],
  },
  {
    id: 'gls',
    name: 'GLS',
    rate: 2.9,
    delivery: '2-3 giorni',
    color: '#FF6600',
    textColor: '#FFFFFF',
    logo: 'GLS',
    description: 'Corriere espresso nazionale ed europeo',
    features: ['Rete capillare in Italia', 'Punti di ritiro', 'Notifica SMS'],
  },
  {
    id: 'brt',
    name: 'BRT',
    rate: 3.0,
    delivery: '1-3 giorni',
    color: '#CC0000',
    textColor: '#FFFFFF',
    logo: 'BRT',
    description: 'Bartolini - leader logistico italiano',
    features: ['Consegna programmata', 'Reso facilitato', 'Codice promo disponibile'],
  },
  {
    id: 'sdap',
    name: 'SDA',
    rate: 2.5,
    delivery: '1-2 giorni',
    color: '#0066CC',
    textColor: '#FFFFFF',
    logo: 'SDA',
    description: 'Poste Italiane - Spedizioni nazionali',
    features: ['Ritiro in ufficio postale', 'Contratto conveniente', 'Certificazione digitale'],
  },
];

export const getCarrierById = (id) => {
  return CARRIERS.find((carrier) => carrier.id === id);
};

export const getCarrierRate = (id) => {
  const carrier = getCarrierById(id);
  return carrier ? carrier.rate : 0;
};

export const getCarrierDelivery = (id) => {
  const carrier = getCarrierById(id);
  return carrier ? carrier.delivery : '';
};

export default CARRIERS;
