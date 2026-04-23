CREATE TABLE "order_admin_action" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"admin_email" text NOT NULL,
	"action" text NOT NULL,
	"reason" text,
	"before_state" text,
	"after_state" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "order_admin_action_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE cascade
);
