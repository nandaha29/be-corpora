/**
 * ===========================================
 * ZOD VALIDATION SCHEMAS
 * ===========================================
 * 
 * File: src/lib/validators.ts
 * Library: Zod (runtime schema validation)
 * 
 * Purpose:
 * Define and export validation schemas for all API endpoints.
 * Used in controllers to validate request body data before processing.
 * 
 * Benefits:
 * - Type-safe validation with TypeScript inference
 * - Detailed error messages for invalid data
 * - Automatic type generation for inputs
 * - Runtime validation (not just compile-time)
 * 
 * Schema Categories:
 * - Admin Authentication (register, login, update)
 * - Culture (create, update)
 * - Subculture (create, update)
 * - Codification Domain (create, update)
 * - Lexicon (create, update, asset, reference)
 * - Contributor (create, update, asset)
 * - Reference (create, update)
 * - Asset (create, update)
 * 
 * Usage Example:
 * ```typescript
 * import { createLexiconSchema } from '../../lib/validators.js';
 * 
 * const validatedData = createLexiconSchema.parse(req.body);
 * // validatedData is now typed as CreateLexiconInput
 * ```
 * 
 * Enum Types (from Prisma):
 * - AdminRole: EDITOR, ADMIN, SUPER_ADMIN
 * - StatusPublish: DRAFT, PUBLISHED, ARCHIVED
 * - StatusKonservasi: MAINTAINED, TREATED, CRITICAL, ARCHIVED
 * - StatusPriority: HIGH, MEDIUM, LOW
 * - ReferenceType: JOURNAL, BOOK, ARTICLE, WEBSITE, REPORT, THESIS, DISSERTATION, FIELD_NOTE
 * - AssetType: PHOTO, AUDIO, VIDEO, MODEL_3D
 * - LeksikonAssetRole: GALLERY, PRONUNCIATION, VIDEO_DEMO, MODEL_3D
 * - LexiconReferenceRole: PRIMARY_SOURCE, SECONDARY_SOURCE, SUPPORTING
 * 
 * @module lib/validators
 * @author Development Team
 * @since 2025-01-01
 */

import { z } from "zod";
import { ContributorAssetRole, SubcultureAssetRole, CultureAssetRole, LeksikonAssetRole, CultureReferenceRole, SubcultureReferenceRole, LexiconReferenceRole, AdminRole, StatusPublish, StatusKonservasi, StatusPriority, ReferenceType, AssetType } from "@prisma/client";

/* =======================
   🔐 ADMIN AUTHENTICATION
======================= */
export const adminRegisterSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }).max(50),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  role: z.nativeEnum(AdminRole).default(AdminRole.EDITOR).optional(),
  isActive: z.boolean().default(true).optional(),
});

export const adminLoginSchema = z.object({
  email: z.string().refine(val => val.length > 0, { message: "Email is required" }).email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const updateAdminSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }).max(50).optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  role: z.nativeEnum(AdminRole).optional(),
  isActive: z.boolean().optional(),
});

export type AdminRegisterInput = z.infer<typeof adminRegisterSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;

/* =======================
   🏛️ CULTURE
======================= */
export const createCultureSchema = z.object({
  cultureName: z.string().min(1, { message: "Culture name is required" }),
  originIsland: z.string().min(1, { message: "Origin island is required" }),
  province: z.string().min(1, { message: "Province is required" }),
  cityRegion: z.string().min(1, { message: "City/Region is required" }),
  classification: z.string().optional(),
  characteristics: z.string().optional(),
  conservationStatus: z.nativeEnum(StatusKonservasi).default(StatusKonservasi.TREATED).optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  status: z.nativeEnum(StatusPublish).default(StatusPublish.DRAFT).optional(),
});
export const updateCultureSchema = createCultureSchema.partial();
export type CreateCultureInput = z.infer<typeof createCultureSchema>;
export type UpdateCultureInput = z.infer<typeof updateCultureSchema>;

