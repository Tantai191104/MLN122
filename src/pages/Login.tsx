import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, TrendingUp, BarChart3, Newspaper } from "lucide-react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { authService } from "@/services/authService"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/authStore"

export default function Login() {
    const navigate = useNavigate()
    const location = useLocation() as { state?: { postAuthMessage?: string } }
    const setAuth = useAuthStore((state) => state.setAuth)
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Hiển thị thông báo sau khi đổi mật khẩu và đăng xuất (đảm bảo chỉ 1 lần)
    useEffect(() => {
        const alreadyShown = sessionStorage.getItem('postAuthMessageShown')
        if (alreadyShown === '1') return

        const fromSession = sessionStorage.getItem('postAuthMessage')
        const fromState = location.state?.postAuthMessage
        const message = fromState || fromSession
        if (message) {
            // Đánh dấu đã hiển thị để tránh lặp dưới StrictMode
            sessionStorage.setItem('postAuthMessageShown', '1')
            // Xóa nguồn dữ liệu để không hiện lại ở lần sau
            sessionStorage.removeItem('postAuthMessage')
            navigate('.', { replace: true, state: {} })
            toast.success(message)
        }
    }, [location.state, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            // Gọi API login
            const response = await authService.login({ email, password })

            console.log('✅ Login success:', response)

            // Lưu vào Zustand store
            setAuth(
                {
                    id: response.data._id,
                    name: response.data.name,
                    email: response.data.email,
                    avatar: response.data.avatar
                },
                response.data.token
            )

            // Hiển thị thông báo thành công
            toast.success(`${response.message}`, {
                description: `Chào mừng ${response.data.name}!`
            })

            // Redirect về trang chủ sau 1s
            setTimeout(() => {
                navigate('/')
            }, 1000)
        } catch (err) {
            // Xử lý lỗi
            const error = err as { response?: { data?: { message?: string } } }
            const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.'
            setError(errorMessage)
            toast.error('Đăng nhập thất bại!', {
                description: errorMessage
            })
            console.error('❌ Login error:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex animate-in fade-in duration-500">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative overflow-hidden animate-in slide-in-from-left duration-700">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>
                <div className="w-full max-w-md space-y-8 relative z-10">
                    {/* Logo and Header */}
                    <div className="text-center">
                        <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="w-14 h-14 bg-linear-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <span className="text-white font-bold text-2xl">M</span>
                            </div>
                            <div className="text-left">
                                <div className="text-2xl font-bold text-foreground">MLN122</div>
                                <div className="text-xs text-muted-foreground">Kinh tế Việt Nam</div>
                            </div>
                        </Link>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Chào mừng trở lại</h1>
                        <p className="text-muted-foreground">Đăng nhập để tiếp tục theo dõi tin tức kinh tế</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 h-12 border-2"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Mật khẩu
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10 h-12 border-2"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <Checkbox id="remember" />
                                <Label htmlFor="remember" className="cursor-pointer">
                                    Ghi nhớ đăng nhập
                                </Label>
                            </div>
                            <Link to="/forgot-password" className="text-primary hover:underline font-medium">
                                Quên mật khẩu?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <AiOutlineLoading3Quarters className="h-4 w-4 animate-spin" />
                                    Đang đăng nhập...
                                </span>
                            ) : (
                                'Đăng nhập'
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <Separator />
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-sm text-muted-foreground">
                            Hoặc
                        </span>
                    </div>

                    {/* Social Login */}
                    <div className="space-y-3">
                        <Button variant="outline" className="w-full h-12 border-2 hover:bg-accent" type="button">
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Tiếp tục với Google
                        </Button>
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm text-muted-foreground">
                        Chưa có tài khoản?{" "}
                        <Link to="/register" className="text-primary hover:underline font-semibold">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>
            </div>
            {/* Right Side - Banner */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden animate-in slide-in-from-right duration-700">
                {/* Background Image */}
                <img
                    src="https://i.pinimg.com/736x/23/7f/58/237f58e8562dd7a9b0f875ba81c4f61e.jpg" // <== Thay bằng đường dẫn hình của bạn
                    alt="Banner Economics"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Content */}
                <div className="relative z-10 max-w-lg text-white p-12 space-y-8">
                    <div>
                        <h2 className="text-4xl font-bold mb-4">Cập nhật tin tức kinh tế mỗi ngày</h2>
                        <p className="text-white/90 text-lg leading-relaxed">
                            Truy cập các phân tích chuyên sâu, báo cáo thị trường và xu hướng kinh tế Việt Nam
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                                <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Phân tích chuyên sâu</h3>
                                <p className="text-white/80 text-sm">Các bài phân tích chi tiết từ chuyên gia hàng đầu</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                                <BarChart3 className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Dữ liệu thời gian thực</h3>
                                <p className="text-white/80 text-sm">Cập nhật số liệu kinh tế mới nhất hàng ngày</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                                <Newspaper className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Tin tức nóng hổi</h3>
                                <p className="text-white/80 text-sm">Cập nhật tin tức kinh tế trong và ngoài nước</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
