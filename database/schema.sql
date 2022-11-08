set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."users" (
	"userId" serial NOT NULL,
	"username" text NOT NULL UNIQUE,
	"password" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"createdAt" TIMESTAMPTZ NOT NULL default now(),
	"userPkmn" integer NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."leaders" (
	"leaderId" serial NOT NULL,
  "leaderName" text NOT NULL,
  "leaderPic" text NOT NULL,
	"leaderPkmn" integer NOT NULL UNIQUE,
	CONSTRAINT "leaders_pk" PRIMARY KEY ("leaderId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."pokemon" (
	"pokemonId" serial NOT NULL,
	"statusMove" text NOT NULL,
	"physicalMove" text NOT NULL,
	"specialMove" text NOT NULL,
	"dexNumber" integer NOT NULL UNIQUE,
  "pkmnName" text NOT NULL UNIQUE,
	"sprite" text NOT NULL UNIQUE,
	CONSTRAINT "pokemon_pk" PRIMARY KEY ("pokemonId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."recordList" (
	"userId" integer NOT NULL,
	"recordId" serial,
	"result" text NOT NULL,
	"userPkmn" integer NOT NULL,
	"leaderPkmn" integer NOT NULL,
	CONSTRAINT "recordList_pk" PRIMARY KEY ("recordId")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "users" ADD CONSTRAINT "users_fk0" FOREIGN KEY ("userPkmn") REFERENCES "pokemon"("pokemonId");
ALTER TABLE "leaders" ADD CONSTRAINT "leaders_fk0" FOREIGN KEY ("leaderPkmn") REFERENCES "pokemon"("pokemonId");
ALTER TABLE "recordList" ADD CONSTRAINT "recordList_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "recordList" ADD CONSTRAINT "recordList_fk1" FOREIGN KEY ("userPkmn") REFERENCES "pokemon"("pokemonId");
ALTER TABLE "recordList" ADD CONSTRAINT "recordList_fk2" FOREIGN KEY ("leaderPkmn") REFERENCES "pokemon"("pokemonId");
