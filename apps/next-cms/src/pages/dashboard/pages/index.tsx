import Image from 'next/image';
import clsx from 'clsx';

import { api } from '~/utils/api';
import { DashboardTitle } from '~/layout';
import { HtmlBlock } from '~/utils/render';

import type { TNextPageWithLayout, TPage } from '~/types';

function PagePreviewCard({
    component = 'div',
    previewHtml,
    title,
    description,
    image,
}: TPage & { component?: keyof JSX.IntrinsicElements }) {
    const Root: React.ElementType = component;
    return (
        <Root className="flex flex-col gap-2 rounded overflow-clip bg-black/10 dark:bg-white/10">
            <section
                className={clsx('flex-1 border-b-2', {
                    'p-1': !image,
                })}
            >
                {image ? (
                    <Image src={image} alt={title} className="rounded" width={500} height={500} />
                ) : (
                    previewHtml && <HtmlBlock {...previewHtml} />
                )}
            </section>
            <section className="flex flex-col gap-1 p-2">
                <h2 className="text-lg font-bold">{title}</h2>
                {description && <p className="text-sm">{description}</p>}
            </section>
        </Root>
    );
}

const DashboardPagesHome: TNextPageWithLayout = () => {
    const { data } = api.page.getPagesArray.useQuery({ limit: 100 });

    return (
        <>
            <DashboardTitle>Pages</DashboardTitle>
            <hr className="mt-4 mb-8" />
            {data && (
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {data.map((page) => (
                        <li key={page.id}>
                            <PagePreviewCard {...page} />
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default DashboardPagesHome;
