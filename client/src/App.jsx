import React from 'react';
import { Toaster } from 'sonner';
import { Routes, Route } from 'react-router-dom';
import Dashboard from "./pages/Dashboard"
import Customers from "./pages/Customers"
import Products from "./pages/Products"
import Payments from "./pages/Payments"
import Reports from "./pages/Reports"
import Invoices from "./pages/Invoices"
import Settings from './pages/Settings';
import Home from './pages/Home';
import AuthLayout from './pages/AuthLayout';
import { AppLayout } from './pages/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';



const App = () => {
  return (
    <>
      <Toaster />

      <Routes>
        <Route path='/login' element={<AuthLayout />} />
        <Route path='/' element={<Home />} />
        <Route element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/customers" element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          } />
          <Route path="/products" element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } />
          <Route path="/invoices" element={
            <ProtectedRoute>
              <Invoices />
            </ProtectedRoute>
          } />
          <Route path="/payments" element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path='/settings' element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </>
  );
}

export default App;

