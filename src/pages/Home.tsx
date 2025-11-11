import ArticleCard from "@/components/ArticleCard"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "@/lib/axios"
import { Link } from "react-router-dom"
const categories = ['Tất cả', 'Kinh tế số', 'Chuyển đổi số', 'Bất động sản', 'Đầu tư', 'Chính sách', 'E-commerce']
const popularPosts = [
    {
        id: '1',
        title: 'Tác động của chính sách tiền tệ đến kinh tế Việt Nam',
        excerpt: 'Phân tích các chính sách tiền tệ mới và ảnh hưởng của chúng đến tăng trưởng kinh tế, lạm phát và đầu tư tại Việt Nam.',
        date: '01 tháng 11, 2025',
        tags: ['Kinh tế', 'Chính sách'],
        author: 'Nguyễn Văn A',
        readTime: '7 phút đọc',
        category: 'Kinh tế',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop'
    },
    {
        id: '2',
        title: 'Vai trò của chính trị trong phát triển kinh tế quốc gia',
        excerpt: 'Bài viết bàn về mối quan hệ giữa chính trị ổn định và sự phát triển kinh tế bền vững, các ví dụ thực tiễn từ Việt Nam và thế giới.',
        date: '05 tháng 11, 2025',
        tags: ['Chính trị', 'Kinh tế'],
        author: 'Trần Thị B',
        readTime: '6 phút đọc',
        category: 'Chính trị',
        image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600&h=400&fit=crop'
    },
    {
        id: '3',
        title: 'Thách thức và cơ hội cho kinh tế Việt Nam trong bối cảnh toàn cầu hóa',
        excerpt: 'Toàn cầu hóa mang lại nhiều cơ hội nhưng cũng đặt ra không ít thách thức cho nền kinh tế Việt Nam. Bài viết phân tích sâu các yếu tố này.',
        date: '10 tháng 11, 2025',
        tags: ['Kinh tế', 'Toàn cầu hóa'],
        author: 'Lê Văn C',
        readTime: '8 phút đọc',
        category: 'Kinh tế',
        image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=600&h=400&fit=crop'
    },
    {
        id: '4',
        title: 'Chính sách phát triển bền vững và kinh tế xanh',
        excerpt: 'Khám phá các chính sách phát triển bền vững, kinh tế xanh và tác động của chúng đến môi trường và xã hội Việt Nam.',
        date: '11 tháng 11, 2025',
        tags: ['Chính sách', 'Kinh tế xanh'],
        author: 'Phạm Thị D',
        readTime: '5 phút đọc',
        category: 'Chính sách',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop'
    },
    {
        id: '5',
        title: 'Ảnh hưởng của chính trị quốc tế đến kinh tế Việt Nam',
        excerpt: 'Phân tích các biến động chính trị quốc tế và tác động của chúng đến nền kinh tế Việt Nam trong năm 2025.',
        date: '09 tháng 11, 2025',
        tags: ['Chính trị', 'Kinh tế quốc tế'],
        author: 'Vũ Văn E',
        readTime: '6 phút đọc',
        category: 'Chính trị',
        image: 'https://images.unsplash.com/photo-1465101178521-c1a6bca7a0c1?w=600&h=400&fit=crop'
    },
    {
        id: '6',
        title: 'Đổi mới sáng tạo trong chính sách kinh tế Việt Nam',
        excerpt: 'Bài viết trình bày các xu hướng đổi mới sáng tạo trong chính sách kinh tế, các giải pháp thúc đẩy tăng trưởng và phát triển.',
        date: '08 tháng 11, 2025',
        tags: ['Kinh tế', 'Đổi mới'],
        author: 'Đặng Thị F',
        readTime: '7 phút đọc',
        category: 'Kinh tế',
        image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600&h=400&fit=crop'
    },
]
export default function Home() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Tất cả')
    type Post = {
        _id: string;
        title: string;
        summary: string;
        excerpt?: string;
        content?: string;
        images?: string[];
        tags?: string[];
        date?: string;
        author?: string;
        readTime?: string;
        featured?: boolean;
        publishedAt?: string;
        userId?: {
            name?: string;
            avatar?: string;
        };
    };
    const [posts, setPosts] = useState<Post[]>([])
    // Removed unused loading and error states

    useEffect(() => {
        axios.get('/posts?page=1&limit=10')
            .then(res => {
                setPosts(res.data?.data?.posts || [])
            })
            .catch(() => {
                setPosts([])
            })
    }, [])

    const filteredArticles = posts.filter(article => {
        const matchesSearch = article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.summary?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'Tất cả' || (article.tags && article.tags.includes(selectedCategory))
        return matchesSearch && matchesCategory
    })

    return (
        <div className="space-y-12">
            {/* Hero Section - Featured Post */}
            <section className="relative overflow-hidden rounded-2xl shadow-2xl">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img
                        src={filteredArticles[0]?.images?.[0] || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop'}
                        alt={filteredArticles[0]?.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/40"></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48cGF0aCBkPSJNMCAzOGgyYTM4IDM4IDAgMCAwIDM4LTM4djJhMzggMzggMCAwIDEtMzggMzhaIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-50"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 max-w-3xl">
                    <Badge className="mb-4 bg-primary text-white border-0 hover:bg-primary/90 text-sm px-4 py-1.5 shadow-lg">
                        ⭐ Bài viết nổi bật
                    </Badge>

                    {filteredArticles[0]?.tags && filteredArticles[0].tags.length > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs text-white/90 font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                                {filteredArticles[0].tags[0]}
                            </span>
                            {filteredArticles[0]?.date && (
                                <span className="text-xs text-white/70">
                                    • {new Date(filteredArticles[0].publishedAt || filteredArticles[0].date).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </span>
                            )}
                        </div>
                    )}

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
                        {filteredArticles[0]?.title || 'Tương lai của Kinh tế Việt Nam trong Kỷ nguyên Số'}
                    </h1>

                    <p className="text-base md:text-xl text-white/95 mb-8 leading-relaxed line-clamp-2 drop-shadow-md">
                        {filteredArticles[0]?.summary || 'Phân tích sâu về xu hướng chuyển đổi số đang định hình lại nền kinh tế Việt Nam...'}
                    </p>

                    <div className="flex items-center gap-4 flex-wrap">
                        <Link to={`/article/${filteredArticles[0]?._id || '1'}`}>
                            <button className="bg-primary text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-primary/90 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1">
                                Đọc ngay →
                            </button>
                        </Link>

                        {filteredArticles[0]?.userId?.name && (
                            <div className="flex items-center gap-3 text-white/90">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-2 border-white/30">
                                    {filteredArticles[0]?.userId?.avatar ? (
                                        <img src={filteredArticles[0].userId.avatar} alt={filteredArticles[0].userId.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-white font-semibold text-sm">
                                            {filteredArticles[0].userId.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold drop-shadow">{filteredArticles[0].userId.name}</p>
                                    <p className="text-xs text-white/70">{filteredArticles[0]?.readTime || '5 phút đọc'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Search and Filter Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl md:text-3xl font-bold">Bài viết gần đây</h2>
                    <button className="text-primary font-semibold hover:underline text-sm md:text-base">
                        Xem tất cả →
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary group-focus-within:scale-110 transition-transform" />
                        <Input
                            placeholder="Tìm kiếm bài viết theo tiêu đề hoặc nội dung..."
                            className="pl-12 h-12 text-base border-2 focus:border-primary shadow-sm rounded-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        {categories.map(cat => (
                            <Badge
                                key={cat}
                                variant={selectedCategory === cat ? "default" : "outline"}
                                className="cursor-pointer px-4 py-2 text-sm hover:scale-105 transition-transform"
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </Badge>
                        ))}
                    </div>
                </div>
            </section>

            {/* Articles Grid - 3 columns */}
            <section>
                {filteredArticles.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-6">
                        {filteredArticles.map((a) => (
                            <ArticleCard
                                key={a._id || 'unknown'}
                                id={a._id || 'unknown'}
                                title={a.title || 'Không có tiêu đề'}
                                excerpt={a.summary || a.excerpt || 'Không có mô tả'}
                                date={a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : (a.date || 'Chưa có ngày')}
                                tags={a.tags && a.tags.length > 0 ? a.tags : ['Chưa có tag']}
                                author={a.userId?.name || a.author || 'Admin'}
                                authorAvatar={a.userId?.avatar || undefined}
                                readTime={a.readTime || '5 phút đọc'}
                                image={a.images && a.images.length > 0 ? a.images[0] : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'}
                                compact
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-muted/30 rounded-xl border-2 border-dashed">
                        <p className="text-muted-foreground text-lg">Không tìm thấy bài viết nào phù hợp</p>
                        <p className="text-muted-foreground text-sm mt-2">Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác</p>
                    </div>
                )}
            </section>
            {/* Popular Post Section */}
            <section className="space-y-6 py-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl md:text-3xl font-bold">Bài viết phổ biến</h2>
                    <Link to="/about">
                        <button className="bg-primary text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
                            Xem tất cả
                        </button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {popularPosts.map((post) => (
                        <div key={post.id} className="group cursor-pointer">
                            <div className="relative overflow-hidden rounded-xl mb-4 aspect-video bg-linear-to-br from-muted to-muted/50">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="font-semibold text-foreground uppercase tracking-wide">{post.category}</span>
                                    <span className="text-muted-foreground">{post.date}</span>
                                </div>

                                <Link to={`/article/${post.id}`}>
                                    <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                </Link>

                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                    {post.excerpt}
                                </p>

                                <Link to={`/article/${post.id}`}>
                                    <button className="text-primary font-semibold text-sm hover:underline mt-2">
                                        Đọc thêm...
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
