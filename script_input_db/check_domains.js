import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDomains() {
  try {
    const domains = await prisma.codificationDomain.findMany();
    console.log(`Found ${domains.length} domains:`);
    domains.forEach(domain => {
      console.log(`ID: ${domain.domainId}, Name: ${domain.domainName}, Code: ${domain.code}`);
    });
  } catch (error) {
    console.error('Error checking domains:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDomains();