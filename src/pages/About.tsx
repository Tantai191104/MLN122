import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Award, Users, Shield } from "lucide-react"

export default function About() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-8 rounded-xl border border-primary/20">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Về MLN122
        </h1>
        <p className="text-muted-foreground text-lg">
          Nền tảng tin tức chính trị - kinh tế uy tín và chuyên nghiệp
        </p>
      </div>

      <Card className="border-l-4 border-l-primary hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary icon-primary" />
            Sứ mệnh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            MLN122 là nền tảng tin tức chính trị độc lập, cam kết cung cấp thông tin chính xác,
            khách quan và phân tích chuyên sâu về các vấn đề chính trị - kinh tế trong nước và quốc tế.
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-emerald-600 icon-success" />
            Giá trị cốt lõi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              <span>Tính chính xác và khách quan trong mọi bài viết</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <span>Phân tích chuyên sâu từ các chuyên gia hàng đầu</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <span>Minh bạch về nguồn thông tin và phương pháp báo chí</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
              <span>Tôn trọng sự đa dạng quan điểm và khuyến khích đối thoại</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600 icon-info" />
            Đội ngũ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Chúng tôi tự hào với đội ngũ nhà báo, biên tập viên và chuyên gia chính trị - kinh tế
            giàu kinh nghiệm, luôn nỗ lực mang đến những nội dung chất lượng cao và có giá trị cho bạn đọc.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
