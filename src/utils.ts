export function pickRandom<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Selects a key from a weights object via weighted random selection
 * Each value is a % so the total should be 100.
 */
export function weightedPick<T extends string>(weights: Record<T, number>): T {
    const entries = Object.entries(weights) as [T, number][];
    const roll = Math.random() * 100;
    let cumulative = 0;
    for (const [key, weight] of entries) {
        cumulative += weight;
        if (roll < cumulative) return key;
    }
    return entries[entries.length - 1][0];
}

/**
 * Retries an async function up to maxAttempts times with exponential backoff.
 * Covers both AI rate limits and transient network failures.
 * Example: withRetry(() => observeSuit(imageBuffer))
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    maxAttempts = 3
): Promise<T> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (err) {
            if (attempt === maxAttempts) throw err;
            await new Promise(r => setTimeout(r, 1000 * attempt));
        }
    }
    throw new Error('Unreachable');
}