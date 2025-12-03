import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAboutPageData = async () => {
  // Get landing data
  const publishedCultures = await prisma.culture.count({ where: { status: 'PUBLISHED' } });
  const publishedSubcultures = await prisma.subculture.count({ where: { status: 'PUBLISHED' } });
  const publishedLeksikons = await prisma.lexicon.count({ where: { status: 'PUBLISHED' } });
  const totalContributors = await prisma.contributor.count();
  const totalAssets = await prisma.asset.count();

  const visiMisiSection = {
    publishedCultures,
    publishedSubcultures,
    publishedLeksikons,
    totalContributors,
    totalAssets,
  };

  // Get team scientists
  const teamScientis = await prisma.contributor.findMany({
    where: { coordinatorStatus: 'ACTIVE' },
    select: {
      contributorName: true,
      expertiseArea: true,
      institution: true,
      email: true,
      displayPriorityStatus: true,
    },
    orderBy: [
      {
        displayPriorityStatus: 'asc', // HIGH comes first, then MEDIUM, LOW, HIDDEN
      },
      {
        contributorName: 'asc', // Secondary sort by name
      },
    ],
  });

  // Transform to match interface
  const transformedTeam = teamScientis.map(contributor => ({
    namaContributor: contributor.contributorName,
    expertiseArea: contributor.expertiseArea,
    institusi: contributor.institution,
    email: contributor.email,
  }));

  // Get collaboration assets (assuming contributor assets)
  const collaborationAssets = await prisma.contributorAsset.findMany({
    include: {
      asset: true,
      contributor: {
        select: {
          contributorName: true,
          institution: true,
        },
      },
    },
  });

  const transformedAssets = collaborationAssets.map(ca => ({
    asset: {
      url: ca.asset.url,
      namaFile: ca.asset.fileName,
      penjelasan: ca.asset.description || '',
      tipe: ca.asset.fileType.toLowerCase(),
    },
    contributor: {
      namaContributor: ca.contributor.contributorName,
      institusi: ca.contributor.institution,
    },
  }));

  // Static data for academic references (could be moved to DB later)
  const academicReferences = [
    {
      judul: "Tall Tree, Nest of the Wind - The Javanese Shadow-play Dewa Ruci Performed by Ki Anom Soeroto: A Study in Performance Philology",
      penulis: "Bernard Arps",
      tahunTerbit: "2016",
      tipeReferensi: "BOOK",
      citationNote: "GENERAL_REFERENCE",
      topicCategory: "CULTURAL_STUDIES",
      penjelasan: "Cultural linguistic studies in Central Java",
    },
    {
      judul: "Elements of General Linguistics",
      penulis: "Andre Martinet",
      tahunTerbit: "1960",
      tipeReferensi: "BOOK",
      citationNote: "GENERAL_REFERENCE",
      topicCategory: "LINGUISTICS",
      penjelasan: "A fundamental work on general linguistics",
    },
    {
      judul: "Corpora in Applied Linguistics",
      penulis: "Susan Hunston",
      tahunTerbit: "2002",
      tipeReferensi: "BOOK",
      citationNote: "GENERAL_REFERENCE",
      topicCategory: "LINGUISTICS",
      penjelasan: "A comprehensive guide to corpus use in applied linguistics",
    },
    {
      judul: "Pemetaan Kebudayaan di Jawa Timur",
      penulis: "Sutarto, Ayu",
      tahunTerbit: "2004",
      tipeReferensi: "REPORT",
      citationNote: "GENERAL_REFERENCE",
        topicCategory: "CULTURAL_STUDIES",
      penjelasan: "Results of cultural mapping in East Java by Komprawisda Jatim",
    },
    {
      judul: "Theater as Data",
      penulis: "Miguel Escobar Varela",
      tahunTerbit: "2021",
      tipeReferensi: "BOOK",
      citationNote: "GENERAL_REFERENCE",
        topicCategory: "PERFORMANCE_STUDIES",
      penjelasan: "Computational approaches in theatre research using digital data",
    },
    {
      judul: "Serat Wedhatama",
      penulis: "Mangkunegara IV",
      tahunTerbit: "1972",
      tipeReferensi: "JOURNAL",
      citationNote: "GENERAL_REFERENCE",
        topicCategory: "LITERATURE",
      penjelasan: "Didactic poetry sung in the form of macapat by Mangkunegara IV of Surakarta",
    },
    {
      judul: "Javaansch-Nederlandsch Handwoordenboek",
      penulis: "J.F.C. Gericke and A.C. Vreede",
      tahunTerbit: "1901",
      tipeReferensi: "BOOK",
      citationNote: "GENERAL_REFERENCE",
        topicCategory: "LINGUISTICS",
      penjelasan: "Javanese-Dutch dictionary expanded and improved by Dr. A.C. Vreede",
    },
    {
      judul: "Hindu Javanese: Tengger Tradition and Islam",
      penulis: "Robert W. Hefner",
      tahunTerbit: "1985",
      tipeReferensi: "BOOK",
      citationNote: "GENERAL_REFERENCE",
        topicCategory: "CULTURAL_STUDIES",
      penjelasan: "Ethnographic study of the Tengger people in East Java",
    },
    {
      judul: "Mendaras Puja Mengemas Tamasya",
      penulis: "Sony Sukmawan",
      tahunTerbit: "2022",
      tipeReferensi: "BOOK",
      citationNote: "GENERAL_REFERENCE",
        topicCategory: "TOURISM_STUDIES",
      penjelasan: "Analysis of the potential of gastronomy and tourism literature in the context of local culture",
    },
  ];

  // Static project data
  const projectSteps = [
    {
      title: "Focus Area",
      description: "The project began by focusing on culture-specific and language-specific expressions found in East Java subcultures, such as Tengger and Panaraga.",
    },
    {
      title: "Data Collection",
      description: "Cultural expressions were collected through extensive and systematic literature reviews from early 20th century colonial scholars' journals, mid-20th century scholarly works, and early 21st century contemporary research.",
    },
    {
      title: "Expert Consultation",
      description: "The team regularly consults with scholars and cultural activists specializing in the studied subcultures to ensure accuracy and cultural sensitivity.",
    },
    {
      title: "Data Categorization",
      description: "Collected data are divided into types or domains based on unique characteristics: Tenggerese and Nature, Tenggerese Ritual Performance, Daily Language and Expressions, Traditional Arts and Crafts.",
    },
    {
      title: "Digital Platform Development",
      description: "Designed a comprehensive digital platform featuring cultural-specific expressions, glosses from academic sources, commentaries and annotations, photos, videos, and 3D models for each artifact.",
    },
    {
      title: "Field Documentation",
      description: "Conducted cultural trips to document real-life cultural events using advanced media technology including 4K video, 360° photography, and 3D scanning.",
    },
    {
      title: "Objective",
      description: "To present the complexity of cultural artifacts and their context in a digital, user-friendly form accessible to both experts and the general public.",
    },
  ];

  const projectProcess = [
    {
      icon: "👥",
      title: "Specialist Teams",
      description: "Each stage is handled by dedicated specialist teams ensuring smooth and accurate execution of all project components.",
    },
    {
      icon: "📝",
      title: "Textual Analysis",
      description: "Comprehensive transcription, transliteration, translation, and annotation of cultural texts and expressions.",
    },
    {
      icon: "🎭",
      title: "Physical Analysis",
      description: "Body movement analysis through biomechanical methods to understand traditional dance and performance art.",
    },
    {
      icon: "🎵",
      title: "Auditory Analysis",
      description: "Documentation and analysis of sounds and music embedded in cultural performances and rituals.",
    },
    {
      icon: "📊",
      title: "Data Integration",
      description: "Systematic organization of multi-modal data into a unified, searchable digital database.",
    },
    {
      icon: "🌐",
      title: "Public Access",
      description: "Development of user-friendly interfaces for scholars, students, and the general public to access cultural data.",
    },
  ];

  const projectRoadmap = [
    {
      year: "2025",
      title: "Phase 1: Foundation",
      items: [
        "Database development",
        "Preliminary website launch",
        "Initial data collection",
        "Team formation",
      ],
    },
    {
      year: "2026",
      title: "Phase 2: Expansion",
      items: [
        "Database expansion",
        "Full website establishment",
        "Additional subcultures",
        "Public beta testing",
      ],
    },
    {
      year: "2027",
      title: "Phase 3: Institutionalization",
      items: [
        "Brawijaya Corpora established",
        "Special task unit formation",
        "University integration",
        "Long-term sustainability",
      ],
    },
  ];

  const platformFeatures = [
    {
      icon: "🗂️",
      title: "Comprehensive Database",
      description: "Systematic organization of cultural expressions with multi-layered annotations, glosses, and contextual information from verified academic sources.",
    },
    {
      icon: "📸",
      title: "Rich Media Documentation",
      description: "High-quality photos, 4K videos, 360° panoramas, and 3D models accompanying each cultural artifact for immersive exploration.",
    },
    {
      icon: "🔍",
      title: "Advanced Search",
      description: "Powerful search capabilities across multiple parameters: subculture, domain, time period, artifact type, and linguistic features.",
    },
    {
      icon: "🎓",
      title: "Academic Resources",
      description: "Curated references, scholarly annotations, and citation tools for researchers and students conducting cultural studies.",
    },
  ];

  const youtubeVideos = [
    {
      videoId: "p3S3Tu-cMXk",
      title: "PROFILE BRAWIJAYA CORPORA PROJECT 2025",
      description: "Watch the introduction video to understand UB Corpora's vision, mission, and impact in preserving East Java's culture.",
      thumbnail: "https://img.youtube.com/vi/p3S3Tu-cMXk/maxresdefault.jpg",
      duration: "",
    },
  ];

  const galleryPhotos = [
    "DSC08518.JPG",
    "/WhatsApp_Image_2025-09-21_at_20.07.38 2.jpeg",
    "/WhatsApp Image 2025-11-08 at 10.20.47 PM.jpeg",
    "/Rapat_2025_08_12.jpg",
    "/Rapat 2025_11_14.jpg",
  ];

  return {
    visiMisiSection,
    teamScientis: transformedTeam,
    collaborationAssets: transformedAssets,
    academicReferences,
    projectSteps,
    projectProcess,
    projectRoadmap,
    platformFeatures,
    youtubeVideos,
    galleryPhotos,
  };
};