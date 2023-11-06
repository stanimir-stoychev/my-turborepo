import type { TComponentEntity } from '~/server/domains/components';

export type THtmlComponent = Pick<TComponentEntity, 'html' | 'htmlProps'>;
