import react from 'react'
import { Routes,Route, Navigate } from 'react-router'
import { Toaster } from "react-hot-toast";
import { useUser } from '@clerk/clerk-react';
import HomePage from './pages/HomePage';
import Navbar from './component/Navbar';
import ProblemPage from './pages/ProblemPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import ProblemDescription from './component/ProblemDescription';
import DashboardPage from './pages/DashboardPage';

function App() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <>
      <Routes>
        {/* Public home */}
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to="/dashboard" replace />} />

        {/* Protected routes – sirf signed-in user dekh sake */}
        <Route 
          path="/dashboard" 
          element={isSignedIn ? <DashboardPage /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/problems" 
          element={isSignedIn ? <ProblemPage /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/problem/:id" 
          element={isSignedIn ? <ProblemDetailPage /> : <Navigate to="/" replace />} 
        />

        {/* Optional: agar koi galat URL dale */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App
