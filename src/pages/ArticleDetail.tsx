import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertCircle, AlertTriangle, Loader2, X } from "lucide-react"
import FeedbackList from "@/components/FeedbackList"
import type { Feedback as FeedbackType } from "@/components/FeedbackList"
import { articleService } from "@/services/articleService"
import { useAuthStore } from "@/stores/authStore"
import { toast } from "sonner" // nếu bạn dùng thư viện khác, thay thế import này
import ArticleHeader from "@/components/ArticleHeader"
import ArticleImage from "@/components/ArticleImage"
import ArticleContent from "@/components/ArticleContent"
import type { Post } from "@/types/article"

// Post type imported from @/types/article

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [feedbackError, setFeedbackError] = useState<string | null>(null)
  const [refetchingFeedbacks, setRefetchingFeedbacks] = useState(false)

  const [newComment, setNewComment] = useState("")
  const [newRating, setNewRating] = useState<number>(5)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [deletingFeedbackId, setDeletingFeedbackId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [feedbackToDelete, setFeedbackToDelete] = useState<string | null>(null)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const COMMENT_MAX = 500

  useEffect(() => {
    if (!id) return

    // Fetch post
    setLoading(true)
    articleService
      .getPostById(id)
      .then((res) => {
        // API returns { success, message, data }
        if (res && typeof res === "object" && "data" in res) {
          setPost(res.data)
        } else {
          setPost(null)
        }
      })
      .catch(() => setError("Không thể tải bài viết"))
      .finally(() => setLoading(false))

    // Fetch related posts
    articleService
      .getRelatedPosts(3)
      .then((data: Post[]) => {
        setRelatedPosts(data.filter((p) => p._id !== id))
      })
      .catch(() => setRelatedPosts([]))

    // Fetch feedbacks
    setFeedbackLoading(true)
    articleService
      .getFeedbacks(id)
      .then((res) => {
        const payload = res as { data?: FeedbackType[] } | FeedbackType[]
        if (Array.isArray(payload)) setFeedbacks(payload)
        else if ((payload as { data?: FeedbackType[] })?.data && Array.isArray((payload as { data?: FeedbackType[] }).data)) {
          setFeedbacks((payload as { data: FeedbackType[] }).data)
        } else {
          setFeedbacks([])
        }
      })
      .catch(() => setFeedbackError("Không thể tải phản hồi"))
      .finally(() => setFeedbackLoading(false))
  }, [id])

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa có ngày"
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }


  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    const trimmed = newComment.trim()
    if (!trimmed) return toast.error("Vui lòng nhập nội dung phản hồi")
    if (trimmed.length > COMMENT_MAX)
      return toast.error(`Phản hồi dài quá, tối đa ${COMMENT_MAX} ký tự`)
    if (!isAuthenticated) return toast.error("Bạn cần đăng nhập để gửi phản hồi")
    const authUser = useAuthStore.getState().user as {
      id?: string
      name?: string
      email?: string
      avatar?: string
    } | undefined
    const tempFeedback: FeedbackType = {
      _id: `temp-${Date.now()}`,
      userId: {
        _id: authUser?.id ?? "anon",
        name: authUser?.name ?? "Bạn",
        email: authUser?.email,
        avatar: authUser?.avatar,
      },
      comment: trimmed,
      rating: newRating,
      createdAt: new Date().toISOString(),
    }

    setFeedbacks((prev) => [tempFeedback, ...prev])
    setSubmitLoading(true)
    try {
      await articleService.postFeedback(id, { comment: trimmed, rating: newRating })
      toast.success("Gửi phản hồi thành công")
    } catch {
      toast.error("Gửi phản hồi thất bại")
    } finally {
      setSubmitLoading(false)
      setRefetchingFeedbacks(true)
      try {
        const latest = await articleService.getFeedbacks(id)
        if (Array.isArray(latest)) setFeedbacks(latest)
        else if ((latest as { data?: FeedbackType[] })?.data && Array.isArray((latest as { data?: FeedbackType[] }).data)) {
          setFeedbacks((latest as { data: FeedbackType[] }).data)
        } else {
          setFeedbacks([])
        }
        setNewComment("")
        setNewRating(5)
      } catch {
        toast.error("Không thể đồng bộ phản hồi từ máy chủ")
      } finally {
        setRefetchingFeedbacks(false)
      }
    }
  }

  const handleDeleteClick = (feedbackId: string) => {
    setFeedbackToDelete(feedbackId)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!id || !feedbackToDelete) return

    setDeletingFeedbackId(feedbackToDelete)
    setShowDeleteDialog(false)
    
    try {
      await articleService.deleteFeedback(id, feedbackToDelete)
      toast.success("Xóa phản hồi thành công")
      
      // Remove feedback from list immediately
      setFeedbacks((prev) => prev.filter((f) => f._id !== feedbackToDelete))
    } catch (err) {
      console.error("Error deleting feedback:", err)
      toast.error("Xóa phản hồi thất bại")
    } finally {
      setDeletingFeedbackId(null)
      setFeedbackToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteDialog(false)
    setFeedbackToDelete(null)
  }

  // Loading UI
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-10 w-32 mb-6" />
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    )
  }

  // Error UI
  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Không tìm thấy bài viết</h2>
        <p className="text-muted-foreground mb-6">
          {error || "Bài viết không tồn tại hoặc đã bị xóa"}
        </p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại trang chủ
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Nút quay lại */}
      <Button
        variant="ghost"
        asChild
        className="mb-6 hover:bg-primary/10 hover:text-primary"
      >
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại trang chủ
        </Link>
      </Button>

      {/* Header bài viết */}
      {post && <ArticleHeader article={post} />}
      {post && <ArticleImage article={post} />}
      <Separator className="mb-10" />
      {post && <ArticleContent content={post.content} />}
      <Separator className="my-10" />

      {/* Feedback */}
      <div className="mt-16 space-y-6">
        <h3 className="text-2xl font-bold">Phản hồi của độc giả</h3>

        <Card className="p-4">
          <CardTitle className="text-lg font-semibold mb-2">Gửi phản hồi</CardTitle>
          <CardContent>
            <form onSubmit={handleSubmitFeedback} className="space-y-3">
              <div>
                <label className="text-sm font-medium">Nội dung</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  maxLength={COMMENT_MAX}
                  className="w-full border rounded-md p-2 mt-1 focus:border-primary"
                  placeholder="Viết phản hồi của bạn ở đây..."
                  disabled={!isAuthenticated || submitLoading}
                />
                <div className="flex justify-between text-sm mt-1">
                  <div className="text-destructive/80">
                    {newComment.trim().length > COMMENT_MAX
                      ? "Quá giới hạn ký tự"
                      : ""}
                  </div>
                  <div
                    className={
                      "text-sm " +
                      (newComment.length >= COMMENT_MAX
                        ? "text-destructive"
                        : "text-muted-foreground")
                    }
                  >
                    {newComment.length}/{COMMENT_MAX}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Đánh giá</label>
                <select
                  value={String(newRating)}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="h-9 px-2 rounded-md border"
                  disabled={!isAuthenticated || submitLoading}
                >
                  <option value="5">5 - Xuất sắc</option>
                  <option value="4">4 - Tốt</option>
                  <option value="3">3 - Trung bình</option>
                  <option value="2">2 - Kém</option>
                  <option value="1">1 - Rất kém</option>
                </select>
                <div className="flex-1 text-right">
                  <Button
                    type="submit"
                    disabled={
                      submitLoading || !isAuthenticated || newComment.trim().length === 0
                    }
                    className="bg-primary"
                  >
                    {submitLoading ? "Đang gửi..." : "Gửi phản hồi"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {!isAuthenticated && (
          <div className="text-sm text-muted-foreground">
            Vui lòng{" "}
            <Link to="/login" className="text-primary underline">
              đăng nhập
            </Link>{" "}
            để gửi phản hồi.
          </div>
        )}

        {feedbackLoading || refetchingFeedbacks ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        ) : feedbackError ? (
          <p className="text-sm text-destructive">{feedbackError}</p>
        ) : feedbacks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có phản hồi nào.</p>
        ) : (
          <FeedbackList 
            feedbacks={feedbacks} 
            currentUserId={user?.id || null}
            onDelete={handleDeleteClick}
            isDeleting={deletingFeedbackId !== null}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCancelDelete}
          />
          
          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={handleCancelDelete}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              disabled={deletingFeedbackId !== null}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Xác nhận xóa phản hồi
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-300">
                  Bạn có chắc chắn muốn xóa phản hồi này? Hành động này không thể hoàn tác.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={handleCancelDelete}
                disabled={deletingFeedbackId !== null}
                className="min-w-[100px] text-white border-white/30 hover:bg-white/10 hover:text-white"
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deletingFeedbackId !== null}
                className="min-w-[100px] text-white bg-red-600 hover:bg-red-700"
              >
                {deletingFeedbackId ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  "Xóa"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bài viết liên quan */}
      {relatedPosts.length > 0 && (
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-6">Bài viết liên quan</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedPosts.map((post) => (
              <Link
                key={post._id}
                to={`/article/${post._id}`}
                className="group p-6 rounded-xl border hover:border-primary/50 bg-card hover:shadow-xl transition-all"
              >
                {post.tags && post.tags.length > 0 && (
                  <Badge className="mb-3 bg-primary/10 text-primary">
                    {post.tags[0]}
                  </Badge>
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
