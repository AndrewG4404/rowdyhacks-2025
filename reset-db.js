// Reset database and reseed with correct handles
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetAndSeed() {
  try {
    console.log('🗑️ Clearing existing data...');
    
    // Clear all data in correct order (respecting foreign keys)
    await prisma.ledgerEntry.deleteMany();
    await prisma.pledge.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.account.deleteMany();
    await prisma.sponsorProfile.deleteMany();
    await prisma.user.deleteMany();
    
    console.log('✅ Database cleared');
    
    console.log('🌱 Creating demo users...');
    
    // Create demo users with exact handles the tests expect
    const carmen = await prisma.user.create({
      data: {
        auth0_sub: 'demo|carmen_martinez',
        email: 'carmen@example.com',
        handle: 'carmen',
        bio: 'Community organizer in San Antonio. Love helping local families.',
        locale: 'en',
        interests: ['community', 'education', 'healthcare'],
      },
    });

    const sam = await prisma.user.create({
      data: {
        auth0_sub: 'demo|sam_rodriguez',
        email: 'sam@example.com',
        handle: 'sam',
        bio: 'Local business owner and community supporter.',
        locale: 'en',
        interests: ['business', 'community'],
      },
    });

    const sofia = await prisma.user.create({
      data: {
        auth0_sub: 'demo|sofia_ramirez',
        email: 'sofia@example.com',
        handle: 'sofia',
        bio: 'Verified sponsor helping local families achieve their goals.',
        locale: 'en',
        interests: ['community', 'finance'],
      },
    });

    console.log('✅ Users created:', { carmen: carmen.handle, sam: sam.handle, sofia: sofia.handle });

    // Create sponsor profile for Sofia
    await prisma.sponsorProfile.create({
      data: {
        userId: sofia.id,
        verified: true,
        rating: 4.9,
      },
    });

    // Create accounts with initial balance
    await prisma.account.create({
      data: {
        ownerType: 'user',
        ownerId: carmen.id,
        balanceGLM: 1000,
      },
    });

    await prisma.account.create({
      data: {
        ownerType: 'user',
        ownerId: sam.id,
        balanceGLM: 1000,
      },
    });

    await prisma.account.create({
      data: {
        ownerType: 'user',
        ownerId: sofia.id,
        balanceGLM: 5000,
      },
    });

    console.log('✅ Accounts created');

    // Create demo posts
    const medicalPost = await prisma.post.create({
      data: {
        ownerId: carmen.id,
        title: 'Help with Medical Bills',
        description: 'I need assistance with unexpected medical bills from a recent emergency room visit. Any support would be greatly appreciated.',
        category: 'medical',
        goalGLM: 500,
        acceptContracts: true,
        status: 'open',
        images: [],
        links: [],
      },
    });

    await prisma.post.create({
      data: {
        ownerId: sam.id,
        title: 'Small Business Equipment',
        description: 'Looking to purchase new equipment for my local bakery to serve the community better.',
        category: 'community',
        goalGLM: 1000,
        acceptContracts: false,
        status: 'open',
        images: [],
        links: [],
      },
    });

    // Create post account
    await prisma.account.create({
      data: {
        ownerType: 'post',
        ownerId: medicalPost.id,
        balanceGLM: 0,
      },
    });

    console.log('✅ Posts created');
    console.log('🎉 Database reset and seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAndSeed();