/* =======================
   🧩 SUBCULTURE
======================= */
export const createSubcultureSchema = z.object({
  subcultureName: z.string().min(1, { message: "Subculture name is required" }),
  traditionalGreeting: z.string().min(1, { message: "Traditional greeting is required" }),
  greetingMeaning: z.string().optional(),
  explanation: z.string().min(1, { message: "Explanation is required" }),
  cultureId: z.number().min(1, { message: "Culture ID is required" }),
  status: z.nativeEnum(StatusPublish).default(StatusPublish.DRAFT).optional(),
  conservationStatus: z.nativeEnum(StatusKonservasi).default(StatusKonservasi.TREATED).optional(),
  displayPriorityStatus: z.nativeEnum(StatusPriority).default(StatusPriority.LOW).optional(),
});
export const updateSubcultureSchema = createSubcultureSchema.partial();
export type CreateSubcultureInput = z.infer<typeof createSubcultureSchema>;
export type UpdateSubcultureInput = z.infer<typeof updateSubcultureSchema>;

/* =======================
   🧠 CODIFICATION DOMAIN
======================= */
export const createCodificationDomainSchema = z.object({
  code: z.string().min(1, { message: "Code is required" }),
  domainName: z.string().min(1, { message: "Domain name is required" }),
  explanation: z.string().min(1, { message: "Explanation is required" }),
  subcultureId: z.number().min(1, { message: "Subculture ID is required" }),
  status: z.nativeEnum(StatusPublish).default(StatusPublish.DRAFT).optional(),
});

export const updateCodificationDomainSchema = createCodificationDomainSchema.partial();
export type CreateCodificationDomainInput = z.infer<typeof createCodificationDomainSchema>;
export type UpdateCodificationDomainInput = z.infer<typeof updateCodificationDomainSchema>;

/* =======================
   📖 LEXICON
======================= */
export const createLexiconSchema = z.object({
  lexiconWord: z.string().min(1, { message: "Lexicon word is required" }),
  ipaInternationalPhoneticAlphabet: z.string().min(1, { message: "IPA (international phonetic alphabet) is required" }),
  transliteration: z.string().min(1, { message: "Transliteration is required" }),
  etymologicalMeaning: z.string().min(1, { message: "Etymological meaning is required" }),
  culturalMeaning: z.string().min(1, { message: "Cultural meaning is required" }),
  commonMeaning: z.string().min(1, { message: "Common meaning is required" }),
  translation: z.string().min(1, { message: "Translation is required" }),
  variant: z.string().optional(),
  variantTranslations: z.string().optional(),
  otherDescription: z.string().optional(),
  domainId: z.number().min(1, { message: "Domain ID is required" }),
  contributorId: z.number().min(1, { message: "Contributor ID is required" }),
  preservationStatus: z.nativeEnum(StatusKonservasi).default(StatusKonservasi.MAINTAINED).optional(),
  status: z.nativeEnum(StatusPublish).default(StatusPublish.DRAFT).optional(),
});
export const updateLexiconSchema = createLexiconSchema.partial();
export type CreateLexiconInput = z.infer<typeof createLexiconSchema>;
export type UpdateLexiconInput = z.infer<typeof updateLexiconSchema>;

/* =======================
   📚 REFERENCE
======================= */
export const createReferenceSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  referenceType: z.nativeEnum(ReferenceType, {
    message: "Reference type must be one of: JOURNAL, BOOK, ARTICLE, WEBSITE, REPORT, ORAL_TRADITION, FIELD_OBSERVATION",
  }),
  description: z.string().optional(),
  url: z.string().url({ message: "Invalid URL" }).optional(),
  authors: z.string().optional(),
  publicationYear: z.string().optional(),
  topicCategory: z.string().optional(),
  status: z.nativeEnum(StatusPublish).default(StatusPublish.DRAFT).optional(),
});
export const updateReferenceSchema = createReferenceSchema.partial();
export type CreateReferenceInput = z.infer<typeof createReferenceSchema>;
export type UpdateReferenceInput = z.infer<typeof updateReferenceSchema>;

