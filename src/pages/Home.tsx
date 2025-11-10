import ArticleCard from "@/components/ArticleCard"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

const sample = [
    {
        id: '1',
        title: 'Tương lai của Kinh tế Việt Nam trong Kỷ nguyên Số',
        excerpt: 'Phân tích sâu về xu hướng chuyển đổi số đang định hình lại nền kinh tế Việt Nam, từ thương mại điện tử đến fintech và cơ hội cho doanh nghiệp trong bối cảnh hội nhập quốc tế.',
        date: '10 tháng 11, 2025',
        tags: ['Kinh tế số', 'Chuyển đổi số'],
        author: 'Nguyễn Văn A',
        readTime: '8 phút đọc',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
        featured: true
    },
    {
        id: '2',
        title: 'Xu hướng Đầu tư Bất động sản 2025',
        excerpt: 'Thị trường bất động sản Việt Nam đang có những biến động mạnh. Phân tích các cơ hội đầu tư tiềm năng và rủi ro cần lưu ý trong năm 2025.',
        date: '09 tháng 11, 2025',
        tags: ['Bất động sản', 'Đầu tư'],
        author: 'Trần Thị B',
        readTime: '6 phút đọc',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop'
    },
    {
        id: '3',
        title: 'Chính sách Thuế Mới và Tác động đến Doanh nghiệp',
        excerpt: 'Chính phủ vừa công bố gói chính sách thuế mới nhằm hỗ trợ doanh nghiệp. Đánh giá chi tiết về các điểm quan trọng và cách thức áp dụng.',
        date: '08 tháng 11, 2025',
        tags: ['Chính sách', 'Thuế'],
        author: 'Lê Văn C',
        readTime: '10 phút đọc',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop'
    },
    {
        id: '4',
        title: 'Thương mại Điện tử: Cơ hội và Thách thức',
        excerpt: 'E-commerce đang bùng nổ tại Việt Nam với tốc độ tăng trưởng ấn tượng. Tìm hiểu về những cơ hội kinh doanh và thách thức cần vượt qua.',
        date: '07 tháng 11, 2025',
        tags: ['E-commerce', 'Kinh doanh'],
        author: 'Phạm Thị D',
        readTime: '7 phút đọc',
        image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop'
    },
]

const popularPosts = [
    {
        id: '5',
        title: 'Xu hướng Khởi nghiệp Công nghệ tại Việt Nam',
        excerpt: 'Sự lựa chọn giữa khởi nghiệp trong nước hay mở rộng ra quốc tế phụ thuộc vào nhiều yếu tố. Phân tích ưu nhược điểm của từng con đường.',
        date: '13 tháng 3, 2023',
        tags: ['Khởi nghiệp', 'Công nghệ'],
        author: 'Hoàng Văn E',
        readTime: '5 phút đọc',
        category: 'Travel',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop'
    },
    {
        id: '6',
        title: 'Cách xây dựng Website để nghiên cứu dự án tiếp theo',
        excerpt: 'Tận dụng công nghệ để xác định giá trị gia tăng trong hoạt động kinh doanh. Tối ưu hóa quy trình và tăng cường lợi thế cạnh tranh với các công cụ số.',
        date: '7 tháng 3, 2023',
        tags: ['Website', 'Nghiên cứu'],
        author: 'Vũ Thị F',
        readTime: '6 phút đọc',
        category: 'DEVELOPMENT',
        image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=400&fit=crop'
    },
    {
        id: '7',
        title: 'Làm thế nào để trở thành Vận động viên chuyên nghiệp 2023',
        excerpt: 'Phát triển theo quan điểm toàn diện về đổi mới trong lĩnh vực công nghệ và trao quyền. Chiến lược để đảm bảo chủ động.',
        date: '10 tháng 3, 2023',
        tags: ['Thể thao', 'Nghề nghiệp'],
        author: 'Đỗ Văn G',
        readTime: '8 phút đọc',
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&h=400&fit=crop'
    },
    {
        id: '8',
        title: 'Ca sĩ nào xuất sắc nhất trong bảng xếp hạng? Biết họ không?',
        excerpt: 'Phân tích Billboard để xếp hạng ca sĩ xuất sắc dựa trên hiệu suất hàng tuần của họ trong 100 bảng xếp hạng Billboard Hot.',
        date: '13 tháng 3, 2023',
        tags: ['Âm nhạc', 'Giải trí'],
        author: 'Mai Thị H',
        readTime: '4 phút đọc',
        category: 'Travel',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop'
    },
    {
        id: '9',
        title: 'Cách bắt đầu xuất khẩu nhập khẩu kinh doanh từ nhà?',
        excerpt: 'Tận dụng công nghệ để xác định giá trị gia tăng trong hoạt động. Doanh nghiệp xây dựng sản phẩm hoặc công cụ giúp người khác.',
        date: '7 tháng 3, 2023',
        tags: ['Kinh doanh', 'Xuất khẩu'],
        author: 'Bùi Văn I',
        readTime: '7 phút đọc',
        category: 'DEVELOPMENT',
        image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=600&h=400&fit=crop'
    },
    {
        id: '10',
        title: 'Làm đồ uống với sô cô la socola và sữa',
        excerpt: 'Phát triển theo quan điểm toàn diện về đổi mới đột phá và trao quyền. Đa dạng hóa để đảm bảo chủ động và tồn tại.',
        date: '10 tháng 3, 2023',
        tags: ['Ẩm thực', 'Công thức'],
        author: 'Lý Thị K',
        readTime: '3 phút đọc',
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=400&fit=crop'
    },
]

