// GoLoanMe - Database Seed Script
// Creates demo users, posts, and GLM balances

import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo users
  const carmen = await db.user.upsert({
    where: { email: 'carmen@demo.local' },
    update: {},
    create: {
      auth0_sub: 'demo|carmen',
      email: 'carmen@demo.local',
      handle: 'carmen_martinez',
      bio: 'Community organizer in San Antonio. Love helping local families.',
      locale: 'en',
      interests: ['education', 'healthcare', 'community'],
    },
  });

  const sam = await db.user.upsert({
    where: { email: 'sam@demo.local' },
    update: {},
    create: {
      auth0_sub: 'demo|sam',
      email: 'sam@demo.local',
      handle: 'sam_nguyen',
      bio: 'Donor and community supporter.',
      locale: 'en',
      interests: ['pets', 'vet', 'community'],
    },
  });

  const sofia = await db.user.upsert({
    where: { email: 'sofia@demo.local' },
    update: {},
    create: {
      auth0_sub: 'demo|sofia',
      email: 'sofia@demo.local',
      handle: 'sofia_ramirez',
      bio: 'Verified sponsor helping local families.',
      locale: 'es',
      interests: ['community', 'education', 'medical'],
    },
  });

  // Create sponsor profile for Sofia
  await db.sponsorProfile.upsert({
    where: { userId: sofia.id },
    update: {},
    create: {
      userId: sofia.id,
      verified: true,
      rating: 4.9,
    },
  });

  // Create user accounts with starting balance
  const carmenAccount = await db.account.upsert({
    where: {
      ownerType_ownerId: {
        ownerType: 'user',
        ownerId: carmen.id,
      },
    },
    update: {},
    create: {
      ownerType: 'user',
      ownerId: carmen.id,
      balanceGLM: 500,
    },
  });

  await db.account.upsert({
    where: {
      ownerType_ownerId: {
        ownerType: 'user',
        ownerId: sam.id,
      },
    },
    update: {},
    create: {
      ownerType: 'user',
      ownerId: sam.id,
      balanceGLM: 1000,
    },
  });

  await db.account.upsert({
    where: {
      ownerType_ownerId: {
        ownerType: 'user',
        ownerId: sofia.id,
      },
    },
    update: {},
    create: {
      ownerType: 'user',
      ownerId: sofia.id,
      balanceGLM: 2000,
    },
  });

  // Create demo post
  const bikePost = await db.post.upsert({
    where: { id: 'demo_post_1' },
    update: {},
    create: {
      id: 'demo_post_1',
      ownerId: carmen.id,
      title: 'Bike for commuting to work',
      description: 'I need a reliable bicycle to commute to my new job. Public transit adds 2 hours to my day. A bike would save time and money.',
      category: 'education',
      goalGLM: 300,
      images: [],
      links: [],
      acceptContracts: true,
      status: 'open',
    },
  });

  // Create post account
  await db.account.upsert({
    where: {
      ownerType_ownerId: {
        ownerType: 'post',
        ownerId: bikePost.id,
      },
    },
    update: {},
    create: {
      ownerType: 'post',
      ownerId: bikePost.id,
      balanceGLM: 0,
    },
  });

  console.log('✅ Seed data created:');
  console.log(`  - Users: carmen_martinez, sam_nguyen, sofia_ramirez (verified)`);
  console.log(`  - Post: "${bikePost.title}"`);
  console.log(`  - Carmen account balance: ${carmenAccount.balanceGLM} GLM`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

