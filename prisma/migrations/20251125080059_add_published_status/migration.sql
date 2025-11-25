-- CreateEnum
CREATE TYPE "public"."AdminRole" AS ENUM ('SUPER_ADMIN', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "public"."StatusCoordinator" AS ENUM ('ACTIVE', 'INACTIVE', 'ALUMNI');

-- CreateEnum
CREATE TYPE "public"."ReferenceType" AS ENUM ('JOURNAL', 'BOOK', 'ARTICLE', 'WEBSITE', 'REPORT', 'THESIS', 'DISSERTATION', 'FIELD_NOTE');

-- CreateEnum
CREATE TYPE "public"."AssetType" AS ENUM ('PHOTO', 'AUDIO', 'VIDEO', 'MODEL_3D');

-- CreateEnum
CREATE TYPE "public"."StatusPublish" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."StatusFile" AS ENUM ('ACTIVE', 'PROCESSING', 'ARCHIVED', 'CORRUPTED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "public"."StatusKonservasi" AS ENUM ('MAINTAINED', 'TREATED', 'CRITICAL', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."CitationNoteType" AS ENUM ('DIRECT_QUOTE', 'PARAPHRASE', 'INTERPRETATION', 'FIELD_OBSERVATION', 'ORAL_TRADITION', 'SECONDARY_SOURCE', 'GENERAL_REFERENCE');

-- CreateEnum
CREATE TYPE "public"."StatusPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW', 'HIDDEN');

-- CreateEnum
CREATE TYPE "public"."CultureAssetRole" AS ENUM ('HIGHLIGHT', 'THUMBNAIL', 'GALLERY', 'BANNER', 'VIDEO_DEMO', 'MODEL_3D');

-- CreateEnum
CREATE TYPE "public"."SubcultureAssetRole" AS ENUM ('HIGHLIGHT', 'THUMBNAIL', 'GALLERY', 'BANNER', 'VIDEO_DEMO', 'MODEL_3D');

-- CreateEnum
CREATE TYPE "public"."LeksikonAssetRole" AS ENUM ('GALLERY', 'PRONUNCIATION', 'VIDEO_DEMO', 'MODEL_3D');

-- CreateEnum
CREATE TYPE "public"."ContributorAssetRole" AS ENUM ('LOGO', 'SELF_PHOTO', 'SIGNATURE', 'CERTIFICATE', 'GALLERY', 'VIDEO_DEMO');

-- CreateTable
CREATE TABLE "public"."ADMIN" (
    "admin_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."AdminRole" NOT NULL DEFAULT 'EDITOR',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ADMIN_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "public"."CULTURE" (
    "culture_id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "culture_name" TEXT NOT NULL,
    "origin_island" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city_region" TEXT NOT NULL,
    "classification" TEXT,
    "characteristics" TEXT,
    "conservation_status" "public"."StatusKonservasi" NOT NULL DEFAULT 'TREATED',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "status" "public"."StatusPublish" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CULTURE_pkey" PRIMARY KEY ("culture_id")
);

-- CreateTable
CREATE TABLE "public"."SUBCULTURE" (
    "subculture_id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "subculture_name" TEXT NOT NULL,
    "traditional_greeting" TEXT NOT NULL,
    "greeting_meaning" TEXT,
    "explanation" TEXT NOT NULL,
    "culture_id" INTEGER NOT NULL,
    "status" "public"."StatusPublish" NOT NULL DEFAULT 'DRAFT',
    "display_priority_status" "public"."StatusPriority" DEFAULT 'LOW',
    "conservation_status" "public"."StatusKonservasi" NOT NULL DEFAULT 'TREATED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SUBCULTURE_pkey" PRIMARY KEY ("subculture_id")
);

-- CreateTable
CREATE TABLE "public"."CODIFICATION_DOMAIN" (
    "domain_id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "domain_name" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "subculture_id" INTEGER NOT NULL,
    "status" "public"."StatusPublish" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CODIFICATION_DOMAIN_pkey" PRIMARY KEY ("domain_id")
);

-- CreateTable
CREATE TABLE "public"."LEXICON" (
    "lexicon_id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "lexicon_word" TEXT NOT NULL,
    "ipa_international_phonetic_alphabet" TEXT NOT NULL,
    "transliteration" TEXT NOT NULL,
    "etymological_meaning" TEXT NOT NULL,
    "cultural_meaning" TEXT NOT NULL,
    "common_meaning" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "variant" TEXT,
    "variant_translations" TEXT,
    "other_description" TEXT,
    "domain_id" INTEGER NOT NULL,
    "preservation_status" "public"."StatusKonservasi" NOT NULL DEFAULT 'MAINTAINED',
    "contributor_id" INTEGER NOT NULL,
    "status" "public"."StatusPublish" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LEXICON_pkey" PRIMARY KEY ("lexicon_id")
);

-- CreateTable
CREATE TABLE "public"."CONTRIBUTOR" (
    "contributor_id" SERIAL NOT NULL,
    "contributor_name" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expertise_area" TEXT NOT NULL,
    "contact_info" TEXT NOT NULL,
    "display_priority_status" "public"."StatusPriority" DEFAULT 'LOW',
    "is_coordinator" BOOLEAN NOT NULL DEFAULT false,
    "coordinator_status" "public"."StatusCoordinator" NOT NULL DEFAULT 'INACTIVE',
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CONTRIBUTOR_pkey" PRIMARY KEY ("contributor_id")
);

-- CreateTable
CREATE TABLE "public"."ASSET" (
    "asset_id" SERIAL NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" "public"."AssetType" NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "file_size" TEXT,
    "hash_checksum" TEXT,
    "metadata_json" TEXT,
    "status" "public"."StatusFile" NOT NULL DEFAULT 'ARCHIVED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ASSET_pkey" PRIMARY KEY ("asset_id")
);

-- CreateTable
CREATE TABLE "public"."REFERENCE" (
    "reference_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "reference_type" "public"."ReferenceType" NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "authors" TEXT,
    "publication_year" TEXT,
    "topic_category" TEXT,
    "status" "public"."StatusPublish" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "REFERENCE_pkey" PRIMARY KEY ("reference_id")
);

-- CreateTable
CREATE TABLE "public"."LEXICON_ASSETS" (
    "lexicon_id" INTEGER NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "asset_role" "public"."LeksikonAssetRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LEXICON_ASSETS_pkey" PRIMARY KEY ("lexicon_id","asset_id")
);

-- CreateTable
CREATE TABLE "public"."SUBCULTURE_ASSETS" (
    "subculture_id" INTEGER NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "asset_role" "public"."SubcultureAssetRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SUBCULTURE_ASSETS_pkey" PRIMARY KEY ("subculture_id","asset_id","asset_role")
);

-- CreateTable
CREATE TABLE "public"."CULTURE_ASSETS" (
    "culture_id" INTEGER NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "asset_role" "public"."CultureAssetRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CULTURE_ASSETS_pkey" PRIMARY KEY ("culture_id","asset_id")
);

-- CreateTable
CREATE TABLE "public"."CONTRIBUTOR_ASSETS" (
    "contributor_id" INTEGER NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "asset_note" "public"."ContributorAssetRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CONTRIBUTOR_ASSETS_pkey" PRIMARY KEY ("contributor_id","asset_id")
);

-- CreateTable
CREATE TABLE "public"."LEXICON_REFERENCE" (
    "lexicon_id" INTEGER NOT NULL,
    "reference_id" INTEGER NOT NULL,
    "citation_note" "public"."CitationNoteType",
    "display_order" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LEXICON_REFERENCE_pkey" PRIMARY KEY ("lexicon_id","reference_id")
);

-- CreateTable
CREATE TABLE "public"."SUBCULTURE_REFERENCE" (
    "subculture_id" INTEGER NOT NULL,
    "reference_id" INTEGER NOT NULL,
    "citation_note" "public"."CitationNoteType",
    "display_order" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SUBCULTURE_REFERENCE_pkey" PRIMARY KEY ("subculture_id","reference_id")
);

-- CreateTable
CREATE TABLE "public"."CULTURE_REFERENCE" (
    "culture_id" INTEGER NOT NULL,
    "reference_id" INTEGER NOT NULL,
    "citation_note" "public"."CitationNoteType",
    "display_order" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CULTURE_REFERENCE_pkey" PRIMARY KEY ("culture_id","reference_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ADMIN_username_key" ON "public"."ADMIN"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ADMIN_email_key" ON "public"."ADMIN"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CULTURE_slug_key" ON "public"."CULTURE"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SUBCULTURE_slug_key" ON "public"."SUBCULTURE"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "LEXICON_slug_key" ON "public"."LEXICON"("slug");

-- AddForeignKey
ALTER TABLE "public"."SUBCULTURE" ADD CONSTRAINT "SUBCULTURE_culture_id_fkey" FOREIGN KEY ("culture_id") REFERENCES "public"."CULTURE"("culture_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CODIFICATION_DOMAIN" ADD CONSTRAINT "CODIFICATION_DOMAIN_subculture_id_fkey" FOREIGN KEY ("subculture_id") REFERENCES "public"."SUBCULTURE"("subculture_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LEXICON" ADD CONSTRAINT "LEXICON_contributor_id_fkey" FOREIGN KEY ("contributor_id") REFERENCES "public"."CONTRIBUTOR"("contributor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LEXICON" ADD CONSTRAINT "LEXICON_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "public"."CODIFICATION_DOMAIN"("domain_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LEXICON_ASSETS" ADD CONSTRAINT "LEXICON_ASSETS_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."ASSET"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LEXICON_ASSETS" ADD CONSTRAINT "LEXICON_ASSETS_lexicon_id_fkey" FOREIGN KEY ("lexicon_id") REFERENCES "public"."LEXICON"("lexicon_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SUBCULTURE_ASSETS" ADD CONSTRAINT "SUBCULTURE_ASSETS_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."ASSET"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SUBCULTURE_ASSETS" ADD CONSTRAINT "SUBCULTURE_ASSETS_subculture_id_fkey" FOREIGN KEY ("subculture_id") REFERENCES "public"."SUBCULTURE"("subculture_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CULTURE_ASSETS" ADD CONSTRAINT "CULTURE_ASSETS_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."ASSET"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CULTURE_ASSETS" ADD CONSTRAINT "CULTURE_ASSETS_culture_id_fkey" FOREIGN KEY ("culture_id") REFERENCES "public"."CULTURE"("culture_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CONTRIBUTOR_ASSETS" ADD CONSTRAINT "CONTRIBUTOR_ASSETS_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."ASSET"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CONTRIBUTOR_ASSETS" ADD CONSTRAINT "CONTRIBUTOR_ASSETS_contributor_id_fkey" FOREIGN KEY ("contributor_id") REFERENCES "public"."CONTRIBUTOR"("contributor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LEXICON_REFERENCE" ADD CONSTRAINT "LEXICON_REFERENCE_lexicon_id_fkey" FOREIGN KEY ("lexicon_id") REFERENCES "public"."LEXICON"("lexicon_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LEXICON_REFERENCE" ADD CONSTRAINT "LEXICON_REFERENCE_reference_id_fkey" FOREIGN KEY ("reference_id") REFERENCES "public"."REFERENCE"("reference_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SUBCULTURE_REFERENCE" ADD CONSTRAINT "SUBCULTURE_REFERENCE_subculture_id_fkey" FOREIGN KEY ("subculture_id") REFERENCES "public"."SUBCULTURE"("subculture_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SUBCULTURE_REFERENCE" ADD CONSTRAINT "SUBCULTURE_REFERENCE_reference_id_fkey" FOREIGN KEY ("reference_id") REFERENCES "public"."REFERENCE"("reference_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CULTURE_REFERENCE" ADD CONSTRAINT "CULTURE_REFERENCE_culture_id_fkey" FOREIGN KEY ("culture_id") REFERENCES "public"."CULTURE"("culture_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CULTURE_REFERENCE" ADD CONSTRAINT "CULTURE_REFERENCE_reference_id_fkey" FOREIGN KEY ("reference_id") REFERENCES "public"."REFERENCE"("reference_id") ON DELETE RESTRICT ON UPDATE CASCADE;
