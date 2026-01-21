ALTER TABLE "price_inputs" ADD COLUMN "livestockType" text;--> statement-breakpoint
ALTER TABLE "price_inputs" DROP COLUMN "livestock_type";--> statement-breakpoint
DROP TYPE "public"."livestock_type";