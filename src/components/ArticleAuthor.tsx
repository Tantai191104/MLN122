import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { Post } from "@/types/article"
import { Link } from "react-router-dom"


interface ArticleAuthorProps {
    userId: Post["userId"]
}

export default function ArticleAuthor({ userId }: ArticleAuthorProps) {
    if (!userId) return null
    return (
        <div className="bg-primary/5 rounded-2xl p-8 border shadow-lg">
            <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-16 w-16 border-2 border-primary/30 shadow-md">
                    <AvatarImage src={userId.avatar} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xl">
                        {userId.name ? userId.name.charAt(0).toUpperCase() : "A"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h3 className="font-bold text-xl mb-1 text-foreground">Về tác giả</h3>
                    <p className="font-semibold text-lg text-primary mb-2">
                        {userId.name || "Admin"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {userId.email || "Tác giả chuyên về phân tích kinh tế và chính sách công."}
                    </p>
                </div>
            </div>
            <div className="pt-4 border-t border-primary/20">
                <Link to="/">
                    <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-primary hover:text-white"
                    >
                        Xem thêm bài viết
                    </Button>
                </Link>
            </div>
        </div>
    )
}
