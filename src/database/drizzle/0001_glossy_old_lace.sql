CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"region" varchar(100) NOT NULL,
	"city" varchar(100) NOT NULL,
	"price_per_kg" numeric(10, 2) NOT NULL,
	"livestock_type" varchar(50),
	"breed" varchar(100),
	"notes" text,
	"verification_status" varchar(50) DEFAULT 'unverified',
	"date_observed" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
