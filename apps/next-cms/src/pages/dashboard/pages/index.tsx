import { api } from '~/utils/api';
import { DashboardTitle } from '~/layout';
import { HtmlBlock } from '~/utils/render';

import type { TNextPageWithLayout } from '~/types';

const DashboardPagesHome: TNextPageWithLayout = () => {
    const { data, isLoading } = api.page.getPage.useQuery('test');

    return (
        <>
            <DashboardTitle>Pages</DashboardTitle>
            <br className="mt-4 mb-8" />
            <HtmlBlock {...data?.html} />
        </>
    );
};

export default DashboardPagesHome;
