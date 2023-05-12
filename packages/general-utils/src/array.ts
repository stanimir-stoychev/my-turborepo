export const ArrayUtils = {
    removeFalsyValues: <T>(arr: (T | null | undefined)[]) => arr.filter(Boolean) as T[],
} as const;
