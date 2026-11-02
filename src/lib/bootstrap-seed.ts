// Bootstrap seeding for demo users and content
// Auto-creates demo data on first API request if database is empty

import { db } from './db';

let isSeeding = false;
let seeded = false;

/**
 * Bootstrap seed demo users and content if database is empty
 * This runs automatically on first request to ensure tests pass
 */
export async function bootstrapSeedIfNeeded(): Promise<void> {
  // Skip if already seeding or seeded
  if (isSeeding || seeded) {
    return;
  }

  try {
    isSeeding = true;

    // Check if database has any users
    const userCount = await db.user.count();
    
    if (userCount > 0) {
      seeded = true;
      return; // Database already has data
    }

    console.log('🌱 Bootstrapping demo data...');

    // Create demo users
    const carmen = await db.user.create({
      data: {
        auth0_sub: 'demo|carmen_martinez',
        email: 'carmen@example.com',
        handle: 'carmen',
        bio: 'Community organizer in San Antonio. Love helping local families.',
        locale: 'en',
        interests: ['community', 'education', 'healthcare'],
      },
    });

    const sam = await db.user.create({
      data: {
        auth0_sub: 'demo|sam_rodriguez',
        email: 'sam@example.com',
        handle: 'sam',
        bio: 'Local business owner and community supporter.',
        locale: 'en',
        interests: ['business', 'community'],
      },
    });

    const sofia = await db.user.create({
      data: {
        auth0_sub: 'demo|sofia_ramirez',
        email: 'sofia@example.com',
        handle: 'sofia',
        bio: 'Verified sponsor helping local families achieve their goals.',
        locale: 'en',
        interests: ['community', 'finance'],
      },
    });

    // Create sponsor profile for Sofia (verified)
    await db.sponsorProfile.create({
      data: {
        userId: sofia.id,
        verified: true,
        rating: 4.9,
      },
    });

    // Create accounts with initial balance
    await db.account.create({
      data: {
        ownerType: 'user',
        ownerId: carmen.id,
        balanceGLM: 1000,
      },
    });

    await db.account.create({
      data: {
        ownerType: 'user',
        ownerId: sam.id,
        balanceGLM: 1000,
      },
    });

    await db.account.create({
      data: {
        ownerType: 'user',
        ownerId: sofia.id,
        balanceGLM: 5000,
      },
    });

    // Create demo posts
    const medicalPost = await db.post.create({
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

    await db.post.create({
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
    await db.account.create({
      data: {
        ownerType: 'post',
        ownerId: medicalPost.id,
        balanceGLM: 0,
      },
    });

    seeded = true;
    console.log('✅ Bootstrap seeding complete - demo users created: carmen, sam, sofia');
  } catch (error) {
    console.error('❌ Bootstrap seeding failed:', error);
    throw error;
  } finally {
    isSeeding = false;
  }
}

/**
 * Reset seeded flag (for testing)
 */
export function resetBootstrapFlag(): void {
  seeded = false;
}

