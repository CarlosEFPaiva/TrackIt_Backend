CREATE TABLE "users" (
	"id" serial NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"name" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"image" varchar(2048) NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "sessions" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"token" uuid NOT NULL UNIQUE,
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "habits" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"creation_date" DATE NOT NULL,
	"delete_date" DATE,
	"current_sequence" integer NOT NULL,
	"highest_sequence" integer NOT NULL,
	"history_last_update" DATE NOT NULL,
	CONSTRAINT "habits_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "history" (
	"id" serial NOT NULL,
	"habit_id" integer NOT NULL,
	"date" DATE NOT NULL,
	"done" BOOLEAN NOT NULL,
	CONSTRAINT "history_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "habit_days" (
	"id" serial NOT NULL,
	"habit_id" integer NOT NULL,
	"weekday" integer NOT NULL,
	UNIQUE ("habit_id", "weekday"),
	CONSTRAINT "habit_days_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "habits" ADD CONSTRAINT "habits_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "history" ADD CONSTRAINT "history_fk0" FOREIGN KEY ("habit_id") REFERENCES "habits"("id");

ALTER TABLE "habit_days" ADD CONSTRAINT "habit_days_fk0" FOREIGN KEY ("habit_id") REFERENCES "habits"("id");






