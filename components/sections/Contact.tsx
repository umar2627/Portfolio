"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/providers/ToastProvider";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { contactSchema, type ContactFormData } from "@/lib/validations/contact";

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Failed to send");
      showToast("Message sent successfully!", "success");
      reset();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to send message.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="relative mx-auto max-w-2xl p-8">
      <LoadingOverlay show={isSubmitting} message="Sending message..." />
      <h3 className="mb-2 text-2xl font-bold text-white">Get in Touch</h3>
      <p className="mb-6 text-sm text-text-secondary">
        Have a project in mind or want to collaborate? Send me a message.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Name"
            id="contact-name"
            placeholder="Your name"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Email"
            id="contact-email"
            type="email"
            placeholder="your@email.com"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>
        <Input
          label="Subject"
          id="contact-subject"
          placeholder="What's this about?"
          error={errors.subject?.message}
          {...register("subject")}
        />
        <Textarea
          label="Message"
          id="contact-message"
          rows={5}
          placeholder="Tell me about your project..."
          error={errors.message?.message}
          {...register("message")}
        />
        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Send Message
        </Button>
      </form>
    </Card>
  );
}
