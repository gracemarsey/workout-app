CREATE TABLE `user_preferences` (
	`user_id` text NOT NULL,
	`location` text DEFAULT 'gym' NOT NULL,
	`current_week` integer DEFAULT 1 NOT NULL,
	`current_cycle` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`username`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_exercise_preferences` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`preferred_reps` integer DEFAULT 10 NOT NULL,
	`preferred_weight` integer DEFAULT 0 NOT NULL,
	`last_used` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`username`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_dismissed_equipment` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`equipment_type` text NOT NULL,
	`dismissed_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`username`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `completed_workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`workout_type` text NOT NULL,
	`location` text NOT NULL,
	`date` text NOT NULL,
	`duration_minutes` integer,
	`exercises` text,
	`completed_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`username`) ON UPDATE no action ON DELETE no action
);
