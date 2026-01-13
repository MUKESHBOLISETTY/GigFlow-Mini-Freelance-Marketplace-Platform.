import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
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
import io from 'socket.io-client';

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

const FreelancerRoute = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <p>Loading...</p>
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user?.type !== "Freelancer") {
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
  }, [is_logged_in, setupProjectsSSE]);

  const userId = user?._id;
  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
    });

    if (!userId) return;
    socket.on('connect', () => {
      console.log("Connected to WebSocket:", socket.id);
      socket.emit('join', userId);
    });

    socket.on('notification', (data) => {
      toast.success(data.message, { duration: 3000, position: 'bottom-right' });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

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

        <Route path='/' element={<LandingPage />} />
        <Route path='/find-work' element={<FindWorkPage />} />

        {/* FREELANCER PAGES */}
        <Route path="/freelancer" element={<FreelancerRoute />}>
          <Route index element={<FindWorkPage />} />
          <Route path='find-work' element={<FindWorkPage />} />
          <Route path='profile' element={<Profile />} />
          <Route path='project/:id' element={<ProjectDetailsPage />} />
        </Route>
        {/* CLIENT PAGES */}
        <Route path="/client" element={<ClientRoute />}>
          <Route index element={<ManageProjects />} />
          <Route path='projects' element={<ManageProjects />} />
          <Route path='profile' element={<Profile />} />
          <Route path='project/:id' element={<ProjectDetailsPage />} />
        </Route>

        {/* NOT FOUND PAGE */}
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
