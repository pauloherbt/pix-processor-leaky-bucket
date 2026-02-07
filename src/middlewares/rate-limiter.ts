import { GraphQLResolveInfo } from 'graphql';

export interface Bucket {
  tokens: number;
  lastRefillAt: Date;
}

export interface RateLimitContext {
  userId: string;
  [key: string]: unknown;
}

// Interface mínima que o resultado da mutation deve ter
interface MutationResultBase {
  success?: boolean;
  message?: string | null;
  remainingTokens?: number | null; // Opcional na entrada, mas será preenchido na saída
  [key: string]: any;
}

// Tipo Genérico para uma Função Resolver isolada
type ResolverFn<TArgs, TResult> = (
  parent: any,
  args: TArgs,
  context: RateLimitContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

const MAX_TOKENS = 10;
const REFILL_INTERVAL_MS = 60 * 60 * 1000;

const buckets: Record<string, Bucket> = {
  '123': {
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
  buckets[userId] = bucket;
  return;
}

function hasBucketChanged(oldBucket: Bucket, newBucket: Bucket): boolean {
  return (
    oldBucket.tokens !== newBucket.tokens ||
    oldBucket.lastRefillAt.getTime() !== newBucket.lastRefillAt.getTime()
  );
}
export const withRateLimit =
  <TArgs, TResult extends MutationResultBase>(
    next: ResolverFn<TArgs, TResult>,
  ): ResolverFn<TArgs, TResult> =>
  async (parent, args, context, info) => {
    const bucket = await getBucketForUser(context.userId);
    console.log('Bucket before refill:', bucket);

    const updatedBucket = refillBucket(bucket);
    console.log('Bucket after refill:', updatedBucket);

    if (updatedBucket.tokens < 1) {
      throw new Error('Rate limit exceeded');
    }

    const result = await next(parent, args, context, info);

    if (!result.success) {
      updatedBucket.tokens -= 1;
    }

    if (hasBucketChanged(bucket, updatedBucket)) {
      await updateBucket(context.userId, updatedBucket);
    }

    return result as TResult;
  };
