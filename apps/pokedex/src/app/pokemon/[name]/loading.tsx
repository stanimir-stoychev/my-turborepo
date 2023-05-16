import { PokemonHeroSkeleton } from './components';

export default function LoadingSkeleton() {
    return (
        <main className="container flex flex-col items-center h-full p-4 pb-0 mx-auto">
            <PokemonHeroSkeleton />
        </main>
    );
}
