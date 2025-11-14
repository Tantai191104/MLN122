import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { postNews } from '@/services/articleService'
import type { PostNewsPayload } from '@/services/articleService'
import { Loader2, Tag, CheckCircle2, ImagePlus, X, Upload } from 'lucide-react'
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
        e.target.value = ''
    }

    const handleRemoveImage = (idx: number) => {
        setImages(images.filter((_, i) => i !== idx))
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
        if (files.length + images.length > 4) {
            toast.error('Tối đa 4 ảnh cho mỗi bài viết!')
            return
        }
        setImages([...images, ...files])
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !content.trim()) {
            toast.error('Tiêu đề và nội dung không được để trống!')
            return
        }
        // Validate minimum word count for content
        // const wordCount = content.trim().split(/\s+/).length;
        // if (wordCount < 500) {
        //     toast.error('Nội dung bài viết phải có ít nhất 500 từ!');
        //     return;
        // }
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
                        <label className="block font-medium mb-3 text-base">Ảnh minh họa (tối đa 4)</label>
                        
                        {/* Image Gallery - Beautiful Grid Layout */}
                        {images.length === 0 ? (
                            // Empty state - 0 images
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                className="relative border-2 border-dashed border-border rounded-xl p-8 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer group"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    id="image-upload"
                                />
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                        <ImagePlus className="h-8 w-8 text-primary" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground mb-1">
                                        Kéo thả ảnh vào đây hoặc click để chọn
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Hỗ trợ: JPG, PNG, GIF (tối đa 4 ảnh)
                                    </p>
                                </div>
                            </div>
                        ) : images.length === 1 ? (
                            // Single image - Full width
                            <div className="space-y-3">
                                <div className="relative group rounded-xl overflow-hidden border border-border shadow-sm">
                                    <img
                                        src={URL.createObjectURL(images[0])}
                                        alt="preview"
                                        className="w-full h-64 object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(0)}
                                        className="absolute top-3 right-3 bg-destructive/90 hover:bg-destructive text-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                                {images.length < 4 && (
                                    <label
                                        htmlFor="image-upload-add"
                                        className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                    >
                                        <Upload className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Thêm ảnh</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="image-upload-add"
                                        />
                                    </label>
                                )}
                            </div>
                        ) : images.length === 2 ? (
                            // Two images - Side by side
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-border shadow-sm aspect-video">
                                            <img
                                                src={URL.createObjectURL(img)}
                                                alt={`preview ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(idx)}
                                                className="absolute top-2 right-2 bg-destructive/90 hover:bg-destructive text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                {images.length < 4 && (
                                    <label
                                        htmlFor="image-upload-add"
                                        className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                    >
                                        <Upload className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Thêm ảnh</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="image-upload-add"
                                        />
                                    </label>
                                )}
                            </div>
                        ) : images.length === 3 ? (
                            // Three images - One large on top, two below
                            <div className="space-y-3">
                                <div className="space-y-3">
                                    <div className="relative group rounded-xl overflow-hidden border border-border shadow-sm aspect-video">
                                        <img
                                            src={URL.createObjectURL(images[0])}
                                            alt="preview 1"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(0)}
                                            className="absolute top-2 right-2 bg-destructive/90 hover:bg-destructive text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative group rounded-xl overflow-hidden border border-border shadow-sm aspect-square">
                                            <img
                                                src={URL.createObjectURL(images[1])}
                                                alt="preview 2"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(1)}
                                                className="absolute top-2 right-2 bg-destructive/90 hover:bg-destructive text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                        <div className="relative group rounded-xl overflow-hidden border border-border shadow-sm aspect-square">
                                            <img
                                                src={URL.createObjectURL(images[2])}
                                                alt="preview 3"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(2)}
                                                className="absolute top-2 right-2 bg-destructive/90 hover:bg-destructive text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {images.length < 4 && (
                                    <label
                                        htmlFor="image-upload-add"
                                        className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                    >
                                        <Upload className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Thêm ảnh</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="image-upload-add"
                                        />
                                    </label>
                                )}
                            </div>
                        ) : (
                            // Four images - 2x2 grid
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-border shadow-sm aspect-square">
                                            <img
                                                src={URL.createObjectURL(img)}
                                                alt={`preview ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(idx)}
                                                className="absolute top-2 right-2 bg-destructive/90 hover:bg-destructive text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-center text-muted-foreground">
                                    Đã đạt tối đa 4 ảnh
                                </p>
                            </div>
                        )}
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
