import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Returns current user in shape of {@link UserIdentity}
 */
export const CurrentIdentity = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request['identity'];
    },
);
