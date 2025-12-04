import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createContributor() {
  try {
    await prisma.contributor.upsert({
      where: { contributorId: 1 },
      update: {},
      create: {
        contributorId: 1,
        contributorName: 'Default Contributor',
        institution: 'Unknown',
        email: 'default@example.com',
        expertiseArea: 'General',
        contactInfo: '',
        displayPriorityStatus: 'LOW',
        isCoordinator: false,
        coordinatorStatus: 'INACTIVE',
        registeredAt: new Date()
      }
    });
    console.log('Contributor 1 created or already exists');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createContributor();