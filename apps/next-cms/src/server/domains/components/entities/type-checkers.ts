import type { TComponentEntity } from './entities';

export function isComponentEntity(entity: any): entity is TComponentEntity {
    return (
        typeof entity === 'object' &&
        entity !== null &&
        'id' in entity &&
        'name' in entity &&
        'description' in entity &&
        'html' in entity
    );
}
