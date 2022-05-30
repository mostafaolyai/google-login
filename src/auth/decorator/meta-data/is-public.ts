import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC = 'is-public';

/**
 * Marks the API as a public API that does not need any checking for permission
 * @constructor
 */
export const IsPublic = () => SetMetadata(IS_PUBLIC, true);
