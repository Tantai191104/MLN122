import type { Post } from "@/types/article"

interface ArticleImageProps {
    article: Post
}

export default function ArticleImage({ article }: ArticleImageProps) {
    if (article.images && article.images.length > 0) {
        return (
            <img
                src={article.images[0]}
                alt={article.title}
                className="w-full h-64 object-cover rounded-xl border mb-8"
            />
        )
    }
    return (
        <div className="h-64 flex items-center justify-center bg-muted/20 rounded-xl mb-8">
            <p className="text-muted-foreground">Không có ảnh minh họa</p>
        </div>
    )
}
