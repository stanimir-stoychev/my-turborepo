import { AuthenticatedUserActionsToolbar, SignInButton } from '@/app/_components';

export default function Home() {
    return (
        <>
            <AuthenticatedUserActionsToolbar />
            <main>
                <p>This is the main page of the public website</p>
            </main>
        </>
    );
}

// export default withPublicLayout(Home);
