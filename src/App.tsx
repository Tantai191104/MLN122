import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Home from "@/pages/Home"
import ArticleDetail from "@/pages/ArticleDetail"
import About from "@/pages/About"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import { ThemeProvider } from "./contexts/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import { useAuthStore } from "@/stores/authStore"

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

          {/* Main Routes - With Header/Footer */}
          <Route path="/*" element={
            <div className="min-h-screen bg-background text-foreground flex flex-col">
              <Header />
              <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/article/:id" element={<ArticleDetail />} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </ThemeProvider>
  )
}
