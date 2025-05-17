CREATE TABLE "chats" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"uuid" uuid NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"title" text,
	CONSTRAINT "chats_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "interactive_chat" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"uuid" uuid NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"input" text NOT NULL,
	"output" text,
	"title" text,
	CONSTRAINT "interactive_chat_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"chat_id" integer NOT NULL,
	"message" text NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"role" varchar(20) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chats_user_idx" ON "chats" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "chats_created_at_idx" ON "chats" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "chats_user_created_idx" ON "chats" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "interactive_uuid_idx" ON "interactive_chat" USING btree ("uuid");--> statement-breakpoint
CREATE INDEX "interactive_user_idx" ON "interactive_chat" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "interactive_created_at_idx" ON "interactive_chat" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "interactive_user_date_idx" ON "interactive_chat" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "messages_chat_idx" ON "messages" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX "messages_user_idx" ON "messages" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "messages_chat_created_idx" ON "messages" USING btree ("chat_id","created_at");--> statement-breakpoint
CREATE INDEX "messages_role_idx" ON "messages" USING btree ("role");