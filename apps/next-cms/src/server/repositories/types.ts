import { z } from 'zod';

export const QUERY_LIMITERS = z.object({
    cursor: z.number().int().min(0).optional(),
    limit: z.number().int().min(1).max(100).optional(),
});

export type TQueryLimiters = z.infer<typeof QUERY_LIMITERS>;
