import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Chatbot from "@/components/Chatbot"
import Home from "@/pages/Home"
import ArticleDetail from "@/pages/ArticleDetail"
import About from "@/pages/About"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import AdminLayout from "@/pages/AdminLayout"
import AdminDashboard from "@/pages/AdminDashboard"

import { ThemeProvider } from "./contexts/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import { useAuthStore } from "@/stores/authStore"
import Profile from "./pages/Profile"
import PostCreate from "./pages/PostCreate"
import ProtectedRoute from "./components/ProtectedRoute"

export default function App() {
  const initAuth = useAuthStore((state) => state.initAuth)

  // Initialize auth state on app load
  useEffect(() => {
    initAuth()
  }, [initAuth])

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes - No Header/Footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>
          {/* Main Routes - With Header/Footer */}
          <Route path="/*" element={
            <div className="min-h-screen bg-background text-foreground flex flex-col">
              <Header />
              <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/article/:id" element={<ArticleDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/post-create" element={
                    <ProtectedRoute requireAdmin>
                      <PostCreate />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
              <Chatbot />
            </div>
          } />
        </Routes>
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </ThemeProvider>
  )
}
