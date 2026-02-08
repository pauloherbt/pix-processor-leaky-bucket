import { Context, Next } from 'koa';
export interface Bucket {
  tokens: number;
  lastRefillAt: Date;
}

const MAX_TOKENS = 10;
const REFILL_INTERVAL_MS = 60 * 60 * 1000;

const buckets: Record<string, Bucket> = {
  '2': {
    tokens: 10,
    lastRefillAt: new Date('2026-02-07T00:00:00.000Z'),
  },
};
function getBucketForUser(userId: string): Promise<Bucket> {
  // Fetch bucket from database or cache
  return Promise.resolve(buckets[userId]);
}

function refillBucket(bucket: Bucket) {
  const now = new Date();
  const timePassed = now.getTime() - bucket.lastRefillAt.getTime();
  const tokensToAdd = Math.floor(timePassed / REFILL_INTERVAL_MS);

  if (tokensToAdd < 1) {
    return { ...bucket };
  }

  const tokens = Math.min(bucket.tokens + tokensToAdd, MAX_TOKENS);
  const lastRefillAt =
    tokens === MAX_TOKENS
      ? now
      : new Date(bucket.lastRefillAt.getTime() + tokensToAdd * REFILL_INTERVAL_MS);

  return {
    ...bucket,
    tokens,
    lastRefillAt,
  };
}

function updateBucket(userId: string, bucket: Bucket): Promise<void> {
  // Update bucket in database or cache
  buckets[userId] = { ...bucket };
  return;
}

function hasBucketChanged(oldBucket: Bucket, newBucket: Bucket): boolean {
  return (
    oldBucket.tokens !== newBucket.tokens ||
    oldBucket.lastRefillAt.getTime() !== newBucket.lastRefillAt.getTime()
  );
}

export const withRateLimit = async (ctx: Context, next: Next) => {
  const identifier = ctx.state.userId;

  if (!identifier) {
    await next();
    return;
  }

  const bucket = await getBucketForUser(identifier);

  const updatedBucket = refillBucket(bucket);

  if (updatedBucket.tokens < 1) {
    throw new Error('Rate limit exceeded');
  }

  ctx.state.bucket = updatedBucket;
  await next();

  const result = typeof ctx.body === 'string' ? JSON.parse(ctx.body) : ctx.body;
  if (!result.success) {
    updatedBucket.tokens -= 1;
  }

  if (hasBucketChanged(bucket, updatedBucket)) {
    await updateBucket(identifier, updatedBucket);
  }

  ctx.body = {
    ...result,
  };
};
