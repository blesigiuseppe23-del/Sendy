import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Package, Truck, CreditCard, Gift, Settings } from 'lucide-react';

const faqData = [
  {
    id: 1,
    question: 'Come devo imballare il mio pacco?',
    answer: 'Imballa il tuo pacco in modo sicuro utilizzando scatole resistenti e materiale protettivo. Assicurati che non ci siano spazi vuoti e che il contenuto non possa muoversi. Utilizza nastro adesivo resistente per chiudere la scatola. Per oggetti fragili, avvolgili singolarmente con pluriball o carta da imballaggio. Ricorda che un buon imballaggio previene danni durante il trasporto.',
  },
  {
    id: 2,
    question: 'Quanto tempo ci vuole per la consegna?',
    answer: 'I tempi di consegna variano in base al corriere selezionato e alla destinazione. Le spedizioni nazionali vengono generalmente consegnate in 1-3 giorni lavorativi. DHL offre consegne express in 1-2 giorni, mentre GLS e BRT richiedono 2-3 giorni. Per le spedizioni internazionali, i tempi variano da 3 a 10 giorni lavorativi a seconda della destinazione.',
  },
  {
    id: 3,
    question: 'Quali sono i costi per i servizi accessori?',
    answer: 'Il Servizio Standard è incluso nel prezzo base e comprende tracking, notifica email e assistenza clienti. La Consegna al Piano costa €5 aggiuntivi. L\'Assicurazione Extra ha un costo minimo di €4 o il 2% del valore assicurato per merci di valore superiore. La Modalità Regalo è gratuita e include un biglietto personalizzato.',
  },
  {
    id: 4,
    question: 'Come funziona la Modalità Regalo?',
    answer: 'La Modalità Regalo ti permette di inviare una spedizione come sorpresa. Quando attivi questa opzione, i prezzi vengono nascosti dalla lettera di vettura e puoi includere un messaggio personalizzato fino a 200 caratteri. Il destinatario riceverà il pacco con un biglietto speciale, senza vedere i costi della spedizione. È perfetto per compleanni, anniversari e occasioni speciali.',
  },
  {
    id: 5,
    question: 'Cos\'è il Servizio Standard?',
    answer: 'Il Servizio Standard è incluso gratuitamente in ogni spedizione SENDY. Comprende: tracking in tempo reale tramite codice univoco, notifica email automatica con conferma di spedizione, notifica alla consegna, assistenza clienti via email e telefono, e garanzia di risarcimento per danni (entro i limiti previsti dal corriere). È la base per una spedizione sicura e tracciabile.',
  },
  {
    id: 6,
    question: 'Come funziona il pagamento diviso?',
    answer: 'Il pagamento diviso (Split Payment) ti permette di suddividere il costo della spedizione tra mittente e destinatario. Puoi scegliere tra tre opzioni: "Pago tutto io" (100% mittente), "Paga il destinatario" (100% destinatario con link di pagamento), oppure "Dividi il pagamento" con uno slider che ti permette di scegliere la percentuale desiderata. È ideale per ecommerce, resi o regali!',
  },
];

const FAQItem = ({ item, isOpen, onToggle }) => (
  <motion.div
    initial={false}
    className="border-b border-slate-700 last:border-b-0"
  >
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-5 hover:bg-slate-800/50 transition-colors text-left"
    >
      <span className="font-medium text-white pr-4">{item.question}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className="flex-shrink-0"
      >
        <ChevronDown className="w-5 h-5 text-slate-400" />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="px-5 pb-5 text-slate-300 leading-relaxed">
            {item.answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export const FAQ = () => {
  const [openItems, setOpenItems] = useState(new Set([]));

  const toggleItem = (id) => {
    const newSet = new Set(openItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setOpenItems(newSet);
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sky-600/20 flex items-center justify-center">
            <HelpCircle className="w-10 h-10 text-sky-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Domande frequenti
          </h1>
          <p className="text-slate-400 max-w-md mx-auto">
            Trova le risposte alle domande più comuni su spedizioni, costi e servizi.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden"
        >
          {faqData.map((item) => (
            <FAQItem
              key={item.id}
              item={item}
              isOpen={openItems.has(item.id)}
              onToggle={() => toggleItem(item.id)}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 bg-slate-800/50 border border-slate-700 rounded-2xl text-center"
        >
          <h3 className="text-white font-semibold mb-2">
            Non hai trovato la risposta?
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            Il nostro team di supporto è pronto ad aiutarti
          </p>
          <a
            href="mailto:support@sendy.it"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Contattaci
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
