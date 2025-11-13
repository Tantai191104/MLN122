import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Clock, Calendar, Share2, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import FeedbackList from "@/components/FeedbackList"
import type { Feedback as FeedbackType } from "@/components/FeedbackList"
import { articleService } from "@/services/articleService"
import { useAuthStore } from "@/stores/authStore"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
// Input not used here
import { toast } from "sonner"

interface Post {
  _id: string;
  title: string;
  summary: string;
  content: string;
  images?: string[];
  tags?: string[];
  publishedAt?: string;
  userId?: {
    _id: string;
    name?: string;
    avatar?: string;
    email?: string;
  };
  readTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([])
  const [feedbackLoading, setFeedbackLoading] = useState(true)
  const [feedbackError, setFeedbackError] = useState("")
  const [refetchingFeedbacks, setRefetchingFeedbacks] = useState(false)

  useEffect(() => {
    if (!id) return;
    // Fetch article detail using service
    setLoading(true)
    articleService
      .getPostById(id)
      .then((res) => {
        // response may be { success, data } or raw object
        const payload = res?.data || res
        if (payload && (payload.success ? payload.data : payload)) {
          const data = payload.success ? payload.data : payload
          setArticle(data)
        } else {
          setError("Không tìm thấy bài viết")
        }
      })
      .catch(() => setError("Không thể tải bài viết"))
      .finally(() => setLoading(false))

    // Fetch related posts (use service, don't inject hardcoded samples)
    articleService
      .getRelatedPosts(3)
      .then((res) => {
        const payload = res?.data || res
        const loaded = payload?.posts || (Array.isArray(payload) ? payload : [])
        const filtered = loaded.filter((p: Post) => p._id !== id).slice(0, 2)
        setRelatedPosts(filtered)
      })
      .catch(() => {
        // on error, leave relatedPosts empty
        setRelatedPosts([])
      })
    // Fetch feedbacks for this post via service
    setFeedbackLoading(true)
    articleService
      .getFeedbacks(id)
      .then((res) => {
        const payload = res as unknown
        if (Array.isArray(payload)) {
          setFeedbacks(payload as FeedbackType[])
        } else if (typeof payload === "object" && payload !== null) {
          const obj = payload as Record<string, unknown>
          if (obj["success"] === true && Array.isArray(obj["data"])) {
            setFeedbacks(obj["data"] as FeedbackType[])
          } else if (Array.isArray(obj["data"])) {
            setFeedbacks(obj["data"] as FeedbackType[])
          } else {
            setFeedbacks([])
          }
        } else {
          setFeedbacks([])
        }
      })
      .catch(() => {
        setFeedbackError("Không thể tải phản hồi")
        setFeedbacks([])
      })
      .finally(() => setFeedbackLoading(false))
  }, [id])

  // feedback form state
  const [newComment, setNewComment] = useState("")
  const [newRating, setNewRating] = useState<number>(5)
  const [submitLoading, setSubmitLoading] = useState(false)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const COMMENT_MAX = 500

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    const trimmed = newComment.trim()
    if (!trimmed) {
      toast.error("Vui lòng nhập nội dung phản hồi")
      return
    }
    if (trimmed.length > COMMENT_MAX) {
      toast.error(`Phản hồi dài quá, tối đa ${COMMENT_MAX} ký tự`)
      return
    }
    if (!isAuthenticated) {
      toast.error("Bạn cần đăng nhập để gửi phản hồi")
      return
    }
    // optimistic update: show the feedback immediately for snappier UX
    const authUser = useAuthStore.getState().user as unknown as { id?: string; _id?: string; name?: string; email?: string; avatar?: string } | null
    const tempFeedback: FeedbackType = {
      _id: `temp-${Date.now()}`,
      userId: {
        _id: authUser?.id ?? authUser?._id ?? 'anon',
        name: authUser?.name ?? 'Bạn',
        email: authUser?.email ?? undefined,
        avatar: authUser?.avatar ?? undefined,
      },
      comment: trimmed,
      rating: newRating,
      createdAt: new Date().toISOString(),
    }

    setFeedbacks(prev => [tempFeedback, ...prev])
    setSubmitLoading(true)
    try {
      // send to server in background
      await articleService.postFeedback(id, { comment: trimmed, rating: newRating })
      toast.success("Gửi phản hồi thành công")
    } catch {
      toast.error("Gửi phản hồi thất bại")
    } finally {
      setSubmitLoading(false)
      setRefetchingFeedbacks(true)
      try {
        const latest = await articleService.getFeedbacks(id)
        if (Array.isArray(latest)) setFeedbacks(latest as FeedbackType[])
        else if (typeof latest === "object" && latest !== null) {
          const obj = latest as Record<string, unknown>
          if (Array.isArray(obj["data"])) setFeedbacks(obj["data"] as FeedbackType[])
          else setFeedbacks([])
        } else {
          setFeedbacks([])
        }
        setNewComment("")
        setNewRating(5)
      } catch {
        // if refetch fails, keep optimistic state but show an error
        toast.error("Không thể đồng bộ phản hồi từ máy chủ")
      } finally {
        setRefetchingFeedbacks(false)
      }
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="space-y-4 mb-10">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  // Error state
  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Không tìm thấy bài viết</h2>
        <p className="text-muted-foreground mb-6">{error || "Bài viết không tồn tại hoặc đã bị xóa"}</p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại trang chủ
          </Link>
        </Button>
      </div>
    )
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa có ngày';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} phút đọc`;
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6 hover:bg-primary/10 hover:text-primary">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại trang chủ
        </Link>
      </Button>

