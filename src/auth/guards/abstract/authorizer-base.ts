import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * An interface to handle authorization
 */
export abstract class AuthorizerBase {
    /**
     * @param context
     * @param reflector
     */
    abstract canAccess(context: ExecutionContext, reflector: Reflector): Promise<boolean>;
}