const categories = ['Tất cả', 'Kinh tế số', 'Chuyển đổi số', 'Bất động sản', 'Đầu tư', 'Chính sách', 'E-commerce']

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Tất cả')

    const filteredArticles = sample.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'Tất cả' || article.tags?.includes(selectedCategory)
        return matchesSearch && matchesCategory
    })

    return (
        <div className="space-y-12">
            {/* Hero Section - Featured Post */}
            <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary/90 to-primary/70 shadow-2xl">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48cGF0aCBkPSJNMCAzOGgyYTM4IDM4IDAgMCAwIDM4LTM4djJhMzggMzggMCAwIDEtMzggMzhaIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')] opacity-30"></div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Featured Image */}
                    <div className="relative aspect-video md:aspect-4/3 overflow-hidden">
                        <img
                            src={filteredArticles[0]?.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'}
                            alt={filteredArticles[0]?.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Featured Content */}
                    <div className="relative z-10 p-8 md:p-12 md:pr-16">
                        <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm px-3 py-1">
                            Bài viết nổi bật
                        </Badge>
                        {filteredArticles[0]?.tags && filteredArticles[0].tags.length > 0 && (
                            <div className="text-xs text-white/80 font-semibold mb-2 uppercase tracking-wider">
                                {filteredArticles[0].tags[0]}
                            </div>
                        )}
                        <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight text-white">
                            {filteredArticles[0]?.title || 'Tương lai của Kinh tế Việt Nam trong Kỷ nguyên Số'}
                        </h1>
                        <p className="text-base md:text-lg text-white/90 mb-6 leading-relaxed line-clamp-3">
                            {filteredArticles[0]?.excerpt || 'Phân tích sâu về xu hướng chuyển đổi số đang định hình lại nền kinh tế Việt Nam...'}
                        </p>
                        <Link to={`/article/${filteredArticles[0]?.id || '1'}`}>
                            <button className="bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                Đọc ngay →
                            </button>
                        </Link>
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
                {filteredArticles.length > 1 ? (
                    <div className="grid md:grid-cols-3 gap-6">
                        {filteredArticles.slice(1).map((a) => (
                            <ArticleCard key={a.id} {...a} compact />
                        ))}
                    </div>
                ) : filteredArticles.length === 1 ? (
                    <div className="text-center py-16 bg-muted/30 rounded-xl border-2 border-dashed">
                        <p className="text-muted-foreground text-lg">Chỉ có một bài viết phù hợp</p>
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
