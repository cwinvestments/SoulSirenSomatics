import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Sanctuary from './pages/Sanctuary';
import Book from './pages/Book';
import Contact from './pages/Contact';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Clients from './pages/admin/Clients';
import Bookings from './pages/admin/Bookings';
import Members from './pages/admin/Members';
import Content from './pages/admin/Content';
import Settings from './pages/admin/Settings';

// Portal Pages
import PortalLogin from './pages/portal/PortalLogin';
import PortalRegister from './pages/portal/PortalRegister';
import PortalDashboard from './pages/portal/PortalDashboard';
import MyBookings from './pages/portal/MyBookings';
import MyScans from './pages/portal/MyScans';
import MySanctuary from './pages/portal/MySanctuary';
import MyProfile from './pages/portal/MyProfile';

// Components
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import PortalProtectedRoute from './components/PortalProtectedRoute';

// Context
import { PortalAuthProvider } from './context/PortalAuthContext';

function App() {
  return (
    <PortalAuthProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/sanctuary" element={<Sanctuary />} />
            <Route path="/book" element={<Book />} />
            <Route path="/contact" element={<Contact />} />

            {/* Portal Routes */}
            <Route path="/portal" element={<PortalLogin />} />
            <Route path="/portal/register" element={<PortalRegister />} />
            <Route path="/portal/dashboard" element={
              <PortalProtectedRoute>
                <PortalDashboard />
              </PortalProtectedRoute>
            } />
            <Route path="/portal/bookings" element={
              <PortalProtectedRoute>
                <MyBookings />
              </PortalProtectedRoute>
            } />
            <Route path="/portal/scans" element={
              <PortalProtectedRoute>
                <MyScans />
              </PortalProtectedRoute>
            } />
            <Route path="/portal/sanctuary" element={
              <PortalProtectedRoute>
                <MySanctuary />
              </PortalProtectedRoute>
            } />
            <Route path="/portal/profile" element={
              <PortalProtectedRoute>
                <MyProfile />
              </PortalProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/clients" element={
              <ProtectedRoute>
                <Clients />
              </ProtectedRoute>
            } />
            <Route path="/admin/bookings" element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            } />
            <Route path="/admin/members" element={
              <ProtectedRoute>
                <Members />
              </ProtectedRoute>
            } />
            <Route path="/admin/content" element={
              <ProtectedRoute>
                <Content />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </PortalAuthProvider>
  );
}

export default App;
