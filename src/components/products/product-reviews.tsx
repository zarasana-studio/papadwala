"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "@/components/ui/input";
import { Star, User } from "lucide-react";
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
    <div className="mt-24 border-t border-gray-100 pt-16">
      <h2 className="font-serif text-3xl font-bold text-brand-dark mb-12">
        Customer Reviews ({comments.length})
      </h2>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        {/* Review Form */}
        <div className="lg:col-span-5">
          {session ? (
            <div className="rounded-3xl bg-gray-50 p-8">
              <h3 className="text-xl font-bold text-brand-dark mb-6">
                Write a review
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="p-1 focus:outline-none transition-transform hover:scale-125"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            (hover || rating) >= star
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Review Title
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Best papad I've ever had!"
                    className="rounded-xl border-gray-200"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setDescription(e.target.value)
                    }
                    placeholder="Tell us about the flavor, crunch, and your experience..."
                    className="rounded-xl border-gray-200 min-h-30"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-brand-dark hover:bg-brand-primary py-6 font-bold shadow-lg"
                >
                  {isSubmitting ? "Submitting..." : "Post Review"}
                </Button>
              </form>
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-brand-dark mb-2">
                Join the conversation
              </h3>
              <p className="text-muted-foreground mb-6 italic">
                Sign in to share your thoughts on this flavor.
              </p>
              <Button asChild className="rounded-full bg-brand-primary">
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
                transition={{ delay: index * 0.1 }}
                key={comment.id}
                className="group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {comment.user.image ? (
                      <img src={comment.user.image} alt={comment.user.name} />
                    ) : (
                      <User className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark lowercase">
                      {comment.user.name}
                    </h4>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3 w-3 ${
                            comment.rating >= s
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto text-xs text-muted-foreground italic font-medium">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h5 className="text-lg font-bold text-brand-dark mb-2 font-serif">
                  {comment.title}
                </h5>
                <p className="text-muted-foreground italic leading-relaxed text-balance">
                  {comment.description}
                </p>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-muted-foreground italic text-lg">
                No reviews yet. Be the first to share your experience!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
