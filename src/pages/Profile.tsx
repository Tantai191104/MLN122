import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { accountService } from '@/services/accountService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
    Camera,
    Loader2,
    User,
    Lock,
    Mail,
    Image as ImageIcon,
    HardDrive,
    Palette,
    ShieldAlert,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function Profile() {
    const { user, setAuth, updateUser, logout } = useAuthStore()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)

    const [name, setName] = useState(user?.name || '')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // ========== Cập nhật tên ==========
    const handleUpdateName = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user?.id) return toast.error('Không tìm thấy thông tin người dùng')
        if (!name.trim()) return toast.error('Vui lòng nhập tên')

        setIsLoading(true)
        try {
            const response = await accountService.updateAccount(user.id, { name: name.trim() })
            setAuth(
                {
                    id: response.data._id,
                    name: response.data.name,
                    email: response.data.email,
                    avatar: response.data.avatar,
                },
                response.data.token
            )
            toast.success(response.message || 'Cập nhật tên thành công!')
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } }
            toast.error(err.response?.data?.message || 'Cập nhật tên thất bại')
        } finally {
            setIsLoading(false)
        }
    }

    // ========== Upload Avatar ==========
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (!file.type.startsWith('image/')) return toast.error('Vui lòng chọn file ảnh')
        if (file.size > 5 * 1024 * 1024) return toast.error('Kích thước ảnh không được vượt quá 5MB')

        const formData = new FormData()
        formData.append('avatar', file)

        setIsUploadingAvatar(true)
        try {
            const response = await accountService.uploadAvatar(formData)
            if (user) updateUser({ ...user, avatar: response.data.avatar })
            toast.success(response.message || 'Upload avatar thành công!')
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } }
            toast.error(err.response?.data?.message || 'Upload avatar thất bại')
        } finally {
            setIsUploadingAvatar(false)
        }
    }

    // ========== Đổi mật khẩu ==========
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user?.id) return toast.error('Không tìm thấy thông tin người dùng')

        if (!oldPassword || !newPassword || !confirmPassword)
            return toast.error('Vui lòng điền đầy đủ thông tin')
        if (newPassword.length < 6) return toast.error('Mật khẩu mới phải có ít nhất 8 ký tự')
        if (newPassword !== confirmPassword) return toast.error('Mật khẩu xác nhận không khớp')

        setIsChangingPassword(true)
        try {
            await accountService.changePassword(user.id, {
                oldPassword,
                newPassword,
                confirmPassword,
            })
            toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.')
            logout()
            // Điều hướng client-side kèm state để tăng độ tin cậy hiển thị thông báo
            navigate('/login')
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } }
            toast.error(err.response?.data?.message || 'Đổi mật khẩu thất bại')
        } finally {
            setIsChangingPassword(false)
        }
    }

    return (
        <div className="container max-w-5xl py-12 px-4">
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-linear-to-r from-primary via-orange-500 to-amber-600 bg-clip-text text-transparent">
                    Tài khoản của tôi
                </h1>
                <p className="text-muted-foreground text-lg">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
            </div>

            {/* Avatar */}
            <Card className="mb-8 border-2 shadow-md hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-linear-to-r from-primary/5 via-orange-500/5 to-amber-600/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Camera className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">Ảnh đại diện</CardTitle>
                            <CardDescription>Tải lên ảnh đại diện của bạn</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-8 pb-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <Avatar className="relative h-32 w-32 border-4 border-background">
                                <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
                                <AvatarFallback className="text-4xl font-bold bg-linear-to-br from-primary to-orange-500 text-white">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label
                                            htmlFor="avatar-upload"
                                            className="absolute bottom-0 right-0 p-3 bg-linear-to-r from-primary to-orange-500 text-white rounded-full cursor-pointer hover:scale-110 transition-transform duration-200 shadow-lg"
                                        >
                                            {isUploadingAvatar ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <Camera className="h-5 w-5" />
                                            )}
                                        </Label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Đổi ảnh đại diện</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarUpload}
                                disabled={isUploadingAvatar}
                            />
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h3 className="text-2xl font-bold">{user?.name}</h3>
                            <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                                <Mail className="h-4 w-4" />
                                {user?.email}
                            </p>
                            <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-3">
                                <div className="flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4 text-primary" /> <span>Chấp nhận JPG, PNG, GIF</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <HardDrive className="h-4 w-4 text-orange-500" /> <span>Kích thước tối đa 5MB</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Palette className="h-4 w-4 text-amber-600" />{' '}
                                    <span>Khuyên dùng ảnh vuông độ phân giải cao</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="mb-8 border-2 shadow-md hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-linear-to-r from-primary/5 via-orange-500/5 to-amber-600/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">Thông tin tài khoản</CardTitle>
                            <CardDescription>Cập nhật thông tin cá nhân</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleUpdateName} className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="name" className="font-semibold flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" /> Tên hiển thị
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nhập tên của bạn"
                                disabled={isLoading}
                                className="h-12 text-base border-2 focus:border-primary"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="email" className="font-semibold flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" /> Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="h-12 text-base bg-muted border-2"
                            />
                            <Badge variant="secondary" className="w-fit flex items-center gap-1">
                                <Lock className="h-3 w-3" /> Email không thể thay đổi
                            </Badge>
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full md:w-auto h-12 px-8 text-base font-semibold bg-linear-to-r from-primary to-orange-500 hover:opacity-90 transition-opacity shadow-lg"
                        >
                            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                            Cập nhật thông tin
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Separator className="my-8" />

            {/* Change Password */}
            <Card className="border-2 shadow-md hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-linear-to-r from-primary/5 via-orange-500/5 to-amber-600/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Lock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">Đổi mật khẩu</CardTitle>
                            <CardDescription>Bảo mật tài khoản của bạn</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleChangePassword} className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="oldPassword" className="font-semibold flex items-center gap-2">
                                <Lock className="h-4 w-4 text-primary" /> Mật khẩu hiện tại
                            </Label>
                            <Input
                                id="oldPassword"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                disabled={isChangingPassword}
                                placeholder="Nhập mật khẩu hiện tại"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="newPassword" className="font-semibold flex items-center gap-2">
                                <Lock className="h-4 w-4 text-orange-500" /> Mật khẩu mới
                            </Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={isChangingPassword}
                                placeholder="Nhập mật khẩu mới"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="confirmPassword" className="font-semibold flex items-center gap-2">
                                <Lock className="h-4 w-4 text-amber-600" /> Xác nhận mật khẩu mới
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isChangingPassword}
                                placeholder="Nhập lại mật khẩu mới"
                            />
                        </div>

                        <Alert className="border-amber-200 dark:border-amber-800">
                            <ShieldAlert className="h-4 w-4 text-amber-600" />
                            <AlertTitle>Lưu ý bảo mật</AlertTitle>
                            <AlertDescription>
                                Mật khẩu mới phải có ít nhất 8 ký tự và khác với mật khẩu hiện tại. Sau khi đổi mật khẩu,
                                bạn có thể cần đăng nhập lại.
                            </AlertDescription>
                        </Alert>

                        <Button
                            type="submit"
                            disabled={isChangingPassword}
                            className="w-full md:w-auto h-12 px-8 text-base font-semibold bg-linear-to-r from-primary to-orange-500 hover:opacity-90 transition-opacity shadow-lg"
                        >
                            {isChangingPassword && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                            Đổi mật khẩu
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
