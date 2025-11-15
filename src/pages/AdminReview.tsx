import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// Using a simple inline modal instead of the Dialog component
import { articleService } from "@/services/articleService";
import { Link } from "react-router-dom";
import type { Post as BasePost } from "@/types/article";

type Post = BasePost & {
    moderationStatus?: string;
    author?: string | { name?: string };
    createdBy?: string | { name?: string };
};

function getAuthorName(post: Post): string {
    if (!post) return "Ẩn danh";
    // Prefer userId (common backend shape), support string or object with name
    const userIdField = (post as unknown as { userId?: unknown }).userId
    if (userIdField) {
        if (typeof userIdField === 'string') return userIdField
        if (typeof userIdField === 'object' && userIdField !== null) {
            const name = (userIdField as { name?: unknown }).name
            if (typeof name === 'string') return name
        }
    }

    // Fallback to 'author' field which might be string or object
    const authorField = (post as unknown as { author?: unknown }).author
    if (typeof authorField === 'string') return authorField
    if (typeof authorField === 'object' && authorField !== null) {
        const name = (authorField as { name?: unknown }).name
        if (typeof name === 'string') return name
    }

    // Fallback to createdBy
    const createdByField = (post as unknown as { createdBy?: unknown }).createdBy
    if (typeof createdByField === 'string') return createdByField
    if (typeof createdByField === 'object' && createdByField !== null) {
        const name = (createdByField as { name?: unknown }).name
        if (typeof name === 'string') return name
    }
    return "Ẩn danh";
}

export default function AdminReview() {
    const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [rejectingPost, setRejectingPost] = useState<Post | null>(null);
    const [reviewing, setReviewing] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        articleService.getPendingModerationPosts({ limit: 20 }).then((res) => {
            // Chuẩn hóa lấy posts từ res.data.posts
            let posts: Post[] = [];
            if (res?.data?.posts && Array.isArray(res.data.posts)) {
                posts = res.data.posts;
            } else if (Array.isArray(res?.posts)) {
                posts = res.posts;
            } else if (Array.isArray(res)) {
                posts = res;
            }
            setPendingPosts(posts);
            setLoading(false);
        });
    }, []);

    const handleApprove = async (post: Post) => {
        setReviewing(true);
        try {
            await articleService.reviewPost(post._id, { action: "approve" });
            setMessage("Phê duyệt bài thành công!");
            setPendingPosts((prev) => prev.filter((p) => p._id !== post._id));
        } catch {
            setMessage("Có lỗi xảy ra khi phê duyệt bài.");
        } finally {
            setReviewing(false);
        }
    };

    const handleReject = async () => {
        if (!rejectingPost) return;
        setReviewing(true);
        try {
            await articleService.reviewPost(rejectingPost._id, {
                action: "reject",
                rejectionReason,
            });
            setMessage("Từ chối bài thành công!");
            setPendingPosts((prev) => prev.filter((p) => p._id !== rejectingPost._id));
            setRejectingPost(null);
            setRejectionReason("");
        } catch {
            setMessage("Có lỗi xảy ra khi từ chối bài.");
        } finally {
            setReviewing(false);
        }
    };


    return (
        <div className="max-w-5xl mx-auto py-12 px-4">
            <h2 className="text-4xl font-extrabold mb-10 text-center text-primary">Quản lý kiểm duyệt bài viết</h2>
            {message && (
                <div className="mb-6 px-4 py-2 rounded bg-green-100 text-green-800 font-semibold text-center shadow">
                    {message}
                </div>
            )}
            <Separator className="mb-10" />
            {loading ? (
                <div className="text-center text-lg text-muted-foreground">Đang tải danh sách bài viết...</div>
            ) : pendingPosts.length === 0 ? (
                <div className="text-center text-lg text-muted-foreground">Không có bài viết nào chờ duyệt.</div>
            ) : (
                <Table className="rounded-xl overflow-hidden shadow-lg border border-muted">
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead className="w-1/12">Tiêu đề</TableHead>
                            <TableHead className="w-2/12">Tác giả</TableHead>
                            <TableHead className="w-2/12">Ngày tạo</TableHead>
                            <TableHead className="w-3/12">Tóm tắt</TableHead>
                            <TableHead className="w-2/12">Tags</TableHead>
                            <TableHead className="w-2/12 text-center">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pendingPosts.map((post) => (
                            <TableRow key={post._id}>
                                <TableCell className="font-bold text-primary truncate max-w-[180px]">{post.title}</TableCell>
                                <TableCell>{getAuthorName(post)}</TableCell>
                                <TableCell>{post.createdAt ? new Date(post.createdAt).toLocaleString() : "Không rõ"}</TableCell>
                                <TableCell className="line-clamp-2 max-w-[220px]">{post.summary}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {post.tags?.map((tag: string) => (
                                            <span key={tag} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="flex gap-2 justify-center">
                                    <Link to={`/article/${post._id}`} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm" className="mr-2">
                                            Chi tiết
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        disabled={reviewing}
                                        onClick={() => handleApprove(post)}
                                    >
                                        Phê duyệt
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                        disabled={reviewing}
                                        onClick={() => setRejectingPost(post)}
                                    >
                                        Từ chối
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            {/* Modal for rejection reason (simple inline modal) */}
            {rejectingPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={() => setRejectingPost(null)} />
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="relative z-50 max-w-lg w-full bg-card rounded-lg shadow-2xl p-6 mx-4 ring-1 ring-border"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-lg font-semibold">Từ chối bài viết</h3>
                            <button
                                aria-label="Đóng"
                                onClick={() => setRejectingPost(null)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                ×
                            </button>
                        </div>

                        <div className="mb-2 text-base font-semibold text-primary">{rejectingPost?.title}</div>
                        <div className="mb-4 text-sm text-muted-foreground">Tác giả: {rejectingPost && getAuthorName(rejectingPost)}</div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Lý do từ chối <span className="text-destructive">*</span></label>
                            <input
                                type="text"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary"
                                disabled={reviewing}
                                placeholder="Nhập lý do từ chối bài viết"
                            />
                        </div>

                        <div className="flex gap-2 justify-end">
                            <Button variant="ghost" onClick={() => setRejectingPost(null)}>
                                Hủy
                            </Button>
                            <Button
                                variant="destructive"
                                disabled={reviewing || !rejectionReason.trim()}
                                onClick={handleReject}
                            >
                                Xác nhận từ chối
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
