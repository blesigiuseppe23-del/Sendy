import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Minimize2 } from 'lucide-react';
import { useShipmentStore } from '../store/shipmentStore';
import { useToast } from '../hooks/useToast';

const quickReplies = [
  { id: 'tracking', label: 'Traccia spedizione' },
  { id: 'prezzi', label: 'Prezzi e corrieri' },
  { id: 'problema', label: 'Problema con ordine' },
  { id: 'fedeltà', label: 'Programma fedeltà' },
];

const getBotResponse = (message, userName) => {
  const lower = message.toLowerCase();

  if (lower.includes('tracc') || lower.includes('dove') || lower.includes('tracking')) {
    return `Puoi tracciare nella sezione Tracking con il codice SDY-XXXXXXXX. Vai alla pagina Tracking per inserire il tuo codice!`;
  }
  if (lower.includes('prezz') || lower.includes('cost') || lower.includes('quanto')) {
    return `I prezzi dipendono da peso, dimensioni e corriere. Usa il comparatore nella Home per confrontare le offerte!`;
  }
  if (lower.includes('corrier') || lower.includes('dhl') || lower.includes('gls') || lower.includes('brt')) {
    return `Lavoriamo con DHL, GLS, BRT per spedizioni nazionali e DHL Express, FedEx, UPS per quelle internazionali. Ognuno con tariffe competitive!`;
  }
  if (lower.includes('pag') || lower.includes('cart') || lower.includes('divid')) {
    return `Accettiamo carte di credito/debito e contrassegno. Puoi anche dividere il pagamento con il destinatario! 🎉`;
  }
  if (lower.includes('rimbor') || lower.includes('problema') || lower.includes('dann') || lower.includes('perso')) {
    return `Mi dispiace! 😔 Ogni spedizione èassicurata fino a 49€ gratis. Se il problema persiste, apriamo una segnalazione per aiutarti!`;
  }
  if (lower.includes('regal') || lower.includes('gift')) {
    return `La modalità regalo nasconde i prezzi nel PDF e aggiunge un messaggio personalizzato! Perfetto per sorprese 🎁`;
  }
  if (lower.includes('punt') || lower.includes('fedelt') || lower.includes('scont')) {
    return `Guadagni punti ad ogni spedizione! Vai nella sezione Fedeltà per vedere i tuoi premi disponibili. Sei ${userName || 'utente'}!`;
  }
  if (lower.includes('ritir') || lower.includes('quand') || lower.includes('orar')) {
    return `Puoi programmare data e fascia oraria del ritiro durante la spedizione. Scegli tra mattina, pomeriggio o sera!`;
  }

  return `Grazie per il messaggio! Un operatore risponderà entro pochi minuti. Nel frattempo consulta le FAQ o usa le opzioni velocie sopra! 💬`;
};

export const SupportChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useShipmentStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([{
          id: 'welcome',
          sender: 'bot',
          text: `Ciao ${user.nome || 'utente'}! 👋 Sono l'assistente di Sendy. Come posso aiutarti?`,
          timestamp: new Date().toISOString()
        }]);
      }, 1000);
    }
  }, [isOpen, user.nome]);

  const handleSend = async (text = message) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 1500));

    const botResponse = getBotResponse(text, user.nome);
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      sender: 'bot',
      text: botResponse,
      timestamp: new Date().toISOString()
    }]);
    setIsTyping(false);
  };

  const handleQuickReply = (reply) => {
    handleSend(reply.label);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-sky-600 hover:bg-sky-700 shadow-lg shadow-sky-600/30 flex items-center justify-center transition-all z-40 ${
          isOpen ? 'hidden' : ''
        }`}
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] bg-slate-800 rounded-2xl shadow-xl border border-slate-700 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
                </div>
                <div>
                  <p className="font-semibold text-white">Supporto Sendy</p>
                  <p className="text-xs text-green-400">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-700 rounded-lg">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-sky-600 text-white rounded-br-md'
                        : 'bg-slate-700 text-slate-100 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </motion.div>
              ))}

              {/* Quick Replies - show when not typing and after bot message */}
              {!isTyping && messages.length > 0 && messages[messages.length - 1].sender === 'bot' && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply.id}
                      onClick={() => handleQuickReply(reply)}
                      className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-full transition-colors"
                    >
                      {reply.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-700 px-4 py-2 rounded-2xl rounded-bl-md flex items-center gap-1">
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 bg-slate-400 rounded-full"
                    />
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-slate-400 rounded-full"
                    />
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-slate-400 rounded-full"
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Scrivi un messaggio..."
                  className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-sky-600 text-sm"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!message.trim() || isTyping}
                  className="w-10 h-10 rounded-lg bg-sky-600 hover:bg-sky-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SupportChatWidget;
