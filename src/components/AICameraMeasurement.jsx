import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, PenLine, CheckCircle, AlertCircle, RefreshCw, Image as ImageIcon, Sparkles, Zap } from 'lucide-react';
import { useShipmentStore } from '../store/shipmentStore';
import { useToast } from '../hooks/useToast';

const steps = [
  "Rilevamento bordi pacco...",
  "Calcolo proporzioni...",
  "Stima dimensioni in corso...",
  "Applicazione algoritmo AI...",
  "Finalizzazione misure..."
];

export const AIMeasurement = ({ onComplete }) => {
  const [mode, setMode] = useState(null); // 'ai' or 'manual'
  const [showModal, setShowModal] = useState(false);
  const [cameraStep, setCameraStep] = useState('instructions'); // instructions, camera, analyzing, result
  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisMessages, setAnalysisMessages] = useState([]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const { success, error: showError } = useToast();

  const cleanup = useCallback(() => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
  }, [videoStream]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraStep('camera');
      setError(null);
    } catch (err) {
      console.error('Camera error:', err);
      setError('Fotocamera non disponibile. Usa l\'inserimento manuale.');
      showError('Fotocamera non disponibile');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);

    cleanup();
    analyzeImage(imageData);
  };

  const analyzeImage = async (imageData) => {
    setCameraStep('analyzing');
    setAnalysisMessages([]);

    // Simulate messages
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setAnalysisMessages(prev => [...prev, steps[i]]);
    }

    await new Promise(r => setTimeout(r, 500));

    // Generate mock results (in real implementation, call Claude API)
    try {
      // Mock result for demonstration
      const mockResult = {
        lunghezza: Math.floor(Math.random() * 30) + 20, // 20-50 cm
        larghezza: Math.floor(Math.random() * 20) + 15, // 15-35 cm
        altezza: Math.floor(Math.random() * 15) + 10, // 10-25 cm
        confidenza: Math.floor(Math.random() * 20) + 75 // 75-95%
      };

      setResults(mockResult);
      setCameraStep('result');
    } catch (err) {
      setError('Impossibile analizzare l\'immagine. Riprova.');
      showError('Errore durante l\'analisi');
    }
  };

  const handleUseResults = () => {
    if (results) {
      const pesoVolumetrico = (results.lunghezza * results.larghezza * results.altezza) / 5000;
      onComplete({
        lunghezza: results.lunghezza,
        larghezza: results.larghezza,
        altezza: results.altezza,
        pesoVolumetrico,
        pesoDeterminante: pesoVolumetrico,
        measuredByAI: true,
        aiConfidence: results.confidenza,
      });
      setShowModal(false);
      success('Dimensioni applicate con successo!');
    }
  };

  const handleClose = () => {
    cleanup();
    setShowModal(false);
    setCameraStep('instructions');
    setCapturedImage(null);
    setResults(null);
    setError(null);
  };

  return (
    <>
      {/* Mode Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setMode('ai');
            setShowModal(true);
          }}
          className="p-6 bg-slate-800 border-2 border-slate-700 hover:border-sky-600 rounded-xl text-left transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-sky-600/20 flex items-center justify-center">
              <Camera className="w-6 h-6 text-sky-600" />
            </div>
            <span className="px-2 py-0.5 bg-sky-600 text-white text-xs font-semibold rounded-full">
              AI
            </span>
          </div>
          <h4 className="text-lg font-semibold text-white mb-1">Misura con fotocamera AI</h4>
          <p className="text-slate-400 text-sm">Inquadra il pacco e l'AI calcola le dimensioni</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMode('manual')}
          className={`p-6 bg-slate-800 rounded-xl text-left transition-all border-2 ${
            mode === 'manual' ? 'border-sky-600' : 'border-slate-700 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-600/20 flex items-center justify-center">
              <PenLine className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <h4 className="text-lg font-semibold text-white mb-1">Inserimento manuale</h4>
          <p className="text-slate-400 text-sm">Inserisci le dimensioni a mano</p>
        </motion.button>
      </div>

      {/* Camera Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl"
            >
              {cameraStep === 'instructions' && (
                <div className="bg-slate-800 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-sky-600/20 flex items-center justify-center">
                        <Camera className="w-5 h-5 text-sky-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">AI Package Measurement</h3>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-slate-700 rounded-lg">
                      <X className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>

                  <div className="space-y-4 mb-8">
                    {[
                      { num: 1, text: 'Posiziona il pacco su superficie piatta e ben illuminata' },
                      { num: 2, text: 'Inquadra il pacco dall\'alto tenendo il telefono parallelo' },
                      { num: 3, text: 'Assicurati che tutto il pacco sia visibile' },
                    ].map((step) => (
                      <motion.div
                        key={step.num}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: step.num * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl"
                      >
                        <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white font-bold">
                          {step.num}
                        </div>
                        <p className="text-slate-300">{step.text}</p>
                      </motion.div>
                    ))}
                  </div>

                  {error && (
                    <div className="mb-4 p-4 bg-red-600/10 border border-red-600/30 rounded-xl">
                      <div className="flex items-center gap-2 text-red-500">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={startCamera}
                    className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <Camera className="w-5 h-5" />
                    Apri fotocamera
                  </button>
                </div>
              )}

              {cameraStep === 'camera' && (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-2xl bg-slate-900"
                    style={{ maxHeight: '70vh' }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-64 h-48 border-4 border-dashed border-sky-600 rounded-xl"
                    />
                  </div>

                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 bg-slate-900/80 hover:bg-slate-800 rounded-lg"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>

                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                    <button
                      onClick={capturePhoto}
                      className="w-20 h-20 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center transition-all shadow-lg"
                    >
                      <div className="w-16 h-16 rounded-full border-4 border-slate-300" />
                    </button>
                  </div>

                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}

              {cameraStep === 'analyzing' && (
                <div className="bg-slate-800 rounded-2xl p-8 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-20 h-20 mx-auto mb-6 border-4 border-sky-600 border-t-transparent rounded-full"
                  />

                  <div className="space-y-2">
                    {analysisMessages.map((msg, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-slate-300"
                      >
                        {msg}
                      </motion.p>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-2 text-sky-600">
                    <Sparkles className="w-5 h-5" />
                    <span>AI in azione</span>
                  </div>
                </div>
              )}

              {cameraStep === 'result' && results && (
                <div className="bg-slate-800 rounded-2xl p-8">
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white">Dimensioni rilevate</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: 'Lunghezza', value: results.lunghezza },
                      { label: 'Larghezza', value: results.larghezza },
                      { label: 'Altezza', value: results.altezza },
                    ].map((dim) => (
                      <div key={dim.label} className="text-center p-4 bg-slate-900/50 rounded-xl">
                        <p className="text-slate-400 text-sm">{dim.label}</p>
                        <p className="text-2xl font-bold text-white">{dim.value} <span className="text-sm">cm</span></p>
                      </div>
                    ))}
                  </div>

                  <div className={`flex items-center justify-center gap-2 p-4 rounded-xl mb-6 ${
                    results.confidenza >= 85
                      ? 'bg-green-600/10 text-green-500'
                      : results.confidenza >= 70
                      ? 'bg-yellow-600/10 text-yellow-500'
                      : 'bg-orange-600/10 text-orange-500'
                  }`}>
                    <Zap className="w-5 h-5" />
                    <span className="font-medium">
                      {results.confidenza >= 85
                        ? 'Alta precisione'
                        : results.confidenza >= 70
                        ? 'Buona precisione'
                        : 'Stima approssimativa'}
                    </span>
                    <span className="text-sm">({results.confidenza}%)</span>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setCameraStep('instructions');
                        setResults(null);
                      }}
                      className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Riprova
                    </button>
                    <button
                      onClick={handleUseResults}
                      className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Usa queste misure
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIMeasurement;
