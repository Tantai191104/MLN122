import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ArticleCard from '@/components/ArticleCard'
import { articleService } from '@/services/articleService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react'

interface Post {
    _id: string
    title: string
    summary: string
    content?: string
    images?: string[]
    tags?: string[]
    publishedAt?: string
    createdAt?: string
    userId?: {
        _id: string
        name?: string
        email?: string
        avatar?: string
    }
    readTime?: string
}

interface PaginationData {
    currentPage: number
    totalPages: number
    totalPosts: number
    limit: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

interface PostsResponse {
    success: boolean
    message: string
    data: {
        posts: Post[]
        pagination: PaginationData
    }
}

export default function AllPosts() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [posts, setPosts] = useState<Post[]>([])
    const [pagination, setPagination] = useState<PaginationData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

    const currentPage = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '12', 10)

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const response = await articleService.getPosts({
                    page: currentPage,
                    limit: limit,
                    search: searchQuery || undefined,
                }) as PostsResponse

                if (response.success && response.data) {
                    setPosts(response.data.posts || [])
                    setPagination(response.data.pagination)
                } else {
                    // Fallback for different response format
                    const postsData = (response as any).posts || (response as any).data?.posts || []
                    setPosts(postsData)
                    if ((response as any).pagination) {
                        setPagination((response as any).pagination)
                    } else if ((response as any).data?.pagination) {
                        setPagination((response as any).data.pagination)
                    }
                }
            } catch (err) {
                console.error('Error fetching posts:', err)
                setError('Không thể tải danh sách bài viết')
                setPosts([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchPosts()
    }, [currentPage, limit, searchQuery])

    // Filter posts by search query (client-side fallback if API doesn't support search)
    const filteredPosts = useMemo(() => {
        if (!searchQuery.trim()) {
            return posts
        }

        const query = searchQuery.toLowerCase().trim()
        return posts.filter((post) => {
            const titleMatch = post.title?.toLowerCase().includes(query)
            const tagMatch = post.tags?.some(tag => tag.toLowerCase().includes(query))
            return titleMatch || tagMatch
        })
    }, [posts, searchQuery])

    const handlePageChange = (newPage: number) => {
        const params: Record<string, string> = {
            page: newPage.toString(),
            limit: limit.toString(),
        }
        if (searchQuery.trim()) {
            params.search = searchQuery.trim()
        }
        setSearchParams(params)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleSearchChange = (value: string) => {
        setSearchQuery(value)
        // Reset to page 1 when search changes
        const params: Record<string, string> = {
            page: '1',
            limit: limit.toString(),
        }
        if (value.trim()) {
            params.search = value.trim()
        }
        setSearchParams(params)
    }

    const handleClearSearch = () => {
        setSearchQuery('')
        setSearchParams({ page: '1', limit: limit.toString() })
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Chưa có ngày'
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Tất cả bài viết</h1>
                    <p className="text-muted-foreground mt-2">
                        Khám phá các bài viết mới nhất từ cộng đồng
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm theo tiêu đề hoặc tag..."
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="pl-10 pr-10 h-12 text-base border-2 focus:border-primary shadow-sm rounded-lg"
                        />
                        {searchQuery && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>

                {pagination && (
                    <p className="text-sm text-muted-foreground">
                        {searchQuery ? (
                            <>Tìm thấy {filteredPosts.length} bài viết phù hợp</>
                        ) : (
                            <>Tổng cộng {pagination.totalPosts} bài viết</>
                        )}
                    </p>
                )}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-48 w-full rounded-xl" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    ))}
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <div className="text-center py-16 bg-muted/30 rounded-xl border-2 border-dashed">
                    <p className="text-destructive text-lg">{error}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="mt-4"
                        variant="outline"
                    >
                        Thử lại
                    </Button>
                </div>
            )}

            {/* Posts Grid */}
            {!isLoading && !error && (
                <>
                    {filteredPosts.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPosts.map((post) => (
                                <div key={post._id} className="h-full">
                                    <ArticleCard
                                    id={post._id}
                                    title={post.title || 'Không có tiêu đề'}
                                    excerpt={post.summary || 'Không có mô tả'}
                                    date={formatDate(post.publishedAt || post.createdAt)}
                                    tags={post.tags || []}
                                    author={post.userId?.name || 'Admin'}
                                    authorAvatar={post.userId?.avatar}
                                    readTime={post.readTime || '5 phút đọc'}
                                    image={post.images && post.images.length > 0 ? post.images[0] : undefined}
                                    compact
                                />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-muted/30 rounded-xl border-2 border-dashed">
                            <p className="text-muted-foreground text-lg">
                                {searchQuery ? 'Không tìm thấy bài viết nào phù hợp' : 'Chưa có bài viết nào'}
                            </p>
                            {searchQuery && (
                                <Button
                                    onClick={handleClearSearch}
                                    variant="outline"
                                    className="mt-4"
                                >
                                    Xóa bộ lọc
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && !searchQuery && (
                        <div className="flex items-center justify-center gap-4 pt-8">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={!pagination.hasPreviousPage || isLoading}
                                className="flex items-center gap-2"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Trang trước
                            </Button>

                            <div className="flex items-center gap-2">
                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    let pageNum: number
                                    if (pagination.totalPages <= 5) {
                                        pageNum = i + 1
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1
                                    } else if (currentPage >= pagination.totalPages - 2) {
                                        pageNum = pagination.totalPages - 4 + i
                                    } else {
                                        pageNum = currentPage - 2 + i
                                    }

                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handlePageChange(pageNum)}
                                            disabled={isLoading}
                                            className="min-w-[40px]"
                                        >
                                            {pageNum}
                                        </Button>
                                    )
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={!pagination.hasNextPage || isLoading}
                                className="flex items-center gap-2"
                            >
                                Trang sau
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {/* Page Info */}
                    {pagination && (
                        <div className="text-center text-sm text-muted-foreground">
                            Trang {pagination.currentPage} / {pagination.totalPages}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

