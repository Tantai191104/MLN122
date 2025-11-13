// React import not necessary with modern JSX runtime
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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

export default function FeedbackList({ feedbacks }: { feedbacks: Feedback[] }) {
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

  return (
    <div className="space-y-4">
      {feedbacks.map((f) => (
        <div key={f._id} className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={f.userId?.avatar} />
              <AvatarFallback>
                {f.userId?.name ? f.userId.name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-foreground">{f.userId?.name || "Người dùng"}</p>
                  <p className="text-xs text-muted-foreground">{f.userId?.email}</p>
                </div>
                <div className="text-right">
                  {renderStars(f.rating)}
                  <div className="text-xs text-muted-foreground">{formatDate(f.createdAt)}</div>
                </div>
              </div>

              <div className="mt-3 text-sm text-muted-foreground">{f.comment}</div>
            </div>
          </div>
        </div>
      ))}

      <Separator />
    </div>
  );
}
