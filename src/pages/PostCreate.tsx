import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { postNews } from '@/services/articleService'
import type { PostNewsPayload } from '@/services/articleService'
import { Loader2, Tag, CheckCircle2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
const TAG_OPTIONS = [
    'Quan hệ cung - cầu',
    'Quan hệ sản xuất - tiêu dùng',
    'Quan hệ lao động - tiền lương',
    'Quan hệ vốn và đầu tư',
    'Quan hệ thương mại quốc tế',
    'Quan hệ kinh tế đối ngoại',
    'Quan hệ giữa Nhà nước và thị trường',
    'Quan hệ giữa doanh nghiệp và người lao động',
    'Quan hệ giữa các ngành kinh tế',
    'Quan hệ tài chính - ngân hàng',
];

export default function PostCreate() {
    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [isPublished, setIsPublished] = useState(true)
    const [images, setImages] = useState<File[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [author, setAuthor] = useState('')


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
        // Validate minimum word count for content
        const wordCount = content.trim().split(/\s+/).length;
        if (wordCount < 500) {
            toast.error('Nội dung bài viết phải có ít nhất 500 từ!');
            return;
        }
        if (!author.trim()) {
            toast.error('Vui lòng nhập tên tác giả!')
            return
        }
        setIsLoading(true)
        try {
            const payload: PostNewsPayload = {
                title,
                summary,
                content,
                tags,
                isPublished,
                images,
                author,
            }
            await postNews(payload)
            toast.success('Đăng bài thành công!')
            setTitle('')
            setSummary('')
            setContent('')
            setTags([])
            setImages([])
            setAuthor('')
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
        <div className="max-w-xl mx-auto py-10">
            <Card className="p-8 shadow-md border border-border rounded-2xl bg-background">
                <h2 className="text-2xl font-bold mb-8 text-primary text-center">Đăng bài mới</h2>
                <form onSubmit={handleSubmit} className="space-y-7">
                    <Input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Tiêu đề bài viết *"
                        required
                        className="text-lg font-semibold mb-2"
                    />
                    <Input
                        value={summary}
                        onChange={e => setSummary(e.target.value)}
                        placeholder="Tóm tắt ngắn gọn"
                        className="mb-2"
                    />
                    <Input
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                        placeholder="Tên tác giả *"
                        required
                        className="mb-2"
                    />
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows={7}
                        className="w-full border border-border rounded-xl p-4 text-base focus:border-primary bg-muted/40"
                        placeholder="Nội dung chi tiết *"
                        required
                    />
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button type="button" variant="outline" className="mb-2">
                                    <Tag className="h-5 w-5 mr-2" />Chọn tag kinh tế
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-background border border-border shadow-xl rounded-xl">
                                {TAG_OPTIONS.filter(tag => !tags.includes(tag)).map((tag) => (
                                    <DropdownMenuItem
                                        key={tag}
                                        onClick={() => setTags([...tags, tag])}
                                        className="cursor-pointer font-semibold bg-white dark:bg-card hover:bg-primary/10 dark:hover:bg-primary/20 text-primary transition-colors"
                                    >
                                        {tag}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <div className="flex gap-2 flex-wrap mt-2">
                            {tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-primary/90 hover:bg-primary text-primary-foreground rounded-xl text-xs font-semibold flex items-center gap-1 shadow-md transition-colors"
                                >
                                    {tag}
                                    <button type="button" className="ml-1 text-destructive font-bold" onClick={() => setTags(tags.filter((_, i) => i !== idx))}>
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Ảnh (tối đa 4)</label>
                        <Input type="file" accept="image/*" multiple onChange={handleImageChange} className="" />
                        <div className="flex gap-3 mt-2 flex-wrap">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative">
                                    <img src={URL.createObjectURL(img)} alt="preview" className="h-20 w-20 object-cover rounded-xl border border-border" />
                                    <button type="button" className="absolute top-0 right-0 bg-destructive text-white rounded-full px-2 py-0.5 text-xs" onClick={() => handleRemoveImage(idx)}>
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} id="publish" className="accent-primary h-5 w-5 rounded" />
                        <label htmlFor="publish" className="flex items-center gap-1 cursor-pointer text-base font-medium">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            Xuất bản ngay
                        </label>
                    </div>
                    <Button type="submit" className="w-full bg-linear-to-r from-primary to-orange-500 text-white font-bold text-lg rounded-xl py-3" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Đăng bài'}
                    </Button>
                </form>
            </Card>
        </div>
    )
}