/* =======================
   👤 CONTRIBUTOR
======================= */
export const createContributorSchema = z.object({
  contributorName: z.string().min(1, { message: "Contributor name is required" }),
  institution: z.string().min(1, { message: "Institution is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  expertiseArea: z.string().min(1, { message: "Expertise area is required" }),
  contactInfo: z.string().min(1, { message: "Contact info is required" }),
  displayPriorityStatus: z.nativeEnum(StatusPriority).default(StatusPriority.LOW).optional(),
  isCoordinator: z.boolean().default(false).optional(),
  coordinatorStatus: z.enum(["ACTIVE", "INACTIVE", "ALUMNI"]).default("INACTIVE").optional(),
});
export const updateContributorSchema = createContributorSchema.partial();
export type CreateContributorInput = z.infer<typeof createContributorSchema>;
export type UpdateContributorInput = z.infer<typeof updateContributorSchema>;

/* =======================
   🖼️ ASSETS
======================= */
export const createAssetSchema = z.object({
  fileName: z.string().min(1, { message: "File name is required" }),
  fileType: z.nativeEnum(AssetType, {
    message: "File type must be one of: PHOTO, AUDIO, VIDEO, MODEL_3D",
  }),
  description: z.string().optional(),
  url: z.string().optional(),
  fileSize: z.string().optional(),
  hashChecksum: z.string().optional(),
  metadataJson: z.string().optional(),
  status: z.enum(["ACTIVE", "PROCESSING", "ARCHIVED", "CORRUPTED"]).default("ARCHIVED").optional(),
}).refine((data) => {
  if (['VIDEO', 'MODEL_3D'].includes(data.fileType)) {
    return data.url !== undefined;
  }
  return true;
}, { message: "URL is required for VIDEO and MODEL_3D types" });
export const updateAssetSchema = createAssetSchema.partial();
export type CreateAssetInput = z.infer<typeof createAssetSchema>;
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;

/* =======================
   🔗 RELATIONS
======================= */
export const createLexiconAssetSchema = z.object({
  lexiconId: z.number().min(1, { message: "Lexicon ID is required" }),
  assetId: z.number().min(1, { message: "Asset ID is required" }),
  assetRole: z.nativeEnum(LeksikonAssetRole, { message: "Asset role must be one of: GALLERY, PRONUNCIATION, VIDEO_DEMO, MODEL_3D" }),
});
export const updateAssetRoleSchema = z.object({
  assetRole: z.nativeEnum(LeksikonAssetRole, { message: "Asset role must be one of: GALLERY, PRONUNCIATION, VIDEO_DEMO, MODEL_3D" }),
});
export const createSubcultureAssetSchema = z.object({
  subcultureId: z.number().min(1, { message: "Subculture ID is required" }),
  assetId: z.number().min(1, { message: "Asset ID is required" }),
  assetRole: z.nativeEnum(SubcultureAssetRole, { message: "Asset role must be one of: HIGHLIGHT, THUMBNAIL, GALLERY, BANNER, VIDEO_DEMO, MODEL_3D" }),
});
export const createCultureAssetSchema = z.object({
  cultureId: z.number().min(1, { message: "Culture ID is required" }),
  assetId: z.number().min(1, { message: "Asset ID is required" }),
  assetRole: z.nativeEnum(CultureAssetRole, { message: "Asset role must be one of: HIGHLIGHT, THUMBNAIL, GALLERY, BANNER, VIDEO_DEMO, MODEL_3D" }),
});
export const createCultureReferenceSchema = z.object({
  cultureId: z.number().min(1, { message: "Culture ID is required" }),
  referenceId: z.number().min(1, { message: "Reference ID is required" }),
  referenceRole: z.nativeEnum(CultureReferenceRole, { message: "Reference role must be one of: PRIMARY_SOURCE, SECONDARY_SOURCE, SUPPORTING" }).optional(),
});
export const createLexiconReferenceSchema = z.object({
  lexiconId: z.number().min(1, { message: "Lexicon ID is required" }),
  referenceId: z.number().min(1, { message: "Reference ID is required" }),
  referenceRole: z.nativeEnum(LexiconReferenceRole, { message: "Reference role must be one of: PRIMARY_SOURCE, SECONDARY_SOURCE, SUPPORTING" }).optional(),
});
export const createSubcultureReferenceSchema = z.object({
  subcultureId: z.number().min(1, { message: "Subculture ID is required" }),
  referenceId: z.number().min(1, { message: "Reference ID is required" }),
  lexiconId: z.number().optional(),
  referenceRole: z.nativeEnum(SubcultureReferenceRole, { message: "Reference role must be one of: PRIMARY_SOURCE, SECONDARY_SOURCE, SUPPORTING" }).optional(),
});
export const createContributorAssetSchema = z.object({
  contributorId: z.number().min(1, { message: "Contributor ID is required" }),
  assetId: z.number().min(1, { message: "Asset ID is required" }),
  assetNote: z.nativeEnum(ContributorAssetRole, { message: "Asset role must be one of: LOGO, SELF_PHOTO, SIGNATURE, CERTIFICATE, GALLERY, VIDEO_DEMO" }),
});
export const updateLexiconReferenceRoleSchema = z.object({
  referenceRole: z.nativeEnum(LexiconReferenceRole, { message: "Reference role must be one of: PRIMARY_SOURCE, SECONDARY_SOURCE, SUPPORTING" }).optional(),
});

export const updateSubcultureReferenceRoleSchema = z.object({
  referenceRole: z.nativeEnum(SubcultureReferenceRole, { message: "Reference role must be one of: PRIMARY_SOURCE, SECONDARY_SOURCE, SUPPORTING" }).optional(),
});

export const updateCultureReferenceRoleSchema = z.object({
  referenceRole: z.nativeEnum(CultureReferenceRole, { message: "Reference role must be one of: PRIMARY_SOURCE, SECONDARY_SOURCE, SUPPORTING" }).optional(),
});

export const createAboutReferenceSchema = z.object({
  referenceId: z.number().min(1, { message: "Reference ID is required" }),
  displayOrder: z.number().min(0, { message: "Display order must be 0 or greater" }).optional(),
  isActive: z.boolean().optional(),
});

export const updateAboutReferenceSchema = z.object({
  referenceId: z.number().min(1, { message: "Reference ID is required" }).optional(),
  displayOrder: z.number().min(0, { message: "Display order must be 0 or greater" }).optional(),
  isActive: z.boolean().optional(),
});

export type CreateLexiconAssetInput = z.infer<typeof createLexiconAssetSchema>;
export type CreateSubcultureAssetInput = z.infer<typeof createSubcultureAssetSchema>;
export type CreateCultureAssetInput = z.infer<typeof createCultureAssetSchema>;
export type CreateLexiconReferenceInput = z.infer<typeof createLexiconReferenceSchema>;
export type CreateSubcultureReferenceInput = z.infer<typeof createSubcultureReferenceSchema>;
export type CreateCultureReferenceInput = z.infer<typeof createCultureReferenceSchema>;
export type CreateContributorAssetInput = z.infer<typeof createContributorAssetSchema>;
export type UpdateLexiconReferenceRoleInput = z.infer<typeof updateLexiconReferenceRoleSchema>;
export type UpdateSubcultureReferenceRoleInput = z.infer<typeof updateSubcultureReferenceRoleSchema>;
export type UpdateCultureReferenceRoleInput = z.infer<typeof updateCultureReferenceRoleSchema>;
export type CreateAboutReferenceInput = z.infer<typeof createAboutReferenceSchema>;
export type UpdateAboutReferenceInput = z.infer<typeof updateAboutReferenceSchema>;


