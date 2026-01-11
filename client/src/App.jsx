import { useState } from 'react'
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import TestPage from './pages/TestPage';
import useAuth from './hooks/useAuth';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function App() {
  const { loading, is_logged_in, user, error, email } = useSelector((state) => state.auth);

  const { setupUserSSE } = useAuth();

  useEffect(() => {
    if (is_logged_in) {
      const cleanupUser = setupUserSSE();
      return () => {
        cleanupUser();
      };
    }
  }, [is_logged_in, setupUserSSE]);
  return (
    <AppContent />
  );
}
function AppContent() {
  return (
    <>
      <Toaster />
      <Routes>

        <Route path='/' element={<TestPage />} />

      </Routes>
    </>
  )
}

export default App
