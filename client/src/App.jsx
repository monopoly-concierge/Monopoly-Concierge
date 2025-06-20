import React, { lazy, Suspense, useState, useEffect } from 'react';
import { initAnalytics } from './utils/initGoogleAnalytics.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Loading from './components/Loading/Loading'
import NavBar from './components/Navigation/NavBar'
const Footer = lazy(() => import('./components/Footer/footer.jsx'));
import './App.css';

function App() {
  const [toggleDisplay, setToggleDisplay] = useState(false);
  const [navHeight, setNavHeight] = useState(0);

  // Initiating Google Analytics Set Up
  useEffect(() => {
    initAnalytics();
  }, []);

  // Lazy-loaded components
  const Home = lazy(() => import('./components/Pages/home/Home.jsx'));
  const Properties = lazy(() => import('./components/Pages/properties/Properties.jsx'));
  const JetCharters = lazy(() => import('./components/Pages/jet-charters/JetCharters.jsx'));
  const CarRentals = lazy(() => import('./components/Pages/car-rentals/CarRentals.jsx'));
  const Services = lazy(() => import('./components/Pages/services/Services.jsx'));
  const ConciergeChronicles = lazy(() => import('./components/Pages/concierge-chronicles/ConciergeChronicles.jsx'));

  return (
    <BrowserRouter>
      <NavBar setNavHeight={setNavHeight} setToggleDisplay={setToggleDisplay} toggleDisplay={toggleDisplay}/>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties navHeight={navHeight} />} />
          <Route path="/charters" element={<JetCharters navHeight={navHeight} />} />
          <Route path="/rentals" element={<CarRentals navHeight={navHeight} />} />
          <Route path="/services" element={<Services navHeight={navHeight} />} />
          <Route path="/chronicles" element={<ConciergeChronicles navHeight={navHeight} />} />
        </Routes>
      </Suspense>
        <Footer />
      <div id={toggleDisplay && window.innerWidth <= 1024 ? 'nav-overlay' : ''}/>
    </BrowserRouter>
  )
}

export default App;