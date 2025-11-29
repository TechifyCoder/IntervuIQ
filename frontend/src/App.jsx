import react from 'react'
import { Routes,Route, Navigate } from 'react-router'
import { Toaster } from "react-hot-toast";
import { useUser } from '@clerk/clerk-react';
import HomePage from './pages/HomePage';
import Navbar from './component/Navbar';
import ProblemPage from './pages/ProblemPage';

function App() {
  const { isSignedIn, isLoaded } = useUser();

  if(!isLoaded) return null
  return (
    <>
    <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />}  />
        <Route path="/problem" element={!isSignedIn ? <ProblemPage /> : <Navigate to={"/dashboard"} />}  />
    </Routes>
     <Toaster toastOptions={{ duration: 3000 }} />
    </>
  )
}

export default App
