// GoLoanMe - Ledger Logic for GLM Credits
// Immutable double-entry accounting for simulated currency

import { db } from './db';
import type { LedgerRefType, OwnerType } from '@prisma/client';

/**
 * Get account balance for user or post
 */
export async function getBalance(
  ownerType: OwnerType,
  ownerId: string
): Promise<number> {
  const account = await db.account.findUnique({
    where: {
      ownerType_ownerId: {
        ownerType,
        ownerId,
      },
    },
    include: {
      ledgerEntries: true,
    },
  });

  if (!account) {
    return 0;
  }

  // Calculate balance from ledger entries
  const balance = account.ledgerEntries.reduce((sum, entry) => {
    return entry.direction === 'credit'
      ? sum + entry.amountGLM
      : sum - entry.amountGLM;
  }, 0);

  return Math.max(0, balance); // Never negative
}

/**
 * Get or create account for user/post
 */
export async function getOrCreateAccount(
  ownerType: OwnerType,
  ownerId: string,
  initialBalance: number = 0
): Promise<string> {
  const existing = await db.account.findUnique({
    where: {
      ownerType_ownerId: {
        ownerType,
        ownerId,
      },
    },
  });

  if (existing) {
    return existing.id;
  }

  const account = await db.account.create({
    data: {
      ownerType,
      ownerId,
      balanceGLM: initialBalance,
    },
  });

  return account.id;
}

/**
 * Transfer GLM between accounts (atomic transaction)
 */
export async function transferGLM(
  fromAccountId: string,
  toAccountId: string,
  amountGLM: number,
  refType: LedgerRefType,
  refId: string
): Promise<{ debitEntry: string; creditEntry: string }> {
  if (amountGLM <= 0) {
    throw new Error('Transfer amount must be positive');
  }

  // Check from account has sufficient balance
  const fromAccount = await db.account.findUnique({
    where: { id: fromAccountId },
    include: { ledgerEntries: true },
  });

  if (!fromAccount) {
    throw new Error('From account not found');
  }

  const currentBalance = fromAccount.ledgerEntries.reduce((sum, entry) => {
    return entry.direction === 'credit'
      ? sum + entry.amountGLM
      : sum - entry.amountGLM;
  }, 0);

  if (currentBalance < amountGLM) {
    throw new Error(`Insufficient balance. Available: ${currentBalance} GLM`);
  }

  // Atomic transaction - create both entries or neither
  const result = await db.$transaction(async (tx) => {
    // Debit from source account
    const debitEntry = await tx.ledgerEntry.create({
      data: {
        accountId: fromAccountId,
        direction: 'debit',
        amountGLM,
        refType,
        refId,
      },
    });

    // Credit to destination account
    const creditEntry = await tx.ledgerEntry.create({
      data: {
        accountId: toAccountId,
        direction: 'credit',
        amountGLM,
        refType,
        refId,
      },
    });

    // Update cached balances
    await tx.account.update({
      where: { id: fromAccountId },
      data: {
        balanceGLM: { decrement: amountGLM },
      },
    });

    await tx.account.update({
      where: { id: toAccountId },
      data: {
        balanceGLM: { increment: amountGLM },
      },
    });

    return {
      debitEntry: debitEntry.id,
      creditEntry: creditEntry.id,
    };
  });

  console.log(`✅ Transferred ${amountGLM} GLM: ${fromAccountId} → ${toAccountId}`);

  return result;
}

/**
 * Process donation pledge (user → post)
 */
export async function processDonation(
  userId: string,
  postId: string,
  amountGLM: number,
  pledgeId: string
): Promise<void> {
  // Get accounts
  const userAccountId = await getOrCreateAccount('user', userId);
  const postAccountId = await getOrCreateAccount('post', postId);

  // Transfer GLM
  await transferGLM(
    userAccountId,
    postAccountId,
    amountGLM,
    'pledge',
    pledgeId
  );
}

/**
 * Process contract pledge (user → post with terms)
 */
export async function processContractPledge(
  userId: string,
  postId: string,
  amountGLM: number,
  pledgeId: string
): Promise<void> {
  // Same as donation, but creates obligation record (handled in API route)
  await processDonation(userId, postId, amountGLM, pledgeId);
}

