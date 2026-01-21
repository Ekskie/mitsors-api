CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"display_name" text,
	"first_name" text,
	"last_name" text,
	"provider" text NOT NULL,
	"provider_id" text NOT NULL,
	"picture" text,
	"region" text,
	"city" text,
	"user_roles" jsonb DEFAULT '["user"]'::jsonb,
	"verification_status" text DEFAULT 'unverified',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
