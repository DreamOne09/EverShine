import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Layout from './components/layout/Layout';
import LoadingScreen from './components/layout/LoadingScreen';

// Lazy load pages to reduce initial bundle size
const Home = lazy(() => import('./pages/Home'));
const Members = lazy(() => import('./pages/Members'));
const Referrals = lazy(() => import('./pages/Referrals'));
const BNIPage = lazy(() => import('./pages/BNI'));
const MemberEdit = lazy(() => import('./pages/MemberEdit'));

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="bni" element={<BNIPage />} />
              <Route path="members" element={<Members />} />
              <Route path="referrals" element={<Referrals />} />
              <Route path="edit" element={<MemberEdit />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
