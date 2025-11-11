import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, UserPlus, TrendingUp, Calendar, RefreshCw, Activity, AlertCircle, BarChart3 } from "lucide-react";

interface StatisticsResponse {
    success: boolean;
    message: string;
    data: {
        totalUsers: number;
        newUsersToday: number;
        startDate: string;
        endDate: string;
        newUsersByDay: Array<{ date: string; count: number }>;
        cumulativeByDay: Array<{ date: string; cumulative: number }>;
        chartData: {
            labels: string[];
            datasets: Array<{ label: string; data: number[] }>;
        };
        meta: {
            days: number;
            avgPerDay: number;
        };
    };
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<StatisticsResponse["data"] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [days, setDays] = useState("30");

    const fetchStatistics = async () => {
        setLoading(true);
        setError("");

        try {
            // Build query params
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
            if (!startDate && !endDate && days) params.append("days", days);

            const response = await axios.get(`/account/statistics?${params.toString()}`);

            if (response.data.success && response.data.data) {
                setStats(response.data.data);
            } else {
                setError(response.data.message || "Không thể lấy thống kê người dùng.");
            }
        } catch {
            setError("Không thể kết nối đến máy chủ.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const statCards = stats ? [
        {
            title: "Tổng người dùng",
            value: stats.totalUsers.toLocaleString('vi-VN'),
            icon: Users,
            gradient: "from-blue-500 to-cyan-500",
            iconBg: "bg-blue-500/10",
            change: "+12.5%",
            changePositive: true
        },
        {
            title: "Người dùng mới hôm nay",
            value: stats.newUsersToday.toLocaleString('vi-VN'),
            icon: UserPlus,
            gradient: "from-green-500 to-emerald-500",
            iconBg: "bg-green-500/10",
            change: "+8.3%",
            changePositive: true
        },
        {
            title: "Trung bình mỗi ngày",
            value: Math.round(stats.meta.avgPerDay).toLocaleString('vi-VN'),
            icon: TrendingUp,
            gradient: "from-purple-500 to-pink-500",
            iconBg: "bg-purple-500/10",
            change: "+5.2%",
            changePositive: true
        },
        {
            title: "Tổng số ngày theo dõi",
            value: stats.meta.days.toLocaleString('vi-VN'),
            icon: Calendar,
            gradient: "from-orange-500 to-red-500",
            iconBg: "bg-orange-500/10",
            change: stats.startDate,
            changePositive: null
        },
    ] : [];

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold bg-linear-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                            Dashboard
                        </h1>
                        <p className="text-slate-600 flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Tổng quan hệ thống người dùng
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={fetchStatistics}
                            disabled={loading}
                            className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Làm mới
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i} className="border-none shadow-lg">
                                <CardContent className="p-6">
                                    <Skeleton className="h-20 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : error ? (
                    <Alert variant="destructive" className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statCards.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <Card
                                    key={index}
                                    className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden group"
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-3 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="h-6 w-6" style={{
                                                    background: `linear-gradient(to bottom right, ${stat.gradient.includes('blue') ? '#3b82f6, #06b6d4' : stat.gradient.includes('green') ? '#10b981, #059669' : stat.gradient.includes('purple') ? '#8b5cf6, #ec4899' : '#f97316, #ef4444'})`,
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    backgroundClip: 'text'
                                                }} />
                                            </div>
                                            {stat.changePositive !== null && (
                                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.changePositive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {stat.change}
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-slate-600">
                                                {stat.title}
                                            </p>
                                            <p className="text-3xl font-bold text-slate-900">
                                                {stat.value}
                                            </p>
                                            {stat.changePositive === null && (
                                                <p className="text-xs text-slate-500 mt-2">
                                                    Từ {stat.change}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Date Range Filter */}
                <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader className="border-b bg-linear-to-r from-slate-50 to-blue-50">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                            <div>
                                <CardTitle className="text-lg">Bộ lọc thời gian</CardTitle>
                                <CardDescription>Tùy chỉnh khoảng thời gian để xem thống kê chi tiết</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate" className="text-sm font-medium text-slate-700">
                                        Ngày bắt đầu
                                    </Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => {
                                            setStartDate(e.target.value);
                                            if (e.target.value) setDays("");
                                        }}
                                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate" className="text-sm font-medium text-slate-700">
                                        Ngày kết thúc
                                    </Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => {
                                            setEndDate(e.target.value);
                                            if (e.target.value) setDays("");
                                        }}
                                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="days" className="text-sm font-medium text-slate-700">
                                        Số ngày gần đây
                                    </Label>
                                    <Input
                                        id="days"
                                        type="number"
                                        value={days}
                                        onChange={(e) => {
                                            setDays(e.target.value);
                                            if (e.target.value) {
                                                setStartDate("");
                                                setEndDate("");
                                            }
                                        }}
                                        placeholder="30"
                                        min="1"
                                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={fetchStatistics}
                                    disabled={loading}
                                    className="flex-1 md:flex-initial bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                >
                                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                    {loading ? "Đang tải..." : "Áp dụng"}
                                </Button>
                                <Button
                                    onClick={() => {
                                        setStartDate("");
                                        setEndDate("");
                                        setDays("30");
                                        setTimeout(() => fetchStatistics(), 100);
                                    }}
                                    variant="outline"
                                    disabled={loading}
                                    className="flex-1 md:flex-initial border-slate-300 hover:bg-slate-100"
                                >
                                    Đặt lại
                                </Button>
                            </div>

                            <div className="flex items-start gap-3 p-4 rounded-xl bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100">
                                <div className="text-2xl">💡</div>
                                <div className="space-y-2 text-sm text-slate-700">
                                    <p><strong className="text-blue-700">Tùy chọn 1:</strong> Chọn ngày bắt đầu và kết thúc để xem thống kê trong khoảng thời gian cụ thể</p>
                                    <p><strong className="text-indigo-700">Tùy chọn 2:</strong> Nhập số ngày để xem thống kê trong N ngày gần nhất (mặc định: 30 ngày)</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Chart Section */}
                {stats && (
                    <div className="space-y-6">
                        {/* Main Chart */}
                        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="border-b bg-linear-to-r from-slate-50 to-purple-50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-bold text-slate-900">
                                            Biểu đồ tăng trưởng
                                        </CardTitle>
                                        <CardDescription className="text-slate-600">
                                            Tổng số người dùng tích lũy theo thời gian
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100">
                                        <div className="w-3 h-3 rounded-full bg-linear-to-r from-purple-500 to-pink-500"></div>
                                        <span className="text-sm font-medium text-purple-700">Tích lũy</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="h-[400px] w-full">
                                    <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet">
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                                                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.05" />
                                            </linearGradient>
                                            <filter id="glow">
                                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur" />
                                                    <feMergeNode in="SourceGraphic" />
                                                </feMerge>
                                            </filter>
                                        </defs>

                                        {/* Grid */}
                                        {[0, 1, 2, 3, 4, 5].map((i) => {
                                            const maxCount = Math.max(...stats.cumulativeByDay.map(d => d.cumulative), 1);
                                            const value = Math.floor(maxCount - (i * maxCount / 5));
                                            return (
                                                <g key={i}>
                                                    <line
                                                        x1="80" y1={50 + (i * 55)}
                                                        x2="950" y2={50 + (i * 55)}
                                                        stroke="#e2e8f0"
                                                        strokeWidth="1"
                                                        strokeDasharray="4 4"
                                                    />
                                                    <text
                                                        x="65" y={55 + (i * 55)}
                                                        textAnchor="end"
                                                        className="text-xs fill-slate-500 font-medium"
                                                    >
                                                        {value.toLocaleString('vi-VN')}
                                                    </text>
                                                </g>
                                            );
                                        })}

                                        {/* Area fill */}
                                        <path
                                            d={`M 80,325 ${stats.cumulativeByDay.map((item, index) => {
                                                const maxCount = Math.max(...stats.cumulativeByDay.map(d => d.cumulative), 1);
                                                const x = 80 + (index / Math.max(stats.cumulativeByDay.length - 1, 1)) * 870;
                                                const y = 325 - ((item.cumulative / maxCount) * 275);
                                                return `L ${x},${y}`;
                                            }).join(' ')} L 950,325 Z`}
                                            fill="url(#chartGradient)"
                                        />

                                        {/* Line */}
                                        <path
                                            d={`M ${stats.cumulativeByDay.map((item, index) => {
                                                const maxCount = Math.max(...stats.cumulativeByDay.map(d => d.cumulative), 1);
                                                const x = 80 + (index / Math.max(stats.cumulativeByDay.length - 1, 1)) * 870;
                                                const y = 325 - ((item.cumulative / maxCount) * 275);
                                                return index === 0 ? `${x},${y}` : `L ${x},${y}`;
                                            }).join(' ')}`}
                                            fill="none"
                                            stroke="url(#lineGradient)"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            filter="url(#glow)"
                                        />
                                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#8b5cf6" />
                                            <stop offset="100%" stopColor="#ec4899" />
                                        </linearGradient>

                                        {/* Data points */}
                                        {stats.cumulativeByDay.length > 0 && stats.cumulativeByDay.map((item, index) => {
                                            const maxCount = Math.max(...stats.cumulativeByDay.map(d => d.cumulative), 1);
                                            const x = 80 + (index / Math.max(stats.cumulativeByDay.length - 1, 1)) * 870;
                                            const y = 325 - ((item.cumulative / maxCount) * 275);
                                            const showPoint = index === 0 ||
                                                index === stats.cumulativeByDay.length - 1 ||
                                                index % Math.max(Math.floor(stats.cumulativeByDay.length / 8), 1) === 0;
                                            if (!showPoint) return null;

                                            return (
                                                <g key={index} className="cursor-pointer">
                                                    <circle cx={x} cy={y} r="8" fill="white" stroke="#8b5cf6" strokeWidth="3" />
                                                    <circle cx={x} cy={y} r="4" fill="#8b5cf6" />
                                                    <title>{new Date(item.date).toLocaleDateString('vi-VN')} - {item.cumulative.toLocaleString('vi-VN')} người</title>
                                                </g>
                                            );
                                        })}

                                        {/* X-axis labels */}
                                        {stats.cumulativeByDay.length > 0 && stats.cumulativeByDay.map((item, index) => {
                                            const interval = Math.max(Math.ceil(stats.cumulativeByDay.length / 6), 1);
                                            if (index % interval !== 0 && index !== stats.cumulativeByDay.length - 1) return null;
                                            const x = 80 + (index / Math.max(stats.cumulativeByDay.length - 1, 1)) * 870;
                                            return (
                                                <text
                                                    key={index}
                                                    x={x} y="350"
                                                    textAnchor="middle"
                                                    className="text-xs fill-slate-500 font-medium"
                                                >
                                                    {new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                                                </text>
                                            );
                                        })}

                                        {/* Axes */}
                                        <line x1="80" y1="325" x2="950" y2="325" stroke="#cbd5e1" strokeWidth="2" />
                                        <line x1="80" y1="50" x2="80" y2="325" stroke="#cbd5e1" strokeWidth="2" />
                                    </svg>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bottom Stats */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardHeader className="border-b bg-linear-to-r from-slate-50 to-green-50">
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-green-600" />
                                        Thống kê nổi bật
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-3">
                                    <div className="p-4 rounded-xl bg-linear-to-r from-blue-50 to-cyan-50 border border-blue-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-700">Tổng người dùng</span>
                                            <span className="text-2xl font-bold text-blue-700">{stats.totalUsers.toLocaleString('vi-VN')}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-linear-to-r from-green-50 to-emerald-50 border border-green-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-700">Mới hôm nay</span>
                                            <span className="text-2xl font-bold text-green-700">{stats.newUsersToday.toLocaleString('vi-VN')}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-linear-to-r from-purple-50 to-pink-50 border border-purple-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-700">Trung bình/ngày</span>
                                            <span className="text-2xl font-bold text-purple-700">{stats.meta.avgPerDay.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardHeader className="border-b bg-linear-to-r from-slate-50 to-orange-50">
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-orange-600" />
                                        5 ngày gần nhất
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-3">
                                    {stats.cumulativeByDay.length > 0 ? (
                                        stats.cumulativeByDay.slice(-5).reverse().map((item, index) => (
                                            <div
                                                key={index}
                                                className="p-4 rounded-xl bg-linear-to-r from-slate-50 to-slate-100 border border-slate-200 hover:border-slate-300 transition-all"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-slate-700">
                                                        {new Date(item.date).toLocaleDateString('vi-VN', {
                                                            weekday: 'short',
                                                            day: '2-digit',
                                                            month: '2-digit'
                                                        })}
                                                    </span>
                                                    <span className="text-xl font-bold text-slate-900">
                                                        {item.cumulative.toLocaleString('vi-VN')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-slate-500 py-8">
                                            Không có dữ liệu
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}