import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "@/contexts/useTheme"
import { useAuthStore } from "@/stores/authStore"
import { Moon, Sun, Menu, LogOut, User as UserIcon, Settings } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function Header() {
    const { setTheme } = useTheme()
    const navigate = useNavigate()
    const { user, isAuthenticated, logout } = useAuthStore()

    const handleLogout = () => {
        logout()
        toast.success('Đăng xuất thành công', {
            description: 'Hẹn gặp lại bạn!'
        })
        navigate('/')
    }

    // Get user initials for avatar fallback
    const getUserInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-border/50 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                    <div className="w-10 h-10 bg-linear-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">M</span>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">MLN122</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Kinh tế Việt Nam</div>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    <Link className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-accent/50 rounded-lg transition-all" to="/">
                        Trang chủ
                    </Link>
                    <Link className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-accent/50 rounded-lg transition-all" to="/about">
                        Phân tích
                    </Link>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-accent/50 rounded-lg transition-all">
                        Về chúng tôi
                    </button>

                    <Link className="px-4 py-2 text-sm text-orange-700 dark:text-orange-300 hover:text-white hover:bg-linear-to-r hover:from-primary hover:to-orange-500 rounded-lg transition-all font-semibold" to="/post-create">
                        Đăng bài
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="ml-2 relative group hover:bg-accent">
                                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500 group-hover:text-amber-600" />
                                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400 dark:group-hover:text-indigo-300" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[140px] bg-card border-border shadow-lg">
                            <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                                <Sun className="mr-2 h-4 w-4 text-amber-500" />
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                                <Moon className="mr-2 h-4 w-4 text-indigo-400" />
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
                                <Menu className="mr-2 h-4 w-4 text-primary" />
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User Authentication */}
                    {isAuthenticated && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="ml-3 gap-2 hover:bg-accent">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.avatar || undefined} alt={user.name} />
                                        <AvatarFallback className="bg-primary text-white text-sm">
                                            {getUserInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-semibold text-primary dark:text-orange-300 drop-shadow-sm">{user.name}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="min-w-[200px] bg-card border-border shadow-lg">
                                <div className="px-3 py-2">
                                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link to="/profile" className="flex items-center">
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        Trang cá nhân
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Cài đặt
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Đăng xuất
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button size="sm" asChild className="ml-3 bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg transition-all font-semibold">
                            <Link to="/login">Đăng nhập</Link>
                        </Button>
                    )}
                </nav>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-200 hover:bg-accent">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-40 bg-card border-border shadow-lg">
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link to="/">Trang chủ</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link to="/about">Phân tích</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                            <Sun className="mr-2 h-4 w-4 text-amber-500" />
                            Light mode
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                            <Moon className="mr-2 h-4 w-4 text-indigo-400" />
                            Dark mode
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
