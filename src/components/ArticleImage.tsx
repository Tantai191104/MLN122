import type { Post } from "@/types/article"

interface ArticleImageProps {
    article: Post
}

export default function ArticleImage({ article }: ArticleImageProps) {
    const images = article.images || []
    const imageCount = images.length

    // 0 images - Empty state
    if (imageCount === 0) {
        return (
            <div className="h-64 flex items-center justify-center bg-muted/20 rounded-xl border border-border mb-8">
                <p className="text-muted-foreground">Không có ảnh minh họa</p>
            </div>
        )
    }

    // 1 image - Full width
    if (imageCount === 1) {
        return (
            <div className="mb-8">
                <div className="relative rounded-xl overflow-hidden border border-border shadow-lg">
                    <img
                        src={images[0]}
                        alt={article.title}
                        className="w-full h-96 object-cover"
                    />
                </div>
            </div>
        )
    }

    // 2 images - Side by side
    if (imageCount === 2) {
        return (
            <div className="mb-8">
                <div className="grid grid-cols-2 gap-3">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative rounded-xl overflow-hidden border border-border shadow-lg aspect-video">
                            <img
                                src={img}
                                alt={`${article.title} - Ảnh ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // 3 images - One large on top, two below
    if (imageCount === 3) {
        return (
            <div className="mb-8 space-y-3">
                <div className="relative rounded-xl overflow-hidden border border-border shadow-lg aspect-video">
                    <img
                        src={images[0]}
                        alt={`${article.title} - Ảnh 1`}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="relative rounded-xl overflow-hidden border border-border shadow-lg aspect-square">
                        <img
                            src={images[1]}
                            alt={`${article.title} - Ảnh 2`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="relative rounded-xl overflow-hidden border border-border shadow-lg aspect-square">
                        <img
                            src={images[2]}
                            alt={`${article.title} - Ảnh 3`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        )
    }

    // 4 images - 2x2 grid
    return (
        <div className="mb-8">
            <div className="grid grid-cols-2 gap-3">
                {images.map((img, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden border border-border shadow-lg aspect-square">
                        <img
                            src={img}
                            alt={`${article.title} - Ảnh ${idx + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
