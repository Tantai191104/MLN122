import ArticleCard from "@/components/ArticleCard"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useMemo } from "react"
import { articleService } from "@/services/articleService"
import { Link } from "react-router-dom"

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('')

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
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const categories = useMemo(() => {
        const s = new Set<string>()
        posts.forEach(p => {
            if (p.tags && p.tags.length > 0) p.tags.forEach(t => s.add(t))
        })
        return Array.from(s)
    }, [posts])

    // derive popular lists from API-fetched posts
    const popularArticles = useMemo(() => {
        const featured = posts.filter(p => p.featured);
        if (featured.length >= 3) return featured.slice(0, 3);
        return posts.slice(0, 3);
    }, [posts]);
    const popularPosts = useMemo(() => {
        const excludeIds = new Set(popularArticles.map(p => p._id));
        return posts
            .filter(p => !excludeIds.has(p._id))
            .slice(0, 6)
            .map(p => ({
                id: p._id,
                title: p.title || 'Không có tiêu đề',
                excerpt: p.summary || p.excerpt || 'Không có mô tả',
                date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : (p.date || 'Chưa có ngày'),
                tags: p.tags || ['Chưa có tag'],
                author: p.userId?.name || p.author || 'Admin',
                readTime: p.readTime || '5 phút đọc',
                category: (p.tags && p.tags.length > 0) ? p.tags[0] : 'Khác',
                image: p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'
            }))
    }, [posts, popularArticles])

    // visibleArticles: main grid should exclude posts shown above (dedupe)
    const visibleArticles = useMemo(() => {
        const exclude = new Set<string>();
        popularArticles.forEach(p => exclude.add(p._id));
        popularPosts.forEach(p => exclude.add(p.id));
        // apply search filter on posts first
        const q = searchQuery.trim().toLowerCase();
        const base = !q ? posts : posts.filter(article => {
            const inTitle = article.title?.toLowerCase().includes(q)
            const inSummary = article.summary?.toLowerCase().includes(q)
            return inTitle || inSummary
        })
        return base.filter(p => !exclude.has(p._id))
    }, [posts, searchQuery, popularArticles, popularPosts])

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true)
            try {
                // use centralized service which wraps axiosInstance
                const res = await articleService.getPosts({ page: currentPage, limit, category: selectedCategory || undefined })
                // backend shape: { success, message, data: { posts: [], pagination: {...} } }
                const apiData = res?.data || res
                const loadedPosts = apiData?.posts || apiData || []
                setPosts(loadedPosts)
                const total = apiData?.pagination?.totalPages || apiData?.totalPages || 1
                setTotalPages(total)
            } catch {
                // on error, show empty list
                setPosts([])
                setTotalPages(1)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPosts()
    }, [currentPage, limit, selectedCategory])

    // (filtered logic is applied inside visibleArticles to ensure dedupe)

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
            {/* <section className="space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Tất cả bài viết</h1>
                    <p className="text-muted-foreground mt-2">Khám phá các bài viết mới nhất từ cộng đồng</p>
                </div>
                <div className="max-w-2xl mx-auto">
                    <div className="flex gap-3">
                        <select
                            className="h-12 px-3 rounded-lg border-2 bg-background"
                            value={selectedCategory}
                            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="">Tất cả chuyên mục</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <Input
                            placeholder="Tìm kiếm bài viết theo tiêu đề hoặc tóm tắt..."
                            className="pl-4 h-12 text-base border-2 focus:border-primary shadow-sm rounded-lg flex-1"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </section> */}

            {/* Popular Articles Section */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-primary">Bài viết mới đăng</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {popularArticles.map((a) => (
                        <div key={a._id} className="relative h-full">
                            <div className="absolute top-3 right-3 z-10">
                                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">Nổi bật</span>
                            </div>
                            <ArticleCard
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
                        </div>
                    ))}
                </div>
            </section>

            {/* Articles Grid - 3 columns */}
            <section>
                {isLoading ? (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground">Đang tải bài viết...</p>
                    </div>
                ) : visibleArticles.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visibleArticles.map((a) => (
                            <div key={a._id || 'unknown'} className="h-full">
                                <ArticleCard
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
                            </div>
                        ))}
                    </div>
                ) : null}
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
                    <Link to="/posts">
                        <button className="bg-primary text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
                            Xem tất cả
                        </button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {popularPosts.map((post) => (
                        <div key={post.id} className="group cursor-pointer">
                            <div className="relative overflow-hidden rounded-xl mb-4 aspect-video bg-linear-to-br from-muted to-muted/50">
                                <div className="absolute top-3 left-3 z-10">
                                    <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">Phổ biến</span>
                                </div>
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
