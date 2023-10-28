import { DashboardTitle } from '~/layout';
import type { TNextPageWithLayout } from '~/types';

const DashboardHome: TNextPageWithLayout = () => (
    <main className="flex flex-col gap-4 px-4 py-2">
        <DashboardTitle>Dashboard</DashboardTitle>
        <hr />
        Hello from the dashboard!
    </main>
);

export default DashboardHome;
