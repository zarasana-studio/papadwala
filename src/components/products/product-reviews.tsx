"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "@/components/ui/input";
import { Star, User, Sparkles } from "lucide-react";
import { createComment } from "@/lib/actions";
import { toast } from "sonner";
import * as motion from "motion/react-client";

export function ProductReviews({
  productId,
  comments,
}: {
  productId: string;
  comments: any[];
}) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Please sign in to leave a review");
      return;
    }

    setIsSubmitting(true);
    const result = await createComment({
      userId: session.user.id,
      productId,
      rating,
      title,
      description,
    });

    if (result.success) {
      toast.success("Review submitted! Thank you.");
      setTitle("");
      setDescription("");
      setRating(5);
    } else {
      toast.error("Failed to submit review. Try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="mt-32 pt-20 border-t border-brand-dark/10">
      <div className="flex items-center gap-2 mb-12">
        <Sparkles className="text-brand-primary h-5 w-5" />
        <h2 className="font-serif text-3xl font-medium text-brand-dark tracking-tight">
          Heritage Feedback ({comments.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        {/* Review Form */}
        <div className="lg:col-span-5">
          {session ? (
            <div className="rounded-[2rem] bg-brand-primary/5 p-8 border border-brand-primary/10">
              <h3 className="text-lg font-medium text-brand-dark mb-6 tracking-wide">
                Share your thought
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-widest text-brand-dark/60 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-6 w-6 transition-colors duration-200 ${
                            (hover || rating) >= star
                              ? "fill-[#f59e0b] text-[#f59e0b]"
                              : "text-brand-dark/20"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="title"
                    className="block text-xs font-medium uppercase tracking-widest text-brand-dark/60 mb-2"
                  >
                    Headline
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. A taste of home..."
                    className="h-12 rounded-xl border border-brand-dark/10 bg-white/50 px-4 text-sm font-medium focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-xs font-medium uppercase tracking-widest text-brand-dark/60 mb-2"
                  >
                    Your Experience
                  </label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setDescription(e.target.value)
                    }
                    placeholder="Tell us about the crunch, the spices, and the memories..."
                    className="rounded-[1rem] border border-brand-dark/10 bg-white/50 p-4 text-sm font-medium focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 min-h-32 shadow-sm"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-brand-dark hover:bg-[#2a1a16] h-14 text-white hover:text-white font-medium shadow-md transition-all duration-300"
                >
                  {isSubmitting ? "Submitting..." : "Post Review"}
                </Button>
              </form>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-brand-dark/20 bg-brand-dark/5 p-12 text-center flex flex-col items-center">
              <User className="h-10 w-10 text-brand-dark/30 mb-4" />
              <h3 className="text-[17px] font-medium text-brand-dark mb-2">
                Join the conversation
              </h3>
              <p className="text-sm text-brand-dark/60 mb-8 max-w-xs text-balance">
                Sign in to share your thoughts on this flavor and join our heritage community.
              </p>
              <Button asChild className="rounded-full bg-brand-dark hover:bg-[#2a1a16] px-8 h-12 text-[13px] font-medium transition-all">
                <a href="/signin">Sign In to Review</a>
              </Button>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-7 space-y-10">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                key={comment.id}
                className="group border-b border-brand-dark/5 pb-10 last:border-0"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center overflow-hidden">
                    {comment.user.image ? (
                      <img src={comment.user.image} alt={comment.user.name} />
                    ) : (
                      <User className="h-5 w-5 text-brand-dark/40" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-brand-dark capitalize">
                      {comment.user.name}
                    </h4>
                    <div className="flex gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3 w-3 ${
                            comment.rating >= s
                              ? "fill-[#f59e0b] text-[#f59e0b]"
                              : "text-brand-dark/10"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto text-xs text-brand-dark/40 font-medium">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h5 className="text-[17px] font-serif font-medium text-brand-dark mb-2 tracking-wide">
                  "{comment.title}"
                </h5>
                <p className="text-[14px] text-brand-dark/70 leading-relaxed text-balance">
                  {comment.description}
                </p>
              </motion.div>
            ))
          ) : (
            <div className="py-24 text-center border border-dashed border-brand-dark/10 rounded-[2rem]">
              <p className="text-brand-dark/50 text-[15px] font-medium tracking-wide">
                No reviews yet. Be the first to share your experience!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
