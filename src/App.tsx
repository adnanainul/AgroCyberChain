import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import AgroBot from './components/AgroBot';
import { useTheme } from './context/ThemeContext';

// Lazy load components for performance
const Hero = lazy(() => import('./components/Hero'));
const Features = lazy(() => import('./components/Features'));
const Technology = lazy(() => import('./components/Technology'));
const MLModels = lazy(() => import('./components/MLModels'));
const Blockchain = lazy(() => import('./components/Blockchain'));
const AgroCommand = lazy(() => import('./components/AgroCommand'));
const Contact = lazy(() => import('./components/Contact'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const Profile = lazy(() => import('./pages/Profile'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const ProductsStore = lazy(() => import('./pages/ProductsStore'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));

function App() {
  const { bgColor } = useTheme();

  return (
    <ErrorBoundary>
      <div className={`min-h-screen transition-colors duration-500 ${bgColor} dark:text-white`}>
        <Navigation />
        <AgroBot />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#363636',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <div className="pt-16"> {/* Add padding top to account for fixed navbar */}
          <Suspense fallback={<LoadingSpinner fullScreen text="Loading application..." />}>
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/features" element={
                <ProtectedRoute allowedRoles={['farmer', 'customer']}>
                  <Features />
                </ProtectedRoute>
              } />
              <Route path="/technology" element={
                <ProtectedRoute allowedRoles={['farmer']}>
                  <Technology />
                </ProtectedRoute>
              } />
              <Route path="/models" element={
                <ProtectedRoute allowedRoles={['farmer']}>
                  <MLModels />
                </ProtectedRoute>
              } />
              <Route path="/blockchain" element={
                <ProtectedRoute allowedRoles={['farmer']}>
                  <Blockchain />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['farmer']}>
                  <AgroCommand />
                </ProtectedRoute>
              } />
              <Route path="/marketplace" element={
                <ProtectedRoute allowedRoles={['farmer', 'customer']}>
                  <Marketplace />
                </ProtectedRoute>
              } />
              <Route path="/contact" element={
                <ProtectedRoute allowedRoles={['farmer', 'customer']}>
                  <Contact />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['farmer', 'customer']}>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/products" element={
                <ProtectedRoute allowedRoles={['farmer']}>
                  <ProductsStore />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute allowedRoles={['farmer']}>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute allowedRoles={['farmer']}>
                  <Orders />
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
