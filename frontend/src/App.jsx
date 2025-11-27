import react from 'react'
import { Routes,Route, Navigate } from 'react-router'
import { Toaster } from "react-hot-toast";
import { useUser } from '@clerk/clerk-react';
import HomePage from './pages/HomePage';

function App() {
  const { isSignedIn, isLoaded } = useUser();

  if(!isLoaded) return null
  return (
    <>
    <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />}  />
    </Routes>
     <Toaster toastOptions={{ duration: 3000 }} />
    </>
  )
}

export default App
