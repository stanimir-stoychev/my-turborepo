export type TComponentEntity = {
    id: number;
    name: string;
    description: string;
    html: string | TComponentEntity | (string | TComponentEntity)[];
};
