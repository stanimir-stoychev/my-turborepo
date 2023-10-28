import { GRID_SIZES } from './constants';
import type { TCreateNewComponentServerAction, TFindComponentsServerAction } from '../_actions';
import { useAction } from 'next-safe-action/hook';

export type TGridSize = (typeof GRID_SIZES)[number];

export type TDashboardComponentsPage = {
    minSearchTermLength: [number, React.Dispatch<React.SetStateAction<number>>];
    gridSize: [TGridSize, React.Dispatch<React.SetStateAction<TGridSize>>];
    searchTerm: [string | undefined, React.Dispatch<React.SetStateAction<string | undefined>>];
    isCreateNewDrawerOpen: [boolean, React.Dispatch<React.SetStateAction<boolean>>];

    serverActions: {
        createNewComponent: TCreateNewComponentServerAction.Action;
        findComponents: TFindComponentsServerAction.Action;
    };

    apiData: {
        createNewComponent: ReturnType<
            typeof useAction<TCreateNewComponentServerAction.Schema, TCreateNewComponentServerAction.Data>
        >;

        findComponents: {
            data: TFindComponentsServerAction.Data[];
            fetchNextPage: () => void;
            hasNextPage: boolean;
            isLoading: boolean;
        };
    };
};

/*
const useInfinitePokemon = (searchQuery: PokemonCardsListProps) => {
    const { data: zactData, isLoading: zactIsLoading, mutate } = useZact(pokemonSearchAction);
    const [data, setData] = useState([] as NonNullable<typeof zactData>[]);
    const [nextPageParams, setNextPageParams] = useState(searchQuery);
    const [isLoading, setIsLoading] = useState(false);
    const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

    const fetchNextPage = useCallback(() => {
        if (isLoading || zactIsLoading) return;

        setHasFetchedOnce(true);
        setIsLoading(true);
        mutate(nextPageParams);
    }, [nextPageParams, isLoading, zactIsLoading, mutate]);

    useEffect(() => {
        if (!zactData) return;

        setIsLoading(false);
        setData((prevData) => [...prevData, zactData]);
        setNextPageParams((prevParams) => ({
            ...prevParams,
            cursor: zactData?.nextCursor,
        }));
    }, [zactData]);

    return {
        data,
        fetchNextPage,
        hasNextPage: !hasFetchedOnce ? true : !!zactData?.nextCursor,
        isLoading: zactIsLoading || isLoading,
    };
};
*/
