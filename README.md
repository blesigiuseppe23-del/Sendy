# SENDY - Spedisci come un Pro

Una piattaforma web professionale per la gestione delle spedizioni, costruita con React e tecnologie moderne.

![SENDY](https://img.shields.io/badge/SENDY-1.0.0-0284c7?style=for-the-badge&logo=package&logoColor=white)

## Caratteristiche

- **Confronto Corrieri**: DHL, GLS, BRT, SDA con tariffe e tempi di consegna in tempo reale
- **Calcolo Volumetrico**: Peso volumetrico calcolato automaticamente
- **Split Payment**: Divisione flessibile dei costi tra mittente e destinatario
- **Modalità Regalo**: Invia pacchi sorpresa con prezzi nascosti e biglietto personalizzato
- **Servizi Extra**: Consegna al piano, assicurazione supplementare
- **Tracking Real-time**: Monitoraggio spedizioni con timeline animata
- **Lettera di Vettura PDF**: Generazione automatica con supporto modalità regalo
- **Persistenza Locale**: Stato salvato in LocalStorage

## Stack Tecnologico

- **Frontend**: React 18.3 + TypeScript
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3
- **Animazioni**: Framer Motion 11
- **State Management**: Zustand 4 con persistenza
- **Form Handling**: React Hook Form + Zod
- **Routing**: React Router DOM 6
- **Icone**: Lucide React
- **PDF Generation**: pdf-lib

## Installazione

```bash
# Clona il repository
git clone <repository-url>

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

## Script Disponibili

```bash
npm run dev       # Avvia il server di sviluppo
npm run build     # Compila per la produzione
npm run preview   # Anteprima della build
npm run lint      # Esegue il linter
```

## Struttura del Progetto

```
src/
├── components/
│   ├── Navbar.jsx           # Navigazione principale
│   ├── Footer.jsx           # Footer del sito
│   ├── ShipmentForm.jsx     # Form mittente/destinatario
│   ├── PackageSection.jsx   # Dati pacco con calcolo volumetrico
│   ├── CarrierCard.jsx     # Selezione corriere
│   ├── ServicesSection.jsx # Servizi accessori
│   ├── PaymentSplit.jsx    # Opzioni split payment
│   ├── SummarySection.jsx  # Riepilogo ordine
│   ├── Toast.jsx           # Notifiche toast
│   └── Skeleton.jsx         # Loading skeletons
├── pages/
│   ├── Home.jsx            # Pagina principale
│   ├── Shipment.jsx         # Flusso spedizione (7 step)
│   ├── Checkout.jsx        # Riepilogo checkout
│   ├── Success.jsx         # Conferma ordine + PDF
│   ├── Tracking.jsx        # Tracciamento spedizione
│   └── FAQ.jsx            # Domande frequenti
├── services/
│   ├── carriers.js         # Dati corrieri
│   ├── pricing.js          # Calcolo prezzi
│   ├── tracking.js         # Generazione ID/tracking
│   └── pdf.js             # Generazione lettera vettura
├── store/
│   └── shipmentStore.js    # Stato globale Zustand
├── hooks/
│   ├── useToast.js         # Hook notifiche
│   └── useLocalStorage.js  # Hook persistenza
├── utils/
│   ├── validators.js       # Schema Zod validazione
│   └── formatters.js       # Formattazione dati
└── App.tsx                 # Router principale
```

## Flusso Utente (7 Step)

1. **Mittente & Destinatario**: Dati completi con validazione Zod
2. **Dati Pacco**: Pesi e dimensioni con calcolo volumetrico real-time
3. **Selezione Corriere**: Confronto tariffe con skeleton loading
4. **Servizi Accessori**: Standard, consegna al piano, assicurazione, regalo
5. **Riepilogo**: Conferma tutti i dati
6. **Pagamento**: Split payment con slider
7. **Conferma**: Generazione ordine con tracking

## Calcolo Prezzi

```
pesoVolumetrico = (L × W × H) / 5000
pesoDeterminante = max(pesoReale, pesoVolumetrico)
prezzoBase = (pesoVolumetrico × carrier.rate) + (pesoReale × 2.50)
totale = prezzoBase + extra
```

### Costi Extra

- Consegna al piano: +€5.00
- Assicurazione: +€4.00 (o 2% del valore, minimo €4)
- Modalità regalo: Gratis

## Modalità Regalo

Quando attiva:
- I prezzi vengono nascosti dal PDF
- Incluso biglietto personalizzato (max 200 caratteri)
- Footer speciale "Questo pacco è un regalo speciale"
- Messaggio d'auguri stampato sulla lettera di vettura

## API e Dati Mock

I dati sono attualmente simulati. Per integrazione reale:

```javascript
// Esempio integrazione API corrieri
const realPricing = await fetch('/api/carriers/pricing', {
  method: 'POST',
  body: JSON.stringify({ from, to, package })
});
```

## TODO Futuro

- [ ] Integrazione Stripe per pagamenti reali
- [ ] Backend Supabase per persistenza ordini
- [ ] API corrieri reali (DHL, GLS, BRT)
- [ ] Notifiche push per tracking
- [ ] Dashboard storico spedizioni
- [ ] Gestione resi
- [ ] Multi-tenancy per aziende
- [ ] Integrazione etichette adesive
- [ ] Pick-up scheduling
- [ ] Geo-localizzazione indirizzi

## Contribuire

1. Fork del repository
2. Crea un branch (`git checkout -b feature/nuova-funzionalita`)
3. Commit delle modifiche (`git commit -m 'Aggiunta nuova funzionalita'`)
4. Push al branch (`git push origin feature/nuova-funzionalita`)
5. Apri una Pull Request

## Licenza

MIT License - vedi [LICENSE](LICENSE) per dettagli.

## Contatti

- Email: support@sendy.it
- Telefono: +39 02 1234567
- Sito: www.sendy.it

---

Creato con React + Vite + Tailwind CSS
