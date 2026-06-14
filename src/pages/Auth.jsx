import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package, Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useShipmentStore } from '../store/shipmentStore';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/Toast';

const loginSchema = z.object({
  email: z.string().email('Inserisci un\'email valida'),
  password: z.string().min(8, 'La password deve avere almeno 8 caratteri'),
});

const registerSchema = z.object({
  nome: z.string().min(2, 'Il nome deve avere almeno 2 caratteri'),
  cognome: z.string().min(2, 'Il cognome deve avere almeno 2 caratteri'),
  email: z.string().email('Inserisci un\'email valida'),
  password: z.string().min(8, 'La password deve avere almeno 8 caratteri'),
  confermaPassword: z.string(),
}).refine((data) => data.password === data.confermaPassword, {
  message: 'Le password non coincidono',
  path: ['confermaPassword'],
});

export const Auth = () => {
  const navigate = useNavigate();
  const { login } = useShipmentStore();
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      // TODO: integrate real Google OAuth with Firebase Auth or Supabase Auth
      await new Promise((resolve) => setTimeout(resolve, 1500));
      login({
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mario.rossi@gmail.com',
      });
      success('Accesso effettuato con Google!');
      navigate('/home');
    } catch (e) {
      error('Errore durante l\'accesso con Google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleLogin = async (data) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      login({
        nome: data.email.split('@')[0],
        cognome: '',
        email: data.email,
      });
      success('Accesso effettuato!');
      navigate('/home');
    } catch (e) {
      error('Email o password non corretti');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      login({
        nome: data.nome,
        cognome: data.cognome,
        email: data.email,
      });
      success('Registrazione completata!');
      navigate('/home');
    } catch (e) {
      error('Errore durante la registrazione');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full pl-12 pr-4 py-3 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-all ${
      hasError ? 'border-red-500' : 'border-slate-700 focus:border-sky-600'
    }`;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400 }}
            className="inline-flex items-center justify-center mb-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-sky-600/20 flex items-center justify-center">
              <Package className="w-8 h-8 text-sky-600" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">SENDY</h1>
          <p className="text-slate-400">Spedisci come un Pro</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
          {/* Tabs */}
          <div className="flex mb-6 bg-slate-900 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === 'login'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Accedi
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === 'register'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Registrati
            </button>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
            className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-medium rounded-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 mb-6"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span className="text-xl font-bold text-blue-500">G</span>
                <span>Continua con Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-800 text-slate-500">oppure</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'login' ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="space-y-4"
              >
                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    {...loginForm.register('email')}
                    placeholder="Email"
                    className={inputClass(loginForm.formState.errors.email)}
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="text-red-400 text-sm">{loginForm.formState.errors.email.message}</p>
                )}

                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...loginForm.register('password')}
                    placeholder="Password"
                    className={`${inputClass(loginForm.formState.errors.password)} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-red-400 text-sm">{loginForm.formState.errors.password.message}</p>
                )}

                {/* Forgot Password */}
                <div className="text-right">
                  <button type="button" className="text-sky-600 text-sm hover:underline">
                    Hai dimenticato la password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading || isGoogleLoading || !loginForm.formState.isValid}
                  className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Accedi
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={registerForm.handleSubmit(handleRegister)}
                className="space-y-4"
              >
                {/* Name fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      {...registerForm.register('nome')}
                      placeholder="Nome"
                      className={inputClass(registerForm.formState.errors.nome)}
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      {...registerForm.register('cognome')}
                      placeholder="Cognome"
                      className={inputClass(registerForm.formState.errors.cognome)}
                    />
                  </div>
                </div>
                {(registerForm.formState.errors.nome || registerForm.formState.errors.cognome) && (
                  <p className="text-red-400 text-sm">
                    {registerForm.formState.errors.nome?.message || registerForm.formState.errors.cognome?.message}
                  </p>
                )}

                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    {...registerForm.register('email')}
                    placeholder="Email"
                    className={inputClass(registerForm.formState.errors.email)}
                  />
                </div>
                {registerForm.formState.errors.email && (
                  <p className="text-red-400 text-sm">{registerForm.formState.errors.email.message}</p>
                )}

                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...registerForm.register('password')}
                    placeholder="Password (min 8 caratteri)"
                    className={`${inputClass(registerForm.formState.errors.password)} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-red-400 text-sm">{registerForm.formState.errors.password.message}</p>
                )}

                {/* Confirm Password */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...registerForm.register('confermaPassword')}
                    placeholder="Conferma Password"
                    className={`${inputClass(registerForm.formState.errors.confermaPassword)} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {registerForm.formState.errors.confermaPassword && (
                  <p className="text-red-400 text-sm">{registerForm.formState.errors.confermaPassword.message}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading || isGoogleLoading || !registerForm.formState.isValid}
                  className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Registrati
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <Toast toasts={[]} removeToast={() => {}} />
    </div>
  );
};

export default Auth;
