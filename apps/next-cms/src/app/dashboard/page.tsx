import { DashboardTitle } from '~/layout';

export default function DashboardHomePage() {
    return (
        <main className="flex flex-col gap-4 px-4 py-2">
            <DashboardTitle>Dashboard</DashboardTitle>
            <hr />
            Hello from the dashboard!
        </main>
    );
}
