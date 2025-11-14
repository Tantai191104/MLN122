import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"
import { Facebook, Twitter, Youtube, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-linear-to-b from-background to-muted/20 mt-20">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <h3 className="font-bold text-3xl text-primary mb-2">
                MLN122
              </h3>
              <p className="text-sm font-medium text-muted-foreground">Kinh tế Việt Nam</p>
            </div>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              Nền tảng tin tức kinh tế uy tín, cung cấp thông tin chính xác và phân tích chuyên sâu về nền kinh tế Việt Nam.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-11 h-11 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 dark:bg-blue-500/20 dark:hover:bg-blue-500/30 border border-blue-500/20 flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 group"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
              </a>
              <a
                href="#"
                className="w-11 h-11 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 dark:bg-sky-500/20 dark:hover:bg-sky-500/30 border border-sky-500/20 flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 group"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-sky-600 dark:text-sky-400 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors" />
              </a>
              <a
                href="#"
                className="w-11 h-11 rounded-xl bg-red-500/10 hover:bg-red-500/20 dark:bg-red-500/20 dark:hover:bg-red-500/30 border border-red-500/20 flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 group"
                aria-label="Youtube"
              >
                <Youtube className="h-5 w-5 text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors" />
              </a>
              <a
                href="#"
                className="w-11 h-11 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 dark:bg-purple-500/20 dark:hover:bg-purple-500/30 border border-purple-500/20 flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 group"
                aria-label="Email"
              >
                <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors" />
              </a>
            </div>
          </div>

          {/* Danh mục */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground">Danh mục</h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="text-primary/50 group-hover:text-primary transition-colors">→</span>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="text-primary/50 group-hover:text-primary transition-colors">→</span>
                  Phân tích
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="text-primary/50 group-hover:text-primary transition-colors">→</span>
                  Chính sách
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="text-primary/50 group-hover:text-primary transition-colors">→</span>
                  Kinh tế
                </a>
              </li>
            </ul>
          </div>

          {/* Về chúng tôi */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground">Về chúng tôi</h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="text-primary/50 group-hover:text-primary transition-colors">→</span>
                  Giới thiệu
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="text-primary/50 group-hover:text-primary transition-colors">→</span>
                  Liên hệ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="text-primary/50 group-hover:text-primary transition-colors">→</span>
                  Điều khoản
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="text-primary/50 group-hover:text-primary transition-colors">→</span>
                  Bảo mật
                </a>
              </li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground">Hỗ trợ</h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="text-primary/50 group-hover:text-primary transition-colors">→</span>
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="text-primary/50 group-hover:text-primary transition-colors">→</span>
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="text-primary/50 group-hover:text-primary transition-colors">→</span>
                  Báo cáo vấn đề
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                >
                  <span className="text-primary/50 group-hover:text-primary transition-colors">→</span>
                  Sitemap
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 opacity-50" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} <span className="font-semibold text-foreground">MLN122</span>. Bảo lưu mọi quyền.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Điều khoản sử dụng
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Chính sách bảo mật
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}