interface Bucket {
  tokens: number;
  lastRefillAt: Date;
}

class PixProcessor {
  // userId
  // tokens
  // lastUpdate

  getBucketForUser(userId: string): Promise<Bucket> {
    // Fetch bucket from database or cache
    return Promise.resolve({
      tokens: 10,
      lastRefillAt: new Date(),
    });
  }

  refillBucket(bucket: Bucket) {
    const now = new Date();
    const secondsSinceLastRefill = (now.getTime() - bucket.lastRefillAt.getTime()) / 1000;
    const tokensToAdd = Math.floor(secondsSinceLastRefill / 3600); // Refill 1 token per hour

    if (tokensToAdd < 1) {
      return bucket;
    }

    return {
      ...bucket,
      tokens: Math.min(bucket.tokens + tokensToAdd, 10),
      lastRefillAt: now,
    };
  }

  simulateRequest() {
    return Math.random() < 0.5;
  }

  updateBucket(userId: string, bucket: Bucket): Promise<void> {
    // Update bucket in database or cache
    return Promise.resolve();
  }

  async execute(userInfo) {
    const bucket = await this.getBucketForUser(userInfo.userId);

    const updatedBucket = this.refillBucket(bucket);

    if (updatedBucket.tokens < 1) {
      throw new Error('Rate limit exceeded');
    }

    updatedBucket.tokens -= 1;

    const success = this.simulateRequest();

    if (success) {
      updatedBucket.tokens += 1;
      await this.updateBucket(userInfo.userId, updatedBucket);
      return {
        success: true,
        message: 'Request successful',
      };
    }

    await this.updateBucket(userInfo.userId, updatedBucket);
    return {
      success: false,
      message: 'Request failed',
    };
  }
}
