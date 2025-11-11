import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Clock, Calendar, Share2, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "@/lib/axios"

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

  useEffect(() => {
    if (!id) return;

    // Fetch article detail
    axios.get(`/posts/${id}`)
      .then(res => {
        if (res.data?.success && res.data?.data) {
          setArticle(res.data.data)
        } else {
          setError("Không tìm thấy bài viết")
        }
      })
      .catch(() => {
        setError("Không thể tải bài viết")
      })
      .finally(() => {
        setLoading(false)
      })

    // Fetch related posts
    axios.get('/posts?page=1&limit=3')
      .then(res => {
        let posts = res.data?.data?.posts || [];
        posts = posts.filter((p: Post) => p._id !== id).slice(0, 2);
        // Nếu không có bài viết liên quan, dùng sample
        if (posts.length === 0) {
          posts = [
            {
              _id: 'sample1',
              title: 'Vai trò của Fintech trong nền kinh tế Việt Nam',
              summary: 'Fintech đang thay đổi cách tiếp cận tài chính của người dân và doanh nghiệp.',
              content: '<p>Fintech đang thay đổi cách tiếp cận tài chính của người dân và doanh nghiệp Việt Nam, mở ra nhiều cơ hội mới cho nền kinh tế.</p>',
              images: ['https://images.unsplash.com/photo-1465101178521-c1a6f3b5f0a0?w=800&h=600&fit=crop'],
              tags: ['Fintech', 'Tài chính'],
              publishedAt: '2025-08-10',
              userId: { _id: 'user1', name: 'Ngô Minh D', avatar: '' },
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
              userId: { _id: 'user2', name: 'Phạm Thảo', avatar: '' },
              readTime: '7 phút đọc',
            },
          ];
        }
        setRelatedPosts(posts);
      })
      .catch(() => {
        // Nếu lỗi, cũng hiển thị bài viết sample
        setRelatedPosts([
          {
            _id: 'sample1',
            title: 'Vai trò của Fintech trong nền kinh tế Việt Nam',
            summary: 'Fintech đang thay đổi cách tiếp cận tài chính của người dân và doanh nghiệp.',
            content: '<p>Fintech đang thay đổi cách tiếp cận tài chính của người dân và doanh nghiệp Việt Nam, mở ra nhiều cơ hội mới cho nền kinh tế.</p>',
            images: ['https://images.unsplash.com/photo-1465101178521-c1a6f3b5f0a0?w=800&h=600&fit=crop'],
            tags: ['Fintech', 'Tài chính'],
            publishedAt: '2025-08-10',
            userId: { _id: 'user1', name: 'Ngô Minh D', avatar: '' },
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
            userId: { _id: 'user2', name: 'Phạm Thảo', avatar: '' },
            readTime: '7 phút đọc',
          },
        ]);
      })
  }, [id])

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
