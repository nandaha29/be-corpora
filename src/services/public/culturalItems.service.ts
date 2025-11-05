// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export const getCulturalItems = async (searchQuery: string = '', category: string = 'all', page: number = 1, limit: number = 10) => {
//   // Get subcultures
//   const subcultureWhere: any = { status: 'PUBLISHED' };
//   if (category !== 'all') {
//     subcultureWhere.culture = {
//       OR: [
//         { namaBudaya: { contains: category, mode: 'insensitive' } },
//         { provinsi: { contains: category, mode: 'insensitive' } },
//       ],
//     };
//   }
//   if (searchQuery) {
//     subcultureWhere.namaSubculture = { contains: searchQuery, mode: 'insensitive' };
//   }

//   const subcultures = await prisma.subculture.findMany({
//     where: subcultureWhere,
//     include: { culture: true, subcultureAssets: { include: { asset: true }, where: { asset: { tipe: 'FOTO' } } } },
//     take: limit / 2, // Split limit between subcultures and lexicons
//     skip: (page - 1) * (limit / 2),
//   });

//   // Get lexicons
//   const lexiconWhere: any = { status: 'PUBLISHED' };
//   if (category !== 'all') {
//     lexiconWhere.domainKodifikasi = {
//       subculture: {
//         culture: {
//           OR: [
//             { namaBudaya: { contains: category, mode: 'insensitive' } },
//             { provinsi: { contains: category, mode: 'insensitive' } },
//           ],
//         },
//       },
//     };
//   }
//   if (searchQuery) {
//     lexiconWhere.OR = [
//       { kataLeksikon: { contains: searchQuery, mode: 'insensitive' } },
//       { maknaKultural: { contains: searchQuery, mode: 'insensitive' } },
//     ];
//   }

//   const lexicons = await prisma.leksikon.findMany({
//     where: lexiconWhere,
//     include: {
//       domainKodifikasi: { include: { subculture: { include: { culture: true } } } },
//       leksikonAssets: { include: { asset: true }, where: { asset: { tipe: 'FOTO' } } },
//     },
//     take: limit / 2,
//     skip: (page - 1) * (limit / 2),
//   });

//   const subcultureItems = subcultures.map(s => ({
//     type: 'subculture',
//     id: s.slug || s.subcultureId.toString(),
//     name: s.namaSubculture,
//     description: s.penjelasan,
//     image: s.subcultureAssets[0]?.asset.url || null,
//     culture: s.culture?.namaBudaya,
//     province: s.culture?.provinsi,
//   }));

//   const lexiconItems = lexicons.map(l => ({
//     type: 'lexicon',
//     id: l.leksikonId.toString(),
//     name: l.kataLeksikon,
//     description: l.maknaKultural || l.commonMeaning,
//     image: l.leksikonAssets[0]?.asset.url || null,
//     culture: l.domainKodifikasi?.subculture?.culture?.namaBudaya,
//     province: l.domainKodifikasi?.subculture?.culture?.provinsi,
//   }));

//   const items = [...subcultureItems, ...lexiconItems];
//   // Shuffle or sort as needed
//   items.sort(() => Math.random() - 0.5); // Random order for exploration

//   return { items: items.slice(0, limit), total: items.length, page, limit };
// };