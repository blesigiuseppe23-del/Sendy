import { getCarrierRate } from './carriers';

export const calculatePrice = (packageData, carrier, services = {}) => {
  const { weight, length, width, height } = packageData;
  const { floorDelivery = false, insurance = false, insuredValue = 0 } = services;

  const volumetricWeight = (length * width * height) / 5000;
  const finalWeight = Math.max(weight, volumetricWeight);
  const carrierRate = typeof carrier === 'string' ? getCarrierRate(carrier) : carrier?.rate || 3.0;

  let basePrice = (volumetricWeight * carrierRate) + (weight * 2.50);
  basePrice = Math.max(basePrice, 6.50);

  const extras = [];
  let extrasTotal = 0;

  if (floorDelivery) {
    const floorCost = 5;
    extras.push({ name: 'Consegna al piano', cost: floorCost });
    extrasTotal += floorCost;
  }

  if (insurance && insuredValue > 0) {
    const insuranceCost = Math.max(4, insuredValue * 0.02);
    extras.push({ name: 'Assicurazione', cost: insuranceCost });
    extrasTotal += insuranceCost;
  }

  const total = basePrice + extrasTotal;

  return {
    base: Number(basePrice.toFixed(2)),
    extras: Number(extrasTotal.toFixed(2)),
    extrasList: extras,
    total: Number(total.toFixed(2)),
    volumetricWeight: Number(volumetricWeight.toFixed(2)),
    finalWeight: Number(finalWeight.toFixed(2)),
  };
};

export const calculateSplitPayment = (total, mode, senderPercent = 100) => {
  if (mode === 'sender') {
    return {
      senderAmount: total,
      recipientAmount: 0,
      senderPercent: 100,
    };
  }

  if (mode === 'recipient') {
    return {
      senderAmount: 0,
      recipientAmount: total,
      senderPercent: 0,
    };
  }

  const senderAmount = (total * senderPercent) / 100;
  const recipientAmount = total - senderAmount;

  return {
    senderAmount: Number(senderAmount.toFixed(2)),
    recipientAmount: Number(recipientAmount.toFixed(2)),
    senderPercent,
  };
};

export default calculatePrice;
