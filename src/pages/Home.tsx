import ArticleCard from "@/components/ArticleCard"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useMemo } from "react"
import axios from "@/lib/axios"
import { Link } from "react-router-dom"

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('')
    // Data mẫu cho bài viết nổi bật
    const popularArticles: Post[] = [
        {
            _id: 'pop1',
            title: 'Kinh tế số Việt Nam: Xu hướng và thách thức',
            summary: 'Phân tích sự phát triển của kinh tế số tại Việt Nam trong thập kỷ tới.',
            images: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&h=600&fit=crop'],
            tags: ['Kinh tế số', 'Xu hướng'],
            publishedAt: '2025-11-01',
            userId: { name: 'Nguyễn Văn A', avatar: '' },
            readTime: '7 phút đọc',
        },
        {
            _id: 'pop2',
            title: 'Chuyển đổi xanh trong doanh nghiệp Việt',
            summary: 'Doanh nghiệp Việt Nam đang làm gì để thích ứng với xu hướng chuyển đổi xanh toàn cầu?',
            images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop'],
            tags: ['Chuyển đổi xanh', 'Doanh nghiệp'],
            publishedAt: '2025-10-25',
            userId: { name: 'Trần Thị B', avatar: '' },
            readTime: '5 phút đọc',
        },
        {
            _id: 'pop3',
            title: 'Thị trường lao động Việt Nam sau đại dịch',
            summary: 'Những thay đổi lớn về cung cầu lao động và xu hướng tuyển dụng mới.',
            images: ['https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=600&fit=crop'],
            tags: ['Lao động', 'Đại dịch'],
            publishedAt: '2025-09-15',
            userId: { name: 'Lê Văn C', avatar: '' },
            readTime: '6 phút đọc',
        },
    ];
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
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [limit] = useState(9)

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true)
            try {
                const res = await axios.get('/posts', { params: { page: currentPage, limit } })
                const apiData = res.data?.data
                let loadedPosts = apiData?.posts || []
                // Nếu không có bài viết từ API, thêm bài viết mẫu
                if (loadedPosts.length === 0) {
                    loadedPosts = [
                        {
                            _id: 'sample1',
                            title: 'Vai trò của Fintech trong nền kinh tế Việt Nam',
                            summary: 'Fintech đang thay đổi cách tiếp cận tài chính của người dân và doanh nghiệp.',
                            content: '<p>Fintech đang thay đổi cách tiếp cận tài chính của người dân và doanh nghiệp Việt Nam, mở ra nhiều cơ hội mới cho nền kinh tế.</p>',
                            images: ['https://images.unsplash.com/photo-1465101178521-c1a6f3b5f0a0?w=800&h=600&fit=crop'],
                            tags: ['Fintech', 'Tài chính'],
                            publishedAt: '2025-08-10',
                            userId: { name: 'Ngô Minh D', avatar: '' },
                            readTime: '6 phút đọc',
                        },
                        {
                            _id: 'sample2',
                            title: 'Khởi nghiệp đổi mới sáng tạo tại Việt Nam',
                            summary: 'Những xu hướng mới trong hệ sinh thái startup Việt Nam.',
                            content: '<p>Khởi nghiệp đổi mới sáng tạo đang là xu hướng phát triển mạnh mẽ tại Việt Nam, thu hút nhiều nguồn lực và ý tưởng mới.</p>',
                            images: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&h=600&fit=crop'],
                            tags: ['Startup', 'Đổi mới'],
                            publishedAt: '2025-07-22',
                            userId: { name: 'Phạm Thảo', avatar: '' },
                            readTime: '7 phút đọc',
                        },
                        {
                            _id: 'sample3',
                            title: 'Thương mại điện tử và sự phát triển bền vững',
                            summary: 'Thương mại điện tử thúc đẩy tăng trưởng kinh tế nhưng cũng đặt ra nhiều thách thức.',
                            content: '<p>Thương mại điện tử thúc đẩy tăng trưởng kinh tế nhưng cũng đặt ra nhiều thách thức về quản lý và phát triển bền vững.</p>',
                            images: ['https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=600&fit=crop'],
                            tags: ['Thương mại điện tử', 'Bền vững'],
                            publishedAt: '2025-06-30',
                            userId: { name: 'Lý Quốc H', avatar: '' },
                            readTime: '5 phút đọc',
                        },
                    ]
                }
                setPosts(loadedPosts)
                setTotalPages(apiData?.pagination?.totalPages || 1)
            } catch {
                // Nếu lỗi, cũng hiển thị bài viết mẫu
                setPosts([
                    {
                        _id: 'sample1',
                        title: 'Vai trò của Fintech trong nền kinh tế Việt Nam',
                        summary: 'Fintech đang thay đổi cách tiếp cận tài chính của người dân và doanh nghiệp.',
                        content: '<p>Fintech đang thay đổi cách tiếp cận tài chính của người dân và doanh nghiệp Việt Nam, mở ra nhiều cơ hội mới cho nền kinh tế.</p>',
                        images: ['https://images.unsplash.com/photo-1465101178521-c1a6f3b5f0a0?w=800&h=600&fit=crop'],
                        tags: ['Fintech', 'Tài chính'],
                        publishedAt: '2025-08-10',
                        userId: { name: 'Ngô Minh D', avatar: '' },
                        readTime: '6 phút đọc',
                    },
                    {
                        _id: 'sample2',
                        title: 'Khởi nghiệp đổi mới sáng tạo tại Việt Nam',
                        summary: 'Những xu hướng mới trong hệ sinh thái startup Việt Nam.',
                        content: '<p>Khởi nghiệp đổi mới sáng tạo đang là xu hướng phát triển mạnh mẽ tại Việt Nam, thu hút nhiều nguồn lực và ý tưởng mới.</p>',
                        images: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&h=600&fit=crop'],
                        tags: ['Startup', 'Đổi mới'],
                        publishedAt: '2025-07-22',
                        userId: { name: 'Phạm Thảo', avatar: '' },
                        readTime: '7 phút đọc',
                    },
                    {
                        _id: 'sample3',
                        title: 'Thương mại điện tử và sự phát triển bền vững',
                        summary: 'Thương mại điện tử thúc đẩy tăng trưởng kinh tế nhưng cũng đặt ra nhiều thách thức.',
                        content: '<p>Thương mại điện tử thúc đẩy tăng trưởng kinh tế nhưng cũng đặt ra nhiều thách thức về quản lý và phát triển bền vững.</p>',
                        images: ['https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=600&fit=crop'],
                        tags: ['Thương mại điện tử', 'Bền vững'],
                        publishedAt: '2025-06-30',
                        userId: { name: 'Lý Quốc H', avatar: '' },
                        readTime: '5 phút đọc',
                    },
                ])
                setTotalPages(1)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPosts()
    }, [currentPage, limit])

    const filteredArticles = useMemo(() => {
        const q = searchQuery.trim().toLowerCase()
        if (!q) return posts
        return posts.filter(article => {
            const inTitle = article.title?.toLowerCase().includes(q)
            const inSummary = article.summary?.toLowerCase().includes(q)
            return inTitle || inSummary
        })
    }, [posts, searchQuery])

    return (
        <div className="space-y-10">
            {/* Banner Section */}
            <section className="relative h-[260px] md:h-80 w-full flex items-center justify-center overflow-hidden rounded-xl shadow-lg mb-2">
                <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=400&fit=crop"
                    alt="Banner"
                    className="absolute inset-0 w-full h-full object-cover object-center z-0"
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/40 z-10" />
                <div className="relative z-20 text-center px-6">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-3 animate-in fade-in duration-700">
                        Chào mừng đến với MLN122 Blog
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 font-medium drop-shadow mb-4 animate-in slide-in-from-right duration-700">
                        Nơi chia sẻ kiến thức, phân tích kinh tế và cập nhật xu hướng mới nhất tại Việt Nam
                    </p>
                    <div className="inline-block mt-2 px-4 py-2 rounded-full bg-primary text-white font-semibold shadow-lg animate-in slide-in-from-left duration-700">
                        Khám phá bài viết nổi bật
                    </div>
                </div>
            </section>
            <section className="space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Tất cả bài viết</h1>
                    <p className="text-muted-foreground mt-2">Khám phá các bài viết mới nhất từ cộng đồng</p>
                </div>
                <div className="max-w-2xl mx-auto">
                    <Input
                        placeholder="Tìm kiếm bài viết theo tiêu đề hoặc tóm tắt..."
                        className="pl-4 h-12 text-base border-2 focus:border-primary shadow-sm rounded-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </section>

            {/* Popular Articles Section */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-primary">Bài viết mới đăng</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {popularArticles.map((a) => (
                        <ArticleCard
                            key={a._id}
                            id={a._id}
                            title={a.title}
                            excerpt={a.summary}
                            date={a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Chưa có ngày'}
                            tags={a.tags}
                            author={a.userId?.name}
                            authorAvatar={a.userId?.avatar}
                            readTime={a.readTime}
                            image={a.images && a.images.length > 0 ? a.images[0] : undefined}
                        />
                    ))}
                </div>
            </section>

            {/* Articles Grid - 3 columns */}
            <section>
                {isLoading ? (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground">Đang tải bài viết...</p>
                    </div>
                ) : filteredArticles.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                ) : posts.length === 0 ? (
                    <div className="text-center py-16 bg-muted/30 rounded-xl border-2 border-dashed">
                        <p className="text-muted-foreground text-lg">Chưa có bài viết nào</p>
                    </div>
                ) : (
                    <div className="text-center py-16 bg-muted/30 rounded-xl border-2 border-dashed">
                        <p className="text-muted-foreground text-lg">Không tìm thấy bài viết nào phù hợp</p>
                        <p className="text-muted-foreground text-sm mt-2">Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác</p>
                    </div>
                )}
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-6">
                    <button
                        className="px-4 py-2 rounded border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        Trang trước
                    </button>
                    <span className="text-sm text-muted-foreground">
                        Trang {currentPage} / {totalPages}
                    </span>
                    <button
                        className="px-4 py-2 rounded border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Trang sau
                    </button>
                </div>
            )}
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
            {/* End list */}
        </div>
    )
}
