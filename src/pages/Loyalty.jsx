import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Gift,
  TrendingUp,
  Users,
  Package,
  Copy,
  Check,
  ArrowRight,
  ChevronRight,
  Trophy,
  Crown,
} from 'lucide-react';
import { useShipmentStore } from '../store/shipmentStore';
import { formatPrice } from '../utils/formatters';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/Toast';

const rewards = [
  { points: 500, reward: '5% sconto prossima spedizione' },
  { points: 1000, reward: '10% sconto prossima spedizione' },
  { points: 2000, reward: 'Spedizione gratuita fino a 10€' },
  { points: 5000, reward: 'Spedizione express gratuita' },
  { points: 10000, reward: 'Mese spedizioni con 20% sconto' },
];

const earningMethods = [
  { icon: Package, label: '1€ speso = 10 punti', desc: 'Guadagna su ogni spedizione' },
  { icon: Check, label: 'Spedizione completata = +50 punti', desc: 'Bonus completamento' },
  { icon: Gift, label: 'Prima spedizione = +200 punti', desc: 'Bonus benvenuto' },
  { icon: Users, label: 'Invita un amico = +500 punti', desc: 'Tu +500, amico +200' },
];

export const Loyalty = () => {
  const { loyalty, LOYALTY_LEVELS, getLoyaltyLevel, getNextLevel, redeemPoints, user } = useShipmentStore();
  const { success } = useToast();
  const [copied, setCopied] = useState(false);
  const [redeemingReward, setRedeemingReward] = useState(null);

  const currentLevel = getLoyaltyLevel();
  const nextLevel = getNextLevel();
  const pointsToNext = nextLevel ? nextLevel.min - loyalty.points : 0;
  const progressPercent = nextLevel
    ? ((loyalty.points - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100
    : 100;

  const handleCopyReferral = async () => {
    const link = `https://sendy.app/ref/${user.nome?.toLowerCase() || 'user'}${user.cognome?.toLowerCase() || ''}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      success('Link referral copiato!');
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Copy failed:', e);
    }
  };

  const handleRedeem = (reward) => {
    if (loyalty.points >= reward.points) {
      redeemPoints(reward.points);
      setRedeemingReward(reward);
      success(`Riscattato: ${reward.reward}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Programma Fedeltà</h1>
          <p className="text-slate-400">Guadagna punti su ogni spedizione</p>
        </motion.div>

        {/* User Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-sky-600/20 to-slate-800 border border-sky-600/30 rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-slate-400 text-sm mb-1">
                Ciao, {user.nome}
              </p>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: currentLevel?.color + '30' }}
                >
                  {currentLevel?.name === 'Platino' ? (
                    <Crown className="w-6 h-6" style={{ color: currentLevel?.color }} />
                  ) : (
                    <Trophy className="w-6 h-6" style={{ color: currentLevel?.color }} />
                  )}
                </div>
                <div>
                  <p className="text-white font-bold text-2xl" style={{ color: currentLevel?.color }}>
                    {currentLevel?.name}
                  </p>
                  <p className="text-slate-400 text-xs">
                    {currentLevel?.perks?.join(' • ')}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-baseline gap-1 justify-center">
                <Star className="w-6 h-6 text-amber-500" />
                <span className="text-4xl font-bold text-white">{loyalty.points.toLocaleString()}</span>
                <span className="text-slate-400 text-sm">punti</span>
              </div>
              <p className="text-slate-400 text-sm mt-1">Spedizioni: {loyalty.totalShipments}</p>
            </div>

            <div className="text-center">
              <p className="text-slate-400 text-sm mb-1">Risparmiato</p>
              <p className="text-2xl font-bold text-green-500">{formatPrice(loyalty.savedAmount)}</p>
            </div>
          </div>

          {/* Progress to next level */}
          {nextLevel && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>{currentLevel?.name}</span>
                <span>{nextLevel?.name} - {pointsToNext} punti mancanti</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-sky-600 to-amber-500 rounded-full"
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Levels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-600" />
            I livelli
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {LOYALTY_LEVELS.map((level) => (
              <div
                key={level.name}
                className={`p-4 rounded-xl border-2 transition-all ${
                  currentLevel?.name === level.name
                    ? 'border-sky-600 bg-sky-600/10'
                    : 'border-slate-700 bg-slate-900/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {level.name === 'Platino' ? (
                    <Crown className="w-4 h-4" style={{ color: level.color }} />
                  ) : (
                    <Trophy className="w-4 h-4" style={{ color: level.color }} />
                  )}
                  <span className="font-semibold" style={{ color: level.color }}>
                    {level.name}
                  </span>
                </div>
                <p className="text-slate-400 text-xs">
                  {level.min.toLocaleString()}+ punti
                </p>
                <div className="mt-2 space-y-1">
                  {level.perks.map((perk, i) => (
                    <p key={i} className="text-slate-300 text-xs">{perk}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* How to earn */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            Come guadagnare punti
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {earningMethods.map((method, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-sky-600/20 flex items-center justify-center">
                  <method.icon className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <p className="font-semibold text-white">{method.label}</p>
                  <p className="text-slate-400 text-sm">{method.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Rewards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-pink-500" />
            I tuoi premi
          </h2>
          <div className="space-y-3">
            {rewards.map((reward) => {
              const canRedeem = loyalty.points >= reward.points;
              return (
                <div
                  key={reward.points}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    canRedeem
                      ? 'border-sky-600 bg-sky-600/5'
                      : 'border-slate-700 bg-slate-900/50 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-600/20 flex items-center justify-center">
                      <span className="text-amber-500 font-bold">{reward.points}</span>
                    </div>
                    <p className="text-white">{reward.reward}</p>
                  </div>
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canRedeem}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-1 transition-all ${
                      canRedeem
                        ? 'bg-sky-600 hover:bg-sky-700 text-white'
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {canRedeem ? (
                      <>
                        Riscatta
                        <ChevronRight className="w-4 h-4" />
                      </>
                    ) : (
                      `Manca ${reward.points - loyalty.points} pt`
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Referral */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-violet-600/20 to-pink-600/20 border border-violet-600/30 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-500" />
            Invita un amico
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-slate-300 mb-2">Condividi il tuo link referral:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={`https://sendy.app/ref/${user.nome?.toLowerCase() || 'user'}`}
                  readOnly
                  className="px-4 py-2 bg-slate-900/50 rounded-lg text-sky-400 font-mono text-sm"
                />
                <button
                  onClick={handleCopyReferral}
                  className={`p-2 rounded-lg ${
                    copied ? 'bg-green-600' : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-center">
              <div className="px-4 py-2 bg-violet-600/20 rounded-lg">
                <p className="text-violet-400 font-bold">+500</p>
                <p className="text-slate-400 text-xs">per te</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <div className="px-4 py-2 bg-pink-600/20 rounded-lg">
                <p className="text-pink-400 font-bold">+200</p>
                <p className="text-slate-400 text-xs">per amico</p>
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-sm mt-4">
            Inviti inviati: {loyalty.referrals} • Punti guadagnati: +{loyalty.referrals * 500}
          </p>
        </motion.div>

        {/* History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Storico punti</h2>
          <div className="space-y-2">
            {loyalty.history.map((entry, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0"
              >
                <div>
                  <p className="text-white">{entry.desc}</p>
                  <p className="text-slate-500 text-sm">{entry.date}</p>
                </div>
                <span className={`font-bold ${entry.points > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {entry.points > 0 ? '+' : ''}{entry.points}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <Toast toasts={[]} removeToast={() => {}} />
    </div>
  );
};

export default Loyalty;
