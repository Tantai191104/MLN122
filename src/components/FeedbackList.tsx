import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export interface FeedbackUser {
  _id: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface Feedback {
  _id: string;
  userId: FeedbackUser;
  comment: string;
  rating: number;
  createdAt: string;
}

interface FeedbackListProps {
  feedbacks: Feedback[];
  currentUserId?: string | null;
  onDelete?: (feedbackId: string) => void;
  isDeleting?: boolean;
}

export default function FeedbackList({ feedbacks, currentUserId, onDelete, isDeleting = false }: FeedbackListProps) {
  const formatDate = (d?: string) => {
    if (!d) return "";
    return new Date(d).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (n: number) => {
    const max = 5;
    const filled = "★".repeat(Math.max(0, Math.min(n, max)));
    const empty = "☆".repeat(Math.max(0, max - n));
    return (
      <span className="text-yellow-400 text-sm tracking-wider" aria-hidden>
        {filled}
        {empty}
      </span>
    );
  };

  const isOwnFeedback = (feedback: Feedback) => {
    return currentUserId && feedback.userId?._id === currentUserId;
  };

  return (
    <div className="space-y-6">
      {feedbacks.map((f) => (
        <div
          key={f._id}
          className="p-5 rounded-2xl border border-primary/20 bg-linear-to-br from-card via-background to-card shadow-lg hover:shadow-xl transition-all flex flex-col gap-3 relative"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-primary shadow-md">
              <AvatarImage src={f.userId?.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {f.userId?.name ? f.userId.name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <p className="font-bold text-lg text-foreground mb-1">
                {f.userId?.name || "Người dùng"}
              </p>
              <p className="text-xs text-muted-foreground">{f.userId?.email}</p>
            </div>

            <div className="flex flex-col items-end min-w-20">
              <span className="text-yellow-400 text-base font-bold cursor-pointer hover:scale-110 transition-transform">
                {renderStars(f.rating)}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {formatDate(f.createdAt)}
              </span>
            </div>
          </div>

          <div className="mt-2 bg-muted/40 rounded-xl px-4 py-3 text-base text-muted-foreground font-medium shadow-sm">
            {f.comment}
          </div>

          {/* Delete button - only show for own feedbacks */}
          {isOwnFeedback(f) && onDelete && (
            <div className="flex justify-end mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(f._id)}
                disabled={isDeleting}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Đang xóa..." : "Xóa"}
              </Button>
            </div>
          )}
        </div>
      ))}

      <Separator className="mt-6" />
    </div>
  );
}
