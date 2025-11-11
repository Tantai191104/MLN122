import ArticleCard from "@/components/ArticleCard"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useMemo } from "react"
import axios from "@/lib/axios"

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

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true)
            try {
                const res = await axios.get('/posts', { params: { page: currentPage, limit } })
                const apiData = res.data?.data
                setPosts(apiData?.posts || [])
                setTotalPages(apiData?.pagination?.totalPages || 1)
            } catch {
                setPosts([])
                setTotalPages(1)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPosts()
    }, [currentPage])

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
            {/* End list */}
        </div>
    )
}
