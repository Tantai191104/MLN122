import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, User } from "lucide-react"
import { Link } from "react-router-dom"

type Props = {
    id: string
    title: string
    excerpt: string
    date: string
    tags?: string[]
    author?: string
    authorAvatar?: string
    readTime?: string
    image?: string
    compact?: boolean
}

export default function ArticleCard({ id, title, excerpt, date, tags, author = "Admin", authorAvatar, readTime = "5 phút đọc", image, compact = false }: Props) {
    if (compact) {
        return (
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border hover:border-primary/30 overflow-hidden h-full flex flex-col">
                {/* Image */}
                {image && (
                    <div className="relative aspect-video overflow-hidden bg-muted">
                        <img 
                            src={image} 
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                            {tags && tags.length > 0 && (
                                <Badge className="bg-primary text-white border-0 shadow-lg text-xs">
                                    {tags[0]}
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="text-xs text-muted-foreground mb-2 font-medium">{date}</div>
                    
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors leading-tight font-bold mb-3">
                        <Link to={`/article/${id}`} className="hover:underline decoration-2 underline-offset-4">
                            {title}
                        </Link>
                    </CardTitle>

                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4 flex-1">{excerpt}</p>

                    <Link to={`/article/${id}`} className="inline-flex items-center text-primary font-semibold text-sm hover:gap-2 transition-all">
                        Đọc thêm <span className="ml-1">→</span>
                    </Link>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border hover:border-primary/30 overflow-hidden">
            <div className="h-2 bg-linear-to-r from-primary via-primary/70 to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="space-y-3 pb-4">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/30 ring-2 ring-primary/10 shadow-lg">
                        <AvatarImage src={authorAvatar} />
                        <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 text-primary">
                            <User className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{author}</p>
                        <p className="text-xs text-muted-foreground">{date}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs bg-linear-to-r from-primary/10 to-purple-500/10 text-primary px-3 py-1.5 rounded-full border border-primary/20 shadow-sm">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        <span className="font-medium">{readTime}</span>
                    </div>
                </div>

                <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors leading-tight font-bold">
                    <Link to={`/article/${id}`} className="hover:underline decoration-2 underline-offset-4">
                        {title}
                    </Link>
                </CardTitle>

                {tags && tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                        {tags.map((tag, index) => (
                            <Badge 
                                key={tag} 
                                variant="secondary" 
                                className={`text-xs font-medium border shadow-sm ${
                                    index === 0 
                                        ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20' 
                                        : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20'
                                }`}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardHeader>

            <CardContent className="pb-4">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{excerpt}</p>
            </CardContent>

            <CardFooter className="pt-0 border-t border-border/50">
                <Button variant="ghost" asChild className="w-full justify-between text-primary font-semibold group/btn hover:bg-primary/5">
                    <Link to={`/article/${id}`} className="flex items-center gap-2">
                        <span>Đọc tiếp</span>
                        <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
