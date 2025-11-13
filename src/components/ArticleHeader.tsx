import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Share2 } from "lucide-react"
import { calculateReadTime, formatDate } from "@/lib/articleUtils"
import type { Post } from "@/types/article"


interface ArticleHeaderProps {
    article: Post
}

export default function ArticleHeader({ article }: ArticleHeaderProps) {
    return (
        <header className="mb-10">
            {article.tags && article.tags.length > 0 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                    {article.tags.map((tag) => (
                        <Badge
                            key={tag}
                            className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>
            )}
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                {article.title}
            </h1>
            {article.summary && (
                <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                    {article.summary}
                </p>
            )}
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/40 rounded-xl border">
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage src={article.userId?.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                            {article.userId?.name
                                ? article.userId.name.charAt(0).toUpperCase()
                                : "A"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-foreground">
                            {article.userId?.name || "Admin"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {article.userId?.email || "Tác giả"}
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-primary hover:text-white"
                >
                    <Share2 className="mr-2 h-4 w-4" /> Chia sẻ
                </Button>
            </div>
        </header>
    )
}
