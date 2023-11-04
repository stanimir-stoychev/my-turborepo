import {
    createComponentGateway,
    deleteComponentGateway,
    findComponentsGateway,
    readComponentGateway,
    updateComponentGateway,
} from '../_actions';

const ROOT_KEY = 'dashboard/components';

export const queryKeys = {
    root: [ROOT_KEY],

    total: [ROOT_KEY, 'total'],
    find: (query: Parameters<typeof findComponentsGateway>[0]) => [ROOT_KEY, 'find', query] as const,
    create: (data: Parameters<typeof createComponentGateway>[0]) => [ROOT_KEY, 'create', data] as const,
    read: (id: Parameters<typeof readComponentGateway>[0]) => [ROOT_KEY, 'read', id] as const,
    update: (data: Parameters<typeof updateComponentGateway>[0]) => [ROOT_KEY, 'update', data] as const,
    delete: (id: Parameters<typeof deleteComponentGateway>[0]) => [ROOT_KEY, 'delete', id] as const,

    infiniteSearch: (query: Parameters<typeof findComponentsGateway>[0]) =>
        [ROOT_KEY, 'find', 'infinite', query] as const,
} as const;
