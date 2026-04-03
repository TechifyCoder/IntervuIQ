// import react from 'react'
// import { Routes,Route, Navigate } from 'react-router'
// import { Toaster } from "react-hot-toast";
// import { useUser } from '@clerk/clerk-react';
// import HomePage from './pages/HomePage';
// import Navbar from './component/Navbar';
// import ProblemPage from './pages/ProblemPage';
// import ProblemDetailPage from './pages/ProblemDetailPage';
// import ProblemDescription from './component/ProblemDescription';
// import DashboardPage from './pages/DashboardPage';
// import SessionPage from './pages/SessionPage';

// function App() {
//   const { isSignedIn, isLoaded } = useUser();

//   if (!isLoaded) return null;

//   return (
//     <>
//       <Routes>
//         {/* Public home */}
//         <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to="/dashboard" replace />} />

//         {/* Protected routes – sirf signed-in user dekh sake */}
//         <Route 
//           path="/dashboard" 
//           element={isSignedIn ? <DashboardPage /> : <Navigate to="/" replace />} 
//         />
//         <Route 
//           path="/problems" 
//           element={isSignedIn ? <ProblemPage /> : <Navigate to="/" replace />} 
//         />
//         <Route 
//           path="/problem/:id" 
//           element={isSignedIn ? <ProblemDetailPage /> : <Navigate to="/" replace />} 
//         />
//       <Route path="/session/:id"
//        element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />
//         {/* Optional: agar koi galat URL dale */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>

//       <Toaster toastOptions={{ duration: 3000 }} />
//     </>
//   );
// }

// export default App







import React, { Suspense, lazy } from 'react'; // 1. Suspense aur lazy import kiya
import { Routes, Route, Navigate } from 'react-router';
import { Toaster } from "react-hot-toast";
import { useUser } from '@clerk/clerk-react';

// Common components ko normal import rakhein (kyunki ye chote hain ya har jagah chahiye)
import HomePage from './pages/HomePage';

// 2. Heavy Pages ko Lazy Load karein
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProblemPage = lazy(() => import('./pages/ProblemPage'));
const ProblemDetailPage = lazy(() => import('./pages/ProblemDetailPage'));
const SessionPage = lazy(() => import('./pages/SessionPage'));

function App() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <>
      {/* 3. Routes ko Suspense se wrap karein */}
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center">
          <p className="text-lg font-semibold">Loading...</p> 
        </div>
      }>
        <Routes>
          {/* Public home */}
          <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to="/dashboard" replace />} />

          {/* Protected routes */}
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
          <Route 
            path="/session/:id"
            element={isSignedIn ? <SessionPage /> : <Navigate to="/" />} 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;