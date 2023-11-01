import { DashboardTitle } from '~/layout';
import { createNewComponentServerAction, findComponentsServerAction, updateComponentServerAction } from './_actions';
import {
    DashboardComponentsProvider,
    SearchField,
    CreateNewComponentDrawer,
    CreateNewComponentDrawerOpenButton,
    Grid,
    GridSizeToggle,
} from './_components';

export default function DashboardComponentsPage() {
    return (
        <main className="relative flex flex-col gap-4 px-4 py-2">
            <DashboardComponentsProvider
                serverActions={{
                    createNewComponent: createNewComponentServerAction,
                    updateComponent: updateComponentServerAction,
                    findComponents: findComponentsServerAction,
                }}
            >
                <DashboardTitle>Components</DashboardTitle>
                <hr />
                <div className="flex items-center justify-between gap-2">
                    <SearchField />
                    <GridSizeToggle />
                </div>
                <Grid className="flex-1 overflow-auto" />
                <aside className="fixed z-10 right-2 bottom-2">
                    <CreateNewComponentDrawerOpenButton />
                </aside>
                <CreateNewComponentDrawer />
            </DashboardComponentsProvider>
        </main>
    );
}
