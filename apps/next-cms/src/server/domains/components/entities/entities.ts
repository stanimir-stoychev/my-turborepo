export type TComponentEntity = {
    id: number;
    name: string;
    description: string;
    htmlProps?: Partial<{
        id: string;
        className: string;
        style: string;
        component: string;
    }>;
    html: (string | TComponentEntity)[];
};
