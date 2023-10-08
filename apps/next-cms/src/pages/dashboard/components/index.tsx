import { DashboardTitle } from '~/layout';
import { CreateNewComponent, DashboardComponentsProvider, Grid, SearchField } from '~/views/dashboard/components';

import type { TNextPageWithLayout } from '~/types';

const DashboardComponentsRoot: TNextPageWithLayout = () => (
    <DashboardComponentsProvider className="px-4 py-2" mainProps={{ className: 'flex flex-col gap-4' }}>
        <DashboardTitle>Components</DashboardTitle>
        <hr />
        <div className="flex items-center justify-between gap-2">
            <SearchField />
            <Grid.SizeToggle />
        </div>
        <Grid className="flex-1 overflow-auto" />
        <aside className="fixed z-10 right-2 bottom-2">
            <CreateNewComponent.Fab />
        </aside>
        <CreateNewComponent />
    </DashboardComponentsProvider>
);

export default DashboardComponentsRoot;
