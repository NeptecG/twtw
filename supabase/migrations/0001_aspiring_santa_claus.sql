ALTER TABLE "apartments" ADD COLUMN "rating" numeric(2, 1);--> statement-breakpoint
ALTER TABLE "apartments" ADD COLUMN "review_count" integer DEFAULT 0 NOT NULL;