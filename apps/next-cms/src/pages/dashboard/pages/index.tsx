import { DashboardTitle } from '~/layout';
import type { TNextPageWithLayout } from '~/types';

const DashboardPagesHome: TNextPageWithLayout = () => (
    <>
        <DashboardTitle>Pages</DashboardTitle>
        Hello from the dashboard pages!
    </>
);

export default DashboardPagesHome;
