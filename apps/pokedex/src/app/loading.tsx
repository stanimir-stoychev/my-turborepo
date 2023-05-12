import { PokemonCardSkeletons } from './components';

export default function LoadingSkeleton() {
    return (
        <main className="container grid grid-cols-2 gap-4 p-4 mx-auto md:grid-cols-4">
            <PokemonCardSkeletons length={20} />
        </main>
    );
}
