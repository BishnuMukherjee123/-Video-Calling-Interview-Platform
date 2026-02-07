import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser } from '@clerk/clerk-react'
import { Routes, Route, Navigate } from 'react-router'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import ProblemsPage from './pages/ProblemsPage'
import { Toaster } from "react-hot-toast"
import DashboardPage from './pages/DashboardPage'

function App() {
  const {isSignedIn, isLoaded } = useUser();
  // this will get rid of the flickering effect
  if (!isLoaded) return null;
  return (
    <>
    <Routes>
      <Route path="/" element={!isSignedIn ? <HomePage/> : <Navigate to={"/dashboard"}/>}/>
      <Route path="/dashboard" element={isSignedIn ? <DashboardPage/> : <Navigate to={"/"}/>}/>
      <Route path="/about" element={<AboutPage/>}/>
      <Route path="/problems" element={isSignedIn? <ProblemsPage/> : <Navigate to={"/"}/>}/>
    </Routes>
    <Toaster toastOptions={{duration: 3000}}/>
    </>
  )
}

export default App

// tw, daisyui, react-router, react-hot-toast
// todo: react-query aka tanstack query, axios