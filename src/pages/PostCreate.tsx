import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { postNews } from '@/services/articleService'
import { Loader2, Tag, CheckCircle2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
const TAG_OPTIONS = [
    'Kinh tế số',
    'Chuyển đổi số',
    'Bất động sản',
    'Đầu tư',
    'Chính sách',
    'E-commerce',
    'Kinh doanh',
    'Thuế',
    'Khởi nghiệp',
    'Công nghệ',
    'Nghiên cứu',
    'Thể thao',
    'Giải trí',
    'Ẩm thực',
]

export default function PostCreate() {
    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [isPublished, setIsPublished] = useState(true)
    const [images, setImages] = useState<File[]>([])
    const [isLoading, setIsLoading] = useState(false)


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length + images.length > 4) {
            toast.error('Tối đa 4 ảnh cho mỗi bài viết!')
            return
        }
        setImages([...images, ...files])
    }

    const handleRemoveImage = (idx: number) => {
        setImages(images.filter((_, i) => i !== idx))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !content.trim()) {
            toast.error('Tiêu đề và nội dung không được để trống!')
            return
        }
        setIsLoading(true)
        try {
            await postNews({
                title,
                summary,
                content,
                tags,
                isPublished,
                images,
            })
            toast.success('Đăng bài thành công!')
            setTitle('')
            setSummary('')
            setContent('')
            setTags([])
            setImages([])
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message || 'Đăng bài thất bại!')
            } else {
                toast.error('Đăng bài thất bại!')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-10">
            <Card className="p-8 shadow-lg border-primary/20">
                <h2 className="text-2xl font-bold mb-6 text-primary">Đăng bài tin tức kinh tế</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="font-semibold">Tiêu đề *</label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nhập tiêu đề bài viết" required />
                    </div>
                    <div>
                        <label className="font-semibold">Tóm tắt</label>
                        <Input value={summary} onChange={e => setSummary(e.target.value)} placeholder="Tóm tắt ngắn gọn" />
                    </div>
                    <div>
                        <label className="font-semibold">Nội dung *</label>
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            rows={8}
                            className="w-full border rounded-lg p-3 mt-1 focus:border-primary"
                            placeholder="Nhập nội dung chi tiết..."
                            required
                        />
                    </div>
                    <div>
                        <label className="font-semibold">Tags</label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button type="button" variant="outline" className="mb-2">
                                    <Tag className="h-5 w-5 mr-2" />Chọn tag
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white dark:bg-card border border-primary shadow-lg">
                                {TAG_OPTIONS.filter(tag => !tags.includes(tag)).map((tag) => (
                                    <DropdownMenuItem key={tag} onClick={() => setTags([...tags, tag])} className="cursor-pointer text-primary font-semibold dark:text-orange-300">
                                        {tag}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <div className="flex gap-2 flex-wrap mt-2">
                            {tags.map((tag, idx) => (
                                <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium flex items-center gap-1">
                                    {tag}
                                    <button type="button" className="ml-1 text-destructive" onClick={() => setTags(tags.filter((_, i) => i !== idx))}>
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="font-semibold">Ảnh (tối đa 4)</label>
                        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="mt-1" />
                        <div className="flex gap-3 mt-2 flex-wrap">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative">
                                    <img src={URL.createObjectURL(img)} alt="preview" className="h-20 w-20 object-cover rounded-lg border" />
                                    <button type="button" className="absolute top-0 right-0 bg-destructive text-white rounded-full px-2 py-0.5 text-xs" onClick={() => handleRemoveImage(idx)}>
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} id="publish" />
                        <label htmlFor="publish" className="flex items-center gap-1 cursor-pointer">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            Xuất bản ngay
                        </label>
                    </div>
                    <Button type="submit" className="w-full bg-linear-to-r from-primary to-orange-500 text-white font-bold text-lg" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Đăng bài'}
                    </Button>
                </form>
            </Card>
        </div>
    )
}
