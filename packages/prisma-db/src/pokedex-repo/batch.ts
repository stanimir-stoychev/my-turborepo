export const batchUpdatePromises = async <TEntry, TReturn>({
    batchSize = 100,
    dataSource,
    update,
}: {
    batchSize?: number;
    dataSource: TEntry[];
    update: (entry: TEntry) => Promise<TReturn>;
}) => {
    const totalBatches = Math.ceil(dataSource.length / batchSize);
    const batches = Array.from({ length: totalBatches }, (_, index) => index + 1).map((current) =>
        dataSource.slice((current - 1) * batchSize, current * batchSize),
    );

    const data: (TReturn | null)[][] = [];
    const flat: (TReturn | null)[] = [];
    const failed: null[] = [];
    const successful: TReturn[] = [];

    for (const batch of batches) {
        const batchData = await Promise.all(batch.map((entry) => update(entry).catch(() => null)));

        data.push(batchData);
        flat.push(...batchData);
        batchData.forEach((entry) => {
            if (entry) successful.push(entry);
            else failed.push(null);
        });
    }

    return {
        data,
        flat,
        failed,
        successful,
    };
};