      {/* Article Header */}
      <header className="mb-10">
        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {article.tags.map(tag => (
              <Badge key={tag} className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
          {article.title}
        </h1>

        {/* Summary */}
        {article.summary && (
          <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
            {article.summary}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{formatDate(article.publishedAt || article.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
            <Clock className="h-4 w-4 text-primary" />
            <span>{article.readTime || calculateReadTime(article.content)}</span>
          </div>
        </div>

        {/* Author and Share */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-linear-to-r from-muted/50 to-transparent rounded-xl border border-border/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={article.userId?.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {article.userId?.name ? article.userId.name.charAt(0).toUpperCase() : 'A'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{article.userId?.name || 'Admin'}</p>
              <p className="text-sm text-muted-foreground">{article.userId?.email || 'Tác giả'}</p>
            </div>
          </div>

          <Button variant="outline" size="sm" className="hover:bg-primary hover:text-white hover:border-primary">
            <Share2 className="mr-2 h-4 w-4" />
            Chia sẻ
          </Button>
        </div>
      </header>

      {/* Featured Image */}
      {article.images && article.images.length > 0 ? (
        <div className="mb-10 rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={article.images[0]}
            alt={article.title}
            className="w-full aspect-video object-cover"
          />
        </div>
      ) : (
        <div className="mb-10 rounded-2xl overflow-hidden shadow-2xl bg-linear-to-br from-primary/10 to-primary/5">
          <div className="w-full aspect-video flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Không có ảnh minh họa</p>
            </div>
          </div>
        </div>
      )}

      <Separator className="mb-10" />

      {/* Article Content */}
      <div
        className="prose prose-lg prose-slate dark:prose-invert max-w-none mb-10
                   prose-headings:font-bold prose-headings:text-foreground
                   prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                   prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
                   prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                   prose-strong:text-foreground prose-strong:font-semibold"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <Separator className="my-10" />

      {/* Author Bio Card */}
      {article.userId && (
        <div className="bg-linear-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border-2 border-primary/20 shadow-lg">
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="h-16 w-16 border-2 border-primary/30 shadow-md">
              <AvatarImage src={article.userId.avatar} />
              <AvatarFallback className="bg-primary/20 text-primary text-xl">
                {article.userId.name ? article.userId.name.charAt(0).toUpperCase() : 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-1 text-foreground">Về tác giả</h3>
              <p className="font-semibold text-lg text-primary mb-2">{article.userId.name || 'Admin'}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {article.userId.email || 'Tác giả chuyên về phân tích kinh tế và chính sách công.'}
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-primary/20">
            <Link to="/">
              <Button variant="outline" size="sm" className="hover:bg-primary hover:text-white">
                Xem thêm bài viết
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Feedbacks */}
      <div className="mt-16 space-y-6">
        <h3 className="text-2xl font-bold">Phản hồi của độc giả</h3>

        {/* Feedback form */}
        <Card className="p-4">
          <CardTitle className="text-lg font-semibold mb-2">Gửi phản hồi</CardTitle>
          <CardContent>
            <form onSubmit={handleSubmitFeedback} className="space-y-3">
              <div>
                <label className="text-sm font-medium">Nội dung</label>
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  rows={4}
                  maxLength={COMMENT_MAX}
                  className="w-full border rounded-md p-2 mt-1 focus:border-primary"
                  placeholder="Viết phản hồi của bạn ở đây..."
                  disabled={!isAuthenticated || submitLoading}
                />
                <div className="flex justify-between text-sm mt-1">
                  <div className="text-destructive/80">{newComment.trim().length > COMMENT_MAX ? 'Quá giới hạn ký tự' : ''}</div>
                  <div className={"text-sm " + (newComment.length >= COMMENT_MAX ? 'text-destructive' : 'text-muted-foreground')}>{newComment.length}/{COMMENT_MAX}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Đánh giá</label>
                <select value={String(newRating)} onChange={e => setNewRating(Number(e.target.value))} className="h-9 px-2 rounded-md border" disabled={!isAuthenticated || submitLoading}>
                  <option value="5">5 - Xuất sắc</option>
                  <option value="4">4 - Tốt</option>
                  <option value="3">3 - Trung bình</option>
                  <option value="2">2 - Kém</option>
                  <option value="1">1 - Rất kém</option>
                </select>
                <div className="flex-1 text-right">
                  <Button type="submit" disabled={submitLoading || !isAuthenticated || newComment.trim().length === 0} className="bg-primary">
                    {submitLoading ? 'Đang gửi...' : 'Gửi phản hồi'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        {!isAuthenticated && (
          <div className="text-sm text-muted-foreground">Vui lòng <Link to="/login" className="text-primary underline">đăng nhập</Link> để gửi phản hồi.</div>
        )}

        {(feedbackLoading || refetchingFeedbacks) ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        ) : feedbackError ? (
          <p className="text-sm text-destructive">{feedbackError}</p>
        ) : feedbacks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có phản hồi nào.</p>
        ) : (
          <FeedbackList feedbacks={feedbacks} />
        )}
      </div>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-6">Bài viết liên quan</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedPosts.map((post) => (
              <Link
                key={post._id}
                to={`/article/${post._id}`}
                className="group p-6 rounded-xl border-2 border-border hover:border-primary/50 bg-card hover:shadow-xl transition-all"
              >
                {post.tags && post.tags.length > 0 && (
                  <Badge className="mb-3 bg-primary/10 text-primary">{post.tags[0]}</Badge>
                )}
                <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {post.summary}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary font-semibold group-hover:underline">
                    Đọc thêm →
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(post.publishedAt || post.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
