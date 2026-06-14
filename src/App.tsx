import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute, AuthRoute } from './components/ProtectedRoute';
import SupportChatWidget from './components/SupportChatWidget';

const Auth = lazy(() => import('./pages/Auth'));
const Home = lazy(() => import('./pages/Home'));
const Shipment = lazy(() => import('./pages/Shipment'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Success = lazy(() => import('./pages/Success'));
const Tracking = lazy(() => import('./pages/Tracking'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Compare = lazy(() => import('./pages/Compare'));
const Loyalty = lazy(() => import('./pages/Loyalty'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth route (only accessible when not logged in) */}
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Suspense fallback={<LoadingScreen />}>
                <Auth />
              </Suspense>
            </AuthRoute>
          }
        />

        {/* Protected routes (require login) */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-slate-900 flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <Suspense fallback={<LoadingScreen />}>
                    <Routes>
                      <Route index element={<Navigate to="/home" replace />} />
                      <Route path="home" element={<Home />} />
                      <Route path="shipment" element={<Shipment />} />
                      <Route path="checkout" element={<Checkout />} />
                      <Route path="success" element={<Success />} />
                      <Route path="tracking" element={<Tracking />} />
                      <Route path="faq" element={<FAQ />} />
                      <Route path="compare" element={<Compare />} />
                      <Route path="loyalty" element={<Loyalty />} />
                      <Route path="*" element={<Navigate to="/home" replace />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
                <SupportChatWidget />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

const LoadingScreen = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 mx-auto border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400">Caricamento...</p>
    </div>
  </div>
);

export default App;
