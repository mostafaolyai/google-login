import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../../../common/type/role-type';

export const ROLE = 'role';
/**
 * Marks the API to need some kind of permissions
 * @constructor
 * @param options
 */
export const Role = (options: RoleType[]) => SetMetadata(ROLE, options ?? []);