/**
 * Process repayment (post owner → sponsor)
 */
export async function processRepayment(
  fromUserId: string,
  toUserId: string,
  amountGLM: number,
  refId: string
): Promise<void> {
  const fromAccountId = await getOrCreateAccount('user', fromUserId);
  const toAccountId = await getOrCreateAccount('user', toUserId);

  await transferGLM(
    fromAccountId,
    toAccountId,
    amountGLM,
    'repayment',
    refId
  );
}

/**
 * Get ledger entries for account with pagination
 */
export async function getLedgerEntries(
  ownerType: OwnerType,
  ownerId: string,
  limit: number = 20,
  cursor?: string
) {
  const account = await db.account.findUnique({
    where: {
      ownerType_ownerId: {
        ownerType,
        ownerId,
      },
    },
  });

  if (!account) {
    return { items: [], nextCursor: null };
  }

  const entries = await db.ledgerEntry.findMany({
    where: {
      accountId: account.id,
      ...(cursor && {
        id: {
          lt: cursor,
        },
      }),
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit + 1,
  });

  const hasMore = entries.length > limit;
  const items = hasMore ? entries.slice(0, -1) : entries;
  const nextCursor = hasMore ? items[items.length - 1]?.id : null;

  return {
    items,
    nextCursor,
  };
}

/**
 * Create transfer between accounts (for admin/dev tool)
 */
export async function createTransfer(
  fromAccountId: string,
  toAccountId: string,
  amountGLM: number,
  _note: string,
  _actorId: string
): Promise<Array<{ id: string; accountId: string; direction: string; amountGLM: number; refType: string; refId: string; createdAt: Date }>> {
  if (amountGLM <= 0) {
    throw new Error('Transfer amount must be positive');
  }

  // Generate a unique reference ID for this transfer
  const transferId = crypto.randomUUID();

  // Use existing transferGLM function for atomic transaction
  await transferGLM(
    fromAccountId,
    toAccountId,
    amountGLM,
    'transfer',
    transferId
  );

  // Return the created ledger entries
  const entries = await db.ledgerEntry.findMany({
    where: {
      refId: transferId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return entries.map(entry => ({
    id: entry.id,
    accountId: entry.accountId,
    direction: entry.direction,
    amountGLM: entry.amountGLM,
    refType: entry.refType,
    refId: entry.refId,
    createdAt: entry.createdAt,
  }));
}

/**
 * Create repayment transfer (post owner -> sponsor)
 */
export async function createRepayment(
  fromUserId: string,
  toUserId: string,
  amountGLM: number,
  _note: string
): Promise<Array<{ id: string; accountId: string; direction: string; amountGLM: number; refType: string; refId: string; createdAt: Date }>> {
  if (amountGLM <= 0) {
    throw new Error('Repayment amount must be positive');
  }

  // Generate a unique reference ID for this repayment
  const repaymentId = crypto.randomUUID();

  // Use existing processRepayment function for atomic transaction
  await processRepayment(fromUserId, toUserId, amountGLM, repaymentId);

  // Return the created ledger entries
  const entries = await db.ledgerEntry.findMany({
    where: {
      refId: repaymentId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return entries.map(entry => ({
    id: entry.id,
    accountId: entry.accountId,
    direction: entry.direction,
    amountGLM: entry.amountGLM,
    refType: entry.refType,
    refId: entry.refId,
    createdAt: entry.createdAt,
  }));
}

/**
 * Get post funding stats
 */
export async function getPostStats(postId: string) {
  const pledges = await db.pledge.findMany({
    where: { postId },
    include: {
      pledger: true,
    },
  });

  const fundedGLM = pledges.reduce((sum, p) => sum + p.amountGLM, 0);
  const donors = new Set(
    pledges.filter((p) => p.type === 'donation').map((p) => p.pledgerId)
  ).size;
  const sponsors = new Set(
    pledges.filter((p) => p.type === 'contract').map((p) => p.pledgerId)
  ).size;

  return {
    fundedGLM,
    donors,
    sponsors,
  };
}

