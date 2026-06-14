import { z } from 'zod';

const phoneRegex = /^(\+39)?[\s]?[0-9]{6,}$/;

export const personSchema = z.object({
  nome: z.string()
    .min(2, 'Il nome deve avere almeno 2 caratteri')
    .max(50, 'Il nome non può superare 50 caratteri'),
  cognome: z.string()
    .min(2, 'Il cognome deve avere almeno 2 caratteri')
    .max(50, 'Il cognome non può superare 50 caratteri'),
  telefono: z.string()
    .regex(phoneRegex, 'Il telefono deve essere un numero italiano valido'),
  email: z.string()
    .email('Inserisci un\'email valida'),
  indirizzo: z.string()
    .min(5, 'L\'indirizzo deve avere almeno 5 caratteri'),
  citofono: z.string().optional(),
  piano: z.string().optional(),
  scala: z.string().optional(),
  note: z.string().optional(),
});

export const packageSchema = z.object({
  peso: z.number()
    .min(0.1, 'Il peso minimo è 0.1 kg')
    .max(100, 'Il peso massimo è 100 kg'),
  lunghezza: z.number()
    .min(1, 'La lunghezza minima è 1 cm')
    .max(300, 'La lunghezza massima è 300 cm'),
  larghezza: z.number()
    .min(1, 'La larghezza minima è 1 cm')
    .max(300, 'La larghezza massima è 300 cm'),
  altezza: z.number()
    .min(1, 'L\'altezza minima è 1 cm')
    .max(300, 'L\'altezza massima è 300 cm'),
});

export const insuranceValueSchema = z.number()
  .min(1, 'Il valore minimo assicurato è €1')
  .max(10000, 'Il valore massimo assicurato è €10.000');

export const giftMessageSchema = z.string()
  .max(200, 'Il messaggio non può superare 200 caratteri');

export const validatePerson = (data) => {
  return personSchema.safeParse(data);
};

export const validatePackage = (data) => {
  return packageSchema.safeParse(data);
};

export default {
  personSchema,
  packageSchema,
  insuranceValueSchema,
  giftMessageSchema,
};
