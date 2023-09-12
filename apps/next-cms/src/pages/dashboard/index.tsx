import { DashboardTitle } from '~/layout';
import type { TNextPageWithLayout } from '~/types';

const DashboardHome: TNextPageWithLayout = () => (
    <>
        <DashboardTitle>Dashboard</DashboardTitle>
        Hello from the dashboard!
    </>
);

export default DashboardHome;
