import { z } from "zod";

// ============================================
// ENUM SCHEMAS (Sync with schema.prisma)
// ============================================

export const StatusPublishSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);
export const StatusKonservasiSchema = z.enum(["MAINTAINED", "TREATED", "CRITICAL", "ARCHIVED"]);
export const StatusCoordinatorSchema = z.enum(["ACTIVE", "INACTIVE", "ALUMNI"]);
export const AssetTypeSchema = z.enum(["PHOTO", "AUDIO", "VIDEO", "MODEL_3D"]);
export const ReferenceTypeSchema = z.enum(["JOURNAL", "BOOK", "ARTICLE", "WEBSITE", "REPORT", "THESIS", "DISSERTATION", "FIELD_NOTE"]);
export const StatusFileSchema = z.enum(["ACTIVE", "PROCESSING", "ARCHIVED", "CORRUPTED"]);

// ============================================
// ENTITY SCHEMAS (Sync with schema.prisma models)
// ============================================

export const CultureSchema = z.object({
  cultureId: z.number(),
  slug: z.string(),
  cultureName: z.string(),
  originIsland: z.string().nullable(),
  province: z.string().nullable(),
  cityRegion: z.string().nullable(),
  classification: z.string().nullable(),
  characteristics: z.string().nullable(),
  conservationStatus: StatusKonservasiSchema,
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  status: StatusPublishSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const SubcultureSchema = z.object({
  subcultureId: z.number(),
  slug: z.string(),
  subcultureName: z.string(),
  traditionalGreeting: z.string(),
  greetingMeaning: z.string().nullable(),
  explanation: z.string(),
  cultureId: z.number(),
  status: StatusPublishSchema,
  displayPriorityStatus: z.enum(["HIGH", "MEDIUM", "LOW", "HIDDEN"]).nullable(),
  conservationStatus: StatusKonservasiSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CodificationDomainSchema = z.object({
  domainId: z.number(),
  code: z.string(),
  domainName: z.string(),
  explanation: z.string(),
  subcultureId: z.number(),
  status: StatusPublishSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ContributorSchema = z.object({
  contributorId: z.number(),
  contributorName: z.string(),
  institution: z.string(),
  email: z.string(),
  expertiseArea: z.string(),
  contactInfo: z.string(),
  displayPriorityStatus: z.enum(["HIGH", "MEDIUM", "LOW", "HIDDEN"]).nullable(),
  isCoordinator: z.boolean(),
  coordinatorStatus: StatusCoordinatorSchema,
  registeredAt: z.date(),
});

export const AssetSchema = z.object({
  assetId: z.number(),
  fileName: z.string(),
  fileType: AssetTypeSchema,
  description: z.string().nullable(),
  url: z.string(),
  fileSize: z.string().nullable(),
  hashChecksum: z.string().nullable(),
  metadataJson: z.string().nullable(),
  status: StatusFileSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ReferenceSchema = z.object({
  referenceId: z.number(),
  title: z.string(),
  referenceType: ReferenceTypeSchema,
  description: z.string().nullable(),
  url: z.string().nullable(),
  authors: z.string().nullable(),
  publicationYear: z.string().nullable(),
  topicCategory: z.string().nullable(),
  status: StatusPublishSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const LexiconSchema = z.object({
  lexiconId: z.number(),
  slug: z.string(),
  lexiconWord: z.string(),
  ipaInternationalPhoneticAlphabet: z.string(),
  transliteration: z.string(),
  etymologicalMeaning: z.string(),
  culturalMeaning: z.string(),
  commonMeaning: z.string(),
  translation: z.string(),
  variant: z.string().nullable(),
  variantTranslations: z.string().nullable(),
  otherDescription: z.string().nullable(),
  domainId: z.number(),
  preservationStatus: StatusKonservasiSchema,
  contributorId: z.number(),
  status: StatusPublishSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ============================================
// RELATION SCHEMAS (For complex responses)
// ============================================

export const CultureWithSubculturesSchema = CultureSchema.extend({
  subcultures: z.array(SubcultureSchema),
});

export const SubcultureWithDetailsSchema = SubcultureSchema.extend({
  codificationDomains: z.array(CodificationDomainSchema),
  culture: CultureSchema,
});

export const LexiconWithDetailsSchema = LexiconSchema.extend({
  contributor: ContributorSchema,
  codificationDomain: CodificationDomainSchema,
  lexiconAssets: z.array(z.object({
    asset: AssetSchema,
    assetRole: z.enum(["GALLERY", "PRONUNCIATION", "VIDEO_DEMO", "MODEL_3D"]),
  })),
  lexiconReferences: z.array(z.object({
    reference: ReferenceSchema,
    citationNote: z.enum(["DIRECT_QUOTE", "PARAPHRASE", "INTERPRETATION", "FIELD_OBSERVATION", "ORAL_TRADITION", "SECONDARY_SOURCE", "GENERAL_REFERENCE"]).nullable(),
  })),
});

export const ContributorWithAssetsSchema = ContributorSchema.extend({
  contributorAssets: z.array(z.object({
    asset: AssetSchema,
    assetNote: z.enum(["LOGO", "SELF_PHOTO", "SIGNATURE", "CERTIFICATE", "GALLERY", "VIDEO_DEMO"]),
  })),
});

// ============================================
// QUERY/REQUEST SCHEMAS
// ============================================

export const heroQuerySchema = z.object({
  cultureId: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : 1)), // default cultureId 1
});

export const PaginationQuerySchema = z.object({
  page: z.string().optional().transform((v) => v ? parseInt(v) : 1),
  limit: z.string().optional().transform((v) => v ? parseInt(v) : 10),
});

export const SearchQuerySchema = z.object({
  q: z.string().min(1, "Search query is required"),
  page: z.string().optional().transform((v) => v ? parseInt(v) : 1),
  limit: z.string().optional().transform((v) => v ? parseInt(v) : 20),
});

// ============================================
// RESPONSE SCHEMAS
// ============================================

export const HeroResponseSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  province: z.string().nullable(),
  subcultures: z.array(SubcultureSchema),
});

export const StatisticsSchema = z.object({
  totalCultures: z.number(),
  totalSubcultures: z.number(),
  totalLexicons: z.number(),
  totalContributors: z.number(),
});

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(dataSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export const SingleResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => z.object({
  success: z.boolean(),
  message: z.string(),
  data: dataSchema,
});

// ============================================
// CONTACT FORM SCHEMA
// ============================================

export const ContactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});
