CREATE TABLE "admin_actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_id" integer NOT NULL,
	"action" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" integer,
	"details" text,
	"performed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"emoji" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"color" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "juice_packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"juice_amount" numeric(5, 2) NOT NULL,
	"bonus_amount" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"price" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "juice_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"amount" numeric(5, 2) NOT NULL,
	"balance_after" numeric(5, 2) NOT NULL,
	"story_id" integer,
	"message_id" integer,
	"description" text,
	"metadata" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"story_id" integer NOT NULL,
	"content" text NOT NULL,
	"is_incoming" boolean NOT NULL,
	"timestamp" text NOT NULL,
	"has_read_receipt" boolean DEFAULT false NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"status" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"subscription_plan_id" integer,
	"billing_period_start" timestamp,
	"billing_period_end" timestamp,
	"juice_package_id" integer,
	"juice_amount" numeric(5, 2),
	"messages_count" integer,
	"price_per_message" numeric(3, 2),
	"stripe_payment_intent_id" text,
	"payment_method" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reading_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"story_id" integer NOT NULL,
	"started_at" timestamp DEFAULT now(),
	"ended_at" timestamp,
	"messages_read" integer DEFAULT 0 NOT NULL,
	"juice_consumed" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"shared_for_continuation" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stories" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"image_url" text NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"shares" integer DEFAULT 0 NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"is_hot" boolean DEFAULT false NOT NULL,
	"is_new" boolean DEFAULT false NOT NULL,
	"is_viral" boolean DEFAULT false NOT NULL,
	"difficulty" text DEFAULT 'easy' NOT NULL,
	"duration" integer DEFAULT 5 NOT NULL,
	"has_audio" boolean DEFAULT false NOT NULL,
	"has_images" boolean DEFAULT false NOT NULL,
	"cliffhanger_level" integer DEFAULT 3 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"interval" text NOT NULL,
	"features" text[] NOT NULL,
	"juice_per_day" integer,
	"max_stories_per_day" integer NOT NULL,
	"has_unlimited_access" boolean DEFAULT false NOT NULL,
	"recharge_rate" numeric(3, 2) DEFAULT '1.00' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"achievement_id" text NOT NULL,
	"unlocked_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_shares" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"story_id" integer NOT NULL,
	"platform" text NOT NULL,
	"shared_at" timestamp DEFAULT now(),
	"unlocked" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text,
	"password" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"profile_image_url" text,
	"is_admin" boolean DEFAULT false NOT NULL,
	"juice_level" numeric(5, 2) DEFAULT '100.00' NOT NULL,
	"max_juice_level" numeric(5, 2) DEFAULT '100.00' NOT NULL,
	"last_juice_refill" timestamp DEFAULT now(),
	"subscription_plan_id" integer,
	"subscription_status" text DEFAULT 'none' NOT NULL,
	"subscription_expires_at" timestamp,
	"subscription_started_at" timestamp,
	"stories_read" integer DEFAULT 0 NOT NULL,
	"stories_shared" integer DEFAULT 0 NOT NULL,
	"messages_read" integer DEFAULT 0 NOT NULL,
	"total_juice_consumed" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"total_juice_purchased" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"total_spent" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"longest_streak" integer DEFAULT 0 NOT NULL,
	"last_active_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
