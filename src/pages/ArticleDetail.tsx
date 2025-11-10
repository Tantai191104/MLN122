import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, Calendar, User, Share2 } from "lucide-react"

// Mock data - trong thực tế sẽ fetch từ API
const articles = {
  '1': {
    id: '1',
    title: 'Bình luận chính sách quốc gia mới',
    excerpt: 'Tóm tắt ngắn về chính sách mới, tác động và các phản ứng chính trị.',
    content: `
      <p>Chính sách quốc gia mới đã được công bố vào tuần trước, đánh dấu một bước ngoặt quan trọng trong định hướng phát triển của đất nước. Các chuyên gia đánh giá đây là một quyết định táo bạo nhưng cần thiết trong bối cảnh hiện tại.</p>

      <h2>Những điểm chính của chính sách</h2>
      <p>Chính sách tập trung vào ba trụ cột chính: phát triển kinh tế bền vững, cải cách hành chính và nâng cao phúc lợi xã hội. Mỗi trụ cột đều có các mục tiêu cụ thể và lộ trình thực hiện rõ ràng.</p>

      <h2>Phản ứng từ các bên</h2>
      <p>Giới chuyên gia và dư luận đã có những phản hồi tích cực về chính sách này. Tuy nhiên, vẫn còn một số lo ngại về khả năng triển khai và nguồn lực cần thiết để thực hiện các mục tiêu đề ra.</p>

      <h2>Tác động dự kiến</h2>
      <p>Nếu được triển khai thành công, chính sách này có thể tạo ra những thay đổi tích cực cho nền kinh tế và xã hội trong 5-10 năm tới. Các chỉ số phát triển được dự báo sẽ cải thiện đáng kể.</p>

      <p>Tuy nhiên, thành công của chính sách phụ thuộc nhiều vào sự phối hợp giữa các cơ quan chính phủ, sự ủng hộ của người dân và khả năng điều chỉnh linh hoạt khi gặp khó khăn.</p>
    `,
    date: '2025-11-10',
    tags: ['Chính sách', 'Phân tích'],
    author: 'Nguyễn Văn A',
    authorAvatar: '',
    readTime: '8 phút đọc'
  },
  '2': {
    id: '2',
    title: 'Phỏng vấn nhà lãnh đạo',
    excerpt: 'Câu hỏi và câu trả lời chính xung quanh vấn đề nội bộ.',
    content: `
      <p>Trong cuộc phỏng vấn độc quyền này, chúng tôi đã có cơ hội trao đổi với nhà lãnh đạo về những vấn đề nóng hổi hiện nay.</p>

      <h2>Về định hướng chính sách</h2>
      <p>"Chúng tôi cam kết sẽ lắng nghe ý kiến của người dân và điều chỉnh chính sách cho phù hợp với thực tế. Sự minh bạch và trách nhiệm giải trình là ưu tiên hàng đầu."</p>

      <h2>Về thách thức hiện tại</h2>
      <p>"Chúng ta đang đối mặt với nhiều thách thức, nhưng tôi tin rằng với sự đoàn kết và quyết tâm, chúng ta sẽ vượt qua được."</p>
    `,
    date: '2025-11-09',
    tags: ['Phỏng vấn'],
    author: 'Trần Thị B',
    authorAvatar: '',
    readTime: '12 phút đọc'
  },
  '3': {
    id: '3',
    title: 'Bầu cử địa phương: diễn biến',
    excerpt: 'Cập nhật nhanh kết quả và bình luận từ chuyên gia.',
    content: `
      <p>Cuộc bầu cử địa phương đang diễn ra với tỷ lệ cử tri đi bỏ phiếu cao, cho thấy sự quan tâm của người dân đối với chính trị địa phương.</p>

      <h2>Kết quả sơ bộ</h2>
      <p>Theo số liệu sơ bộ, tỷ lệ đi bỏ phiếu đạt 78%, cao hơn nhiều so với kỳ vọng ban đầu.</p>

      <h2>Phân tích xu hướng</h2>
      <p>Các chuyên gia nhận định rằng xu hướng bỏ phiếu cho thấy người dân quan tâm đặc biệt đến các vấn đề dân sinh và phát triển kinh tế địa phương.</p>
    `,
    date: '2025-11-08',
    tags: ['Bầu cử', 'Cập nhật'],
    author: 'Lê Văn C',
    authorAvatar: '',
    readTime: '6 phút đọc'
  },
  '4': {
    id: '4',
    title: 'Cải cách hành chính: bước tiến mới',
    excerpt: 'Những thay đổi quan trọng trong quy trình hành chính.',
    content: `
      <p>Chương trình cải cách hành chính đã bắt đầu cho thấy những kết quả tích cực sau 6 tháng triển khai.</p>

      <h2>Những thay đổi chính</h2>
      <p>Quy trình được đơn giản hóa, thời gian xử lý giảm 40%, và sự hài lòng của người dân tăng đáng kể.</p>
    `,
    date: '2025-11-07',
    tags: ['Cải cách', 'Hành chính'],
    author: 'Phạm Thị D',
    authorAvatar: '',
    readTime: '10 phút đọc'
  }
}

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>()
  const article = id ? articles[id as keyof typeof articles] : null

  if (!article) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h2>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại trang chủ
          </Link>
        </Button>
      </div>
    )
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
        <div className="flex gap-2 mb-4">
          {article.tags.map(tag => (
            <Badge key={tag} className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
          {article.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{article.date}</span>
          </div>
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
            <Clock className="h-4 w-4 text-primary" />
            <span>{article.readTime}</span>
          </div>
        </div>

        {/* Author and Share */}
        <div className="flex items-center justify-between p-4 bg-linear-to-r from-muted/50 to-transparent rounded-xl border border-border/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={article.authorAvatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{article.author}</p>
              <p className="text-sm text-muted-foreground">Nhà phân tích kinh tế</p>
            </div>
          </div>

          <Button variant="outline" size="sm" className="hover:bg-primary hover:text-white hover:border-primary">
            <Share2 className="mr-2 h-4 w-4" />
            Chia sẻ
          </Button>
        </div>
      </header>

      {/* Featured Image */}
      <div className="mb-10 rounded-2xl overflow-hidden shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop"
          alt={article.title}
          className="w-full aspect-video object-cover"
        />
      </div>

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
      <div className="bg-linear-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border-2 border-primary/20 shadow-lg">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16 border-2 border-primary/30 shadow-md">
            <AvatarImage src={article.authorAvatar} />
            <AvatarFallback className="bg-primary/20 text-primary text-xl">
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-1 text-foreground">Về tác giả</h3>
            <p className="font-semibold text-lg text-primary mb-2">{article.author}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Chuyên gia phân tích kinh tế và chính sách công với hơn 10 năm kinh nghiệm.
              Đã công bố nhiều nghiên cứu về phát triển kinh tế Việt Nam và xu hướng toàn cầu.
            </p>
          </div>
        </div>
        <div className="flex gap-3 pt-4 border-t border-primary/20">
          <Button variant="outline" size="sm" className="hover:bg-primary hover:text-white">
            Xem thêm bài viết
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-primary/20 hover:text-primary">
            Theo dõi
          </Button>
        </div>
      </div>

      {/* Related Articles */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold mb-6">Bài viết liên quan</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Link
              key={i}
              to={`/article/${i}`}
              className="group p-6 rounded-xl border-2 border-border hover:border-primary/50 bg-card hover:shadow-xl transition-all"
            >
              <Badge className="mb-3 bg-primary/10 text-primary">Kinh tế</Badge>
              <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                Tiêu đề bài viết liên quan số {i}
              </h4>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                Mô tả ngắn về bài viết này để thu hút người đọc quan tâm và click vào.
              </p>
              <span className="text-sm text-primary font-semibold group-hover:underline">
                Đọc thêm →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </article>
  )
}
