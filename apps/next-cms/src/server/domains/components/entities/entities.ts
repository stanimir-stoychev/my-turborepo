export type TComponentEntity = {
    id: number;
    name: string;
    description: string;
    htmlProps?: Partial<{ id: string; className: string; style: string }>;
    html:
        | string
        | Pick<TComponentEntity, 'html' | 'htmlProps'>
        | (string | Pick<TComponentEntity, 'html' | 'htmlProps'>)[];
};
