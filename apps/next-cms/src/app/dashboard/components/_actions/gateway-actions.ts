'use server';

import { ComponentsGateway } from '~/server/domains/components';

export const getTotalComponentsGateway = ComponentsGateway.total;
export const findComponentsGateway = ComponentsGateway.find;
export const createComponentGateway = ComponentsGateway.create;
export const readComponentGateway = ComponentsGateway.read;
export const updateComponentGateway = ComponentsGateway.update;
export const deleteComponentGateway = ComponentsGateway.delete;

export { isGatewayError } from '~/server/domains/components/gateways/types';
