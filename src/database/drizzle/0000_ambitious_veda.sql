DO $$ BEGIN
	CREATE TYPE "public"."livestock_type" AS ENUM('fattener', 'piglet', 'both');
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	CREATE TYPE "public"."price_verification_status" AS ENUM('verified', 'unverified');
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE "price_inputs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid,
	"price_verification_status" "price_verification_status" DEFAULT 'unverified' NOT NULL,
	"region" text NOT NULL,
	"city" text NOT NULL,
	"price_per_kg" numeric(10, 2) NOT NULL,
	"livestock_type" "livestock_type",
	"breed" text,
	"notes" text,
	"date_observed" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
