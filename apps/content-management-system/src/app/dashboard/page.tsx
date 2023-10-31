import { withAuthenticatedUserProvider } from '@/app/dashboard/_components';

function Dashboard() {
    return <>Hello from the Dashboard!</>;
}

export default withAuthenticatedUserProvider(Dashboard);
