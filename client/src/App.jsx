import { useState } from 'react'
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import TestPage from './pages/TestPage';
import useAuth from './hooks/useAuth';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';
import Cookies from 'js-cookie';
import FindWorkPage from './pages/client/FindWorkPage';
import ProjectDetailsPage from './pages/client/ProjectDetailsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const { loading, is_logged_in, user, error, email } = useSelector((state) => state.auth);

  const { setupUserSSE } = useAuth();
  useEffect(() => {
    if (is_logged_in !== "true") return;
    const cleanupUser = setupUserSSE();
    return () => {
      cleanupUser();
    };

  }, [is_logged_in, email, setupUserSSE]);
  return (
    <AppContent />
  );
}
function AppContent() {
  return (
    <>
      <Toaster />
      <Routes>

        <Route path='/' element={<FindWorkPage />} />
        <Route path='/find-work' element={<FindWorkPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/project/:id' element={<ProjectDetailsPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
