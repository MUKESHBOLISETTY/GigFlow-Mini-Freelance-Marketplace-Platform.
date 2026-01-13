import { useState } from 'react'
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import useAuth from './hooks/useAuth';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';
import Cookies from 'js-cookie';
import FindWorkPage from './pages/freelancer/FindWorkPage';
import NotFoundPage from './pages/NotFoundPage';
import Profile from './components/reusable/Profile';
import ManageProjects from './pages/client/ManageProject';
import useGigs from './hooks/useGigs';
import ProjectDetailsPage from './components/reusable/ProjectDetailsPage';

const ClientRoute = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <p>Loading...</p>
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user?.type !== "Client") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

function App() {
  const { loading, is_logged_in, user, error, email } = useSelector((state) => state.auth);

  const { setupUserSSE } = useAuth();
  const { setupProjectsSSE } = useGigs();
  useEffect(() => {
    if (is_logged_in) {
      const cleanupUser = setupUserSSE();
      const cleanupProjects = setupProjectsSSE();
      return () => {
        cleanupUser();
        cleanupProjects();
      };
    }
  }, [is_logged_in, setupUserSSE, setupProjectsSSE]);
  return (
    <AppContent />
  );
}
function AppContent() {
  return (
    <>
      <Toaster />
      <Routes>
        {/* AUTHENTICATION */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />

        {/* FREELANCER PAGES */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/find-work' element={<FindWorkPage />} />
        <Route path='/project/:id' element={<ProjectDetailsPage />} />

        {/* CLIENT PAGES */}
        <Route path="/client" element={<ClientRoute />}>
          <Route index element={<ManageProjects />} />
          <Route path='projects' element={<ManageProjects />} />
          <Route path='profile' element={<Profile />} />
          <Route path='project/:id' element={<ProjectDetailsPage />} />
        </Route>

        {/* COMMON PAGES */}
        <Route path='/profile' element={<Profile />} />

        {/* NOT FOUND PAGE */}
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
