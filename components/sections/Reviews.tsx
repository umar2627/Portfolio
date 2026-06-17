"use client";

import { useState } from "react";
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

export function Reviews({ reviews, averageRating, totalCount }: ReviewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
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
  const currentReview = reviews[currentIndex];
  const totalPages = reviews.length;

  const goToPrev = () => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : totalPages - 1));
  };

  const goToNext = () => {
    setCurrentIndex((i) => (i < totalPages - 1 ? i + 1 : 0));
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
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Aggregate rating header */}
      <div className="text-center">
        <p className="text-5xl font-bold tracking-tight text-white">
          {Math.round(displayRating)}{" "}
          <span className="text-3xl text-text-muted">/ 5.0</span>
        </p>
        <div className="mt-3 flex justify-center">
          <StarRating
            rating={Math.round(displayRating)}
            readonly
            size="lg"
          />
        </div>
        <p className="mt-3 font-mono text-xs uppercase tracking-wider text-text-muted">
          Based on {totalCount} active approved validation testimon
          {totalCount === 1 ? "y" : "ies"}
        </p>
      </div>

      {/* Testimonial card */}
      {totalPages > 0 && currentReview ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentReview.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <Card hover={false} className="overflow-hidden p-0">
              <div className="p-8">
                <span
                  className="inline-block font-serif text-5xl leading-none text-accent-purple/80"
                  aria-hidden
                >
                  &ldquo;
                </span>
                <p className="mt-2 text-lg italic leading-relaxed text-white/90">
                  {currentReview.review_text}
                </p>
              </div>

              <div className="border-t border-white/[0.08] px-8 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-lg font-bold text-white">
                      {currentReview.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        {currentReview.name}
                      </p>
                      {(currentReview.role || currentReview.company) && (
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">
                          {formatReviewerTitle(
                            currentReview.role,
                            currentReview.company
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  <StarRating rating={currentReview.rating} readonly size="sm" />
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      ) : (
        <Card hover={false} className="p-12 text-center">
          <p className="text-text-secondary">
            No testimonials yet. Be the first to submit a recommendation!
          </p>
        </Card>
      )}

      {/* Actions bar */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Button
          variant="secondary"
          onClick={() => setDialogOpen(true)}
          className="gap-2 border-white/[0.12] bg-card/60"
        >
          <FiUserPlus className="h-4 w-4" />
          Submit Recommendation
        </Button>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrev}
              aria-label="Previous review"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-card/60 text-text-secondary transition-colors hover:border-white/20 hover:text-white"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            <span className="min-w-[3rem] text-center font-mono text-sm text-text-secondary">
              {currentIndex + 1} / {totalPages}
            </span>
            <button
              onClick={goToNext}
              aria-label="Next review"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-card/60 text-text-secondary transition-colors hover:border-white/20 hover:text-white"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
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
            placeholder="Sophia Ramirez"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Role"
            id="review-role"
            placeholder="Lead Product Designer"
            error={errors.role?.message}
            {...register("role")}
          />
          <Input
            label="Company"
            id="review-company"
            placeholder="Zenith Labs"
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
            Your recommendation will appear after admin approval.
          </p>
          </form>
        </div>
      </Modal>
    </div>
  );
}
