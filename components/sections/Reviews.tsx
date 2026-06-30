"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiUserPlus } from "react-icons/fi";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { StarRating } from "@/components/ui/StarRating";
import { useToast } from "@/components/providers/ToastProvider";
import { reviewSchema, type ReviewFormData } from "@/lib/validations/review";
import { cn } from "@/lib/utils/cn";
import type { Review } from "@/types";

interface ReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalCount: number;
}

function formatReviewerTitle(role: string | null, company: string | null) {
  const parts: string[] = [];
  if (role) parts.push(role);
  if (company) parts.push(company);
  return parts.join(" at ").toUpperCase();
}

function useVisibleReviewCount() {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setCount(3);
      else if (window.innerWidth >= 768) setCount(2);
      else setCount(1);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <Card
      hover={false}
      className="flex h-full flex-col overflow-hidden p-0 transition-shadow duration-300 hover:shadow-glow"
    >
      <div className="flex flex-1 flex-col p-6">
        <span
          className="inline-block font-serif text-4xl leading-none text-accent-purple/70"
          aria-hidden
        >
          &ldquo;
        </span>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-white/90 line-clamp-6">
          {review.review_text}
        </p>
        <div className="mt-4">
          <StarRating rating={review.rating} readonly size="sm" />
        </div>
      </div>

      <div className="border-t border-white/[0.08] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-white">
            {review.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">{review.name}</p>
            {(review.role || review.company) && (
              <p className="truncate font-mono text-[10px] uppercase tracking-wider text-text-muted">
                {formatReviewerTitle(review.role, review.company)}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function Reviews({ reviews, averageRating, totalCount }: ReviewsProps) {
  const visibleCount = useVisibleReviewCount();
  const [pageIndex, setPageIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 },
  });

  const displayRating = totalCount > 0 ? averageRating : 0;
  const maxPageIndex = Math.max(0, reviews.length - visibleCount);
  const canSlide = reviews.length > visibleCount;

  useEffect(() => {
    setPageIndex((i) => Math.min(i, maxPageIndex));
  }, [maxPageIndex]);

  const visibleReviews = reviews.slice(pageIndex, pageIndex + visibleCount);

  const goToPrev = () => {
    setPageIndex((i) => Math.max(0, i - 1));
  };

  const goToNext = () => {
    setPageIndex((i) => Math.min(maxPageIndex, i + 1));
  };

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, rating }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      showToast("Recommendation submitted! Awaiting approval.", "success");
      reset();
      setRating(5);
      setDialogOpen(false);
    } catch {
      showToast("Failed to submit. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      {/* Aggregate rating header */}
      <div className="text-center">
        <p className="text-5xl font-bold tracking-tight text-white">
          {Math.round(displayRating)}{" "}
          <span className="text-3xl text-text-muted">/ 5.0</span>
        </p>
        <div className="mt-3 flex justify-center">
          <StarRating rating={Math.round(displayRating)} readonly size="lg" />
        </div>
        <p className="mt-3 font-mono text-xs uppercase tracking-wider text-text-muted">
          Based on {totalCount} active approved validation testimon
          {totalCount === 1 ? "y" : "ies"}
        </p>
      </div>

      {/* Review cards slider */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={pageIndex}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "grid gap-5",
                  visibleCount === 1 && "grid-cols-1",
                  visibleCount === 2 && "grid-cols-2",
                  visibleCount === 3 && "grid-cols-3"
                )}
              >
                {visibleReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {canSlide && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={goToPrev}
                disabled={pageIndex === 0}
                aria-label="Previous reviews"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-card/60 text-text-secondary transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>

              <span className="min-w-[4rem] text-center font-mono text-sm text-text-secondary">
                {pageIndex + 1}–{Math.min(pageIndex + visibleCount, reviews.length)}{" "}
                <span className="text-text-muted">of</span> {reviews.length}
              </span>

              <button
                onClick={goToNext}
                disabled={pageIndex >= maxPageIndex}
                aria-label="Next reviews"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-card/60 text-text-secondary transition-colors hover:border-accent-purple/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <Card hover={false} className="p-12 text-center">
          <p className="text-text-secondary">
            No testimonials yet. Be the first to submit a recommendation!
          </p>
        </Card>
      )}

      {/* Submit CTA */}
      <div className="flex justify-center">
        <Button
          variant="secondary"
          onClick={() => setDialogOpen(true)}
          className="gap-2 border-white/[0.12] bg-card/60"
        >
          <FiUserPlus className="h-4 w-4" />
          Submit Recommendation
        </Button>
      </div>

      {/* Submit review dialog */}
      <Modal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Submit a Recommendation"
        className="max-w-lg"
      >
        <div className="relative">
          <LoadingOverlay show={isSubmitting} message="Submitting recommendation..." />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Your Name"
              id="review-name"
              placeholder="Your Name"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Role"
              id="review-role"
              placeholder="Your Role"
              error={errors.role?.message}
              {...register("role")}
            />
            <Input
              label="Company"
              id="review-company"
              placeholder="Your Company"
              error={errors.company?.message}
              {...register("company")}
            />
            <Input
              label="Email (optional)"
              id="review-email"
              type="email"
              placeholder="your@email.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Rating
              </label>
              <StarRating rating={rating} onChange={setRating} />
            </div>
            <Textarea
              label="Your Recommendation"
              id="review_text"
              rows={4}
              placeholder="Share your experience working together..."
              error={errors.review_text?.message}
              {...register("review_text")}
            />
            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Submit Recommendation
            </Button>
            <p className="text-center text-xs text-text-muted">
              Thank you for your recommendation!
            </p>
          </form>
        </div>
      </Modal>
    </div>
  );
}
