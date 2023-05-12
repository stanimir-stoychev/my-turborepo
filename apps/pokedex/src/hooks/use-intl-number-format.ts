import { useMemo, useState } from 'react';

export const useIntlNumberFormat = (options?: Intl.NumberFormatOptions) => {
    const [intlOptions, setIntlOptions] = useState(() => options);
    const numberFormat = useMemo(() => new Intl.NumberFormat('en-US', intlOptions), [intlOptions]);

    return [numberFormat, setIntlOptions] as const;
};
