import { DashboardTitle } from '~/layout';
import { DashboardComponentsProvider, Grid, SearchField } from '~/views/dashboard/components';

import type { TNextPageWithLayout } from '~/types';

const DashboardComponentsRoot: TNextPageWithLayout = () => (
    <main className="flex flex-col gap-4 px-4 py-2">
        <DashboardComponentsProvider>
            <DashboardTitle>Components</DashboardTitle>
            <hr />
            <div className="flex items-center justify-between gap-2">
                <SearchField />
                <Grid.SizeToggle />
            </div>
            <Grid className="flex-1 overflow-auto" />
        </DashboardComponentsProvider>
    </main>
);

export default DashboardComponentsRoot;
