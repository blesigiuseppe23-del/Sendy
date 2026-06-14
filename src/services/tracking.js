const generateRandomString = (length) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateOrderId = () => {
  return `SDY-${generateRandomString(8)}`;
};

export const generateTracking = () => {
  return `SDY-${generateRandomString(10)}`;
};

export const getMockTrackingStatus = (trackingCode) => {
  const now = new Date();
  const timeline = [
    {
      status: 'Ordine creato',
      description: 'La tua spedizione è stata registrata',
      date: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      completed: true,
      icon: 'package',
    },
    {
      status: 'In ritiro',
      description: 'Il corriere sta ritirando il pacco',
      date: new Date(now - 90 * 60 * 1000).toISOString(),
      completed: true,
      icon: 'truck',
    },
    {
      status: 'In transito',
      description: 'Il pacco è in viaggio verso la destinazione',
      date: new Date(now - 30 * 60 * 1000).toISOString(),
      completed: Math.random() > 0.5,
      icon: 'map',
    },
    {
      status: 'In consegna',
      description: 'Il pacco sarà consegnato oggi',
      date: null,
      completed: false,
      icon: 'home',
    },
    {
      status: 'Consegnato',
      description: 'Il pacco è stato consegnato',
      date: null,
      completed: false,
      icon: 'check',
    },
  ];

  return {
    trackingCode,
    carrier: 'DHL',
    estimatedDelivery: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    timeline,
    status: 'In transito',
  };
};

export const trackShipment = async (trackingCode) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return getMockTrackingStatus(trackingCode);
};

export default { generateOrderId, generateTracking, getMockTrackingStatus, trackShipment };